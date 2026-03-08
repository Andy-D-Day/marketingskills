#!/usr/bin/env node

const API_KEY = process.env.FIREFLIES_API_KEY
const BASE_URL = 'https://api.fireflies.ai/graphql'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'FIREFLIES_API_KEY environment variable required' }))
  process.exit(1)
}

function parseArgs(args) {
  const result = { _: [] }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = args[i + 1]
      if (next && !next.startsWith('--')) {
        result[key] = next
        i++
      } else {
        result[key] = true
      }
    } else {
      result._.push(arg)
    }
  }
  return result
}

const args = parseArgs(process.argv.slice(2))
const [cmd, sub, ...rest] = args._

async function graphql(query, variables = {}) {
  if (args['dry-run']) {
    return { _dry_run: true, url: BASE_URL, query, variables }
  }
  const { execFileSync } = require('child_process')
  const postData = JSON.stringify({ query, variables })
  const body = execFileSync('curl', ['-s', '-X', 'POST', BASE_URL, '-H', `Authorization: Bearer ${API_KEY}`, '-H', 'Content-Type: application/json', '-d', postData], { encoding: 'utf8' })
  const json = JSON.parse(body)
  if (json.errors) return { errors: json.errors }
  return json.data
}

function sanitize(name) {
  return (name || 'untitled').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 80)
}

const LIST_QUERY = `query($limit: Int, $skip: Int) {
  transcripts(limit: $limit, skip: $skip) {
    id
    title
    date
    dateString
    duration
    participants
    transcript_url
  }
}`

const FULL_TRANSCRIPT_QUERY = `query($id: String!) {
  transcript(id: $id) {
    id
    title
    date
    dateString
    duration
    participants
    meeting_attendees { displayName email phoneNumber name }
    sentences { text speaker_name start_time end_time }
    summary { keywords action_items outline overview short_summary topics_discussed }
    transcript_url
    audio_url
    video_url
  }
}`

const USER_QUERY = `query { user { user_id email name } }`

const limit = args.limit ? Number(args.limit) : 50
const skip = args.skip ? Number(args.skip) : 0

async function main() {
  let result

  switch (cmd) {
    case 'transcripts':
      switch (sub) {
        case 'list':
          result = await graphql(LIST_QUERY, { limit, skip })
          break
        case 'get': {
          const id = args.id
          if (!id) { result = { error: '--id required (transcript ID)' }; break }
          result = await graphql(FULL_TRANSCRIPT_QUERY, { id })
          break
        }
        case 'download-all': {
          const fs = require('fs')
          const path = require('path')
          const outputDir = args['output-dir'] || './fireflies-transcripts'

          if (args['dry-run']) {
            result = { _dry_run: true, action: 'download-all', output_dir: outputDir, note: 'Would paginate through all transcripts and save each as JSON' }
            break
          }

          if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

          let currentSkip = 0
          const batchLimit = 50
          let totalDownloaded = 0
          let hasMore = true

          while (hasMore) {
            const listResult = await graphql(LIST_QUERY, { limit: batchLimit, skip: currentSkip })
            const transcripts = listResult.transcripts
            if (!transcripts || transcripts.length === 0) { hasMore = false; break }

            for (const t of transcripts) {
              const filename = `${t.id}-${sanitize(t.title)}.json`
              const filepath = path.join(outputDir, filename)
              if (fs.existsSync(filepath)) {
                console.error(`Skipping (exists): ${t.title} (${t.id})`)
                totalDownloaded++
                continue
              }
              console.error(`Downloading: ${t.title} (${t.id})...`)
              const full = await graphql(FULL_TRANSCRIPT_QUERY, { id: t.id })
              fs.writeFileSync(filepath, JSON.stringify(full.transcript, null, 2))
              totalDownloaded++
            }

            currentSkip += transcripts.length
            if (transcripts.length < batchLimit) hasMore = false
          }

          result = { success: true, total_downloaded: totalDownloaded, output_dir: outputDir }
          break
        }
        default:
          result = { error: 'Unknown transcripts subcommand. Use: list, get, download-all' }
      }
      break

    case 'user':
      result = await graphql(USER_QUERY)
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          transcripts: 'transcripts [list [--limit N --skip N] | get --id <id> | download-all [--output-dir <dir>]]',
          user: 'user',
          options: '--dry-run --limit <n> --skip <n>',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
