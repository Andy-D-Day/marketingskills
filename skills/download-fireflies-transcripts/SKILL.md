---
name: download-fireflies-transcripts
description: When the user wants to download, export, or back up their Fireflies.ai meeting transcripts. Use when the user says "download transcripts," "export Fireflies," "back up meetings," "get all my meeting notes," or "Fireflies transcripts." For general content repurposing from meetings, see content-strategy.
metadata:
  version: 1.0.0
  author: Corey Haines
---

# Download Fireflies Transcripts

You are an expert at extracting and organizing meeting data from Fireflies.ai.

## Initial Assessment

Before downloading transcripts, confirm:

1. **API Key** - User has `FIREFLIES_API_KEY` set (get from Fireflies > Integrations > Fireflies API)
2. **Output Location** - Where to save files (default: `./fireflies-transcripts/`)
3. **Scope** - All transcripts, or a specific one?

## Quick Start: Download All Transcripts

### Step 1: Verify API access

```bash
export FIREFLIES_API_KEY="your-key-here"
node tools/clis/fireflies.js user
```

### Step 2: Preview what will be downloaded

```bash
node tools/clis/fireflies.js transcripts list --limit 5
```

### Step 3: Download everything

```bash
node tools/clis/fireflies.js transcripts download-all --output-dir ./fireflies-transcripts
```

This will:
- Paginate through all transcripts automatically
- Save each transcript as a JSON file with full details (sentences, summary, action items)
- Name files as `{id}-{sanitized-title}.json`
- Print progress to stderr and final summary to stdout

### Step 4: Get a specific transcript

```bash
node tools/clis/fireflies.js transcripts get --id "transcript-id-here"
```

## Output Format

Each downloaded JSON file contains:

- **Metadata**: `id`, `title`, `date`, `duration`
- **Participants**: `participants`, `meeting_attendees` (name, email, phone)
- **Transcript**: `sentences` array with `text`, `speaker_name`, `start_time`, `end_time`
- **AI Summary**: `summary` with `short_summary`, `overview`, `action_items`, `keywords`, `topics_discussed`, `outline`
- **Media**: `transcript_url`, `audio_url`, `video_url`

## Commands Reference

| Command | Description |
|---------|-------------|
| `user` | Verify API key and show account info |
| `transcripts list` | List transcripts (use `--limit` and `--skip` for pagination) |
| `transcripts get --id <id>` | Get full transcript details |
| `transcripts download-all` | Download all transcripts to local JSON files |

## Relevant Tools

- **CLI**: [fireflies.js](../../tools/clis/fireflies.js)
- **Integration guide**: [fireflies.md](../../tools/integrations/fireflies.md)
