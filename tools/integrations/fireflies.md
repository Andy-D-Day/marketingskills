# Fireflies.ai

AI meeting transcription platform that records, transcribes, and analyzes meetings with speaker identification and AI summaries.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | GraphQL API |
| MCP | - | Not available |
| CLI | ✓ | [fireflies.js](../clis/fireflies.js) |
| SDK | - | GraphQL client libraries work |

## Authentication

- **Type**: Bearer Token
- **Header**: `Authorization: Bearer {api_key}`
- **Get key**: Fireflies account > Integrations > Fireflies API
- **Docs**: https://docs.fireflies.ai/

## Common Agent Operations

### Get current user

```graphql
POST https://api.fireflies.ai/graphql

query {
  user {
    user_id
    email
    name
  }
}
```

### List transcripts

```graphql
query($limit: Int, $skip: Int) {
  transcripts(limit: $limit, skip: $skip) {
    id
    title
    date
    dateString
    duration
    participants
    transcript_url
  }
}
```

Variables: `{ "limit": 50, "skip": 0 }`

### Get full transcript

```graphql
query($id: String!) {
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
}
```

Variables: `{ "id": "transcript-id-here" }`

## Key Data Fields

### Transcript Fields

- `id` - Unique transcript ID
- `title` - Meeting title
- `date` / `dateString` - Meeting timestamp
- `duration` - Duration in minutes
- `participants` - List of participant names
- `meeting_attendees` - Detailed attendee info (name, email, phone)

### Sentences (speaker-attributed transcript)

- `text` - What was said
- `speaker_name` - Who said it
- `start_time` / `end_time` - Timestamps in seconds

### AI Summary

- `short_summary` - Brief meeting overview
- `overview` - Detailed overview
- `action_items` - Extracted action items
- `keywords` - Key topics
- `topics_discussed` - Topic list
- `outline` - Meeting outline

### AI Filters on Sentences

- `task` - Task-related sentences
- `pricing` - Pricing discussions
- `metric` - Metrics mentioned
- `question` - Questions asked
- `sentiment` - Positive/negative/neutral

## Pagination

- Uses `skip` / `limit` pattern
- Default limit: 50
- Paginate by incrementing `skip` by the number of results returned
- Stop when fewer results than `limit` are returned

## When to Use

- Downloading meeting transcripts for analysis
- Extracting action items from meetings
- Building meeting intelligence dashboards
- Content repurposing from meeting recordings
- Sales call analysis

## Relevant Skills

- `download-fireflies-transcripts` - Bulk download all transcripts
