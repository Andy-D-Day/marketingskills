#!/usr/bin/env python3
"""Embed Fireflies transcripts into ChromaDB for semantic search."""

import json
import os
import sys
from pathlib import Path

import chromadb
from tqdm import tqdm

TRANSCRIPTS_DIR = Path("/home/user/marketingskills/fireflies-transcripts")
CHROMA_DIR = Path("/home/user/marketingskills/chroma_db")
COLLECTION_NAME = "agency_transcripts"
CHUNK_TARGET_WORDS = 500
CHUNK_OVERLAP_WORDS = 75


def merge_sentences_into_turns(sentences):
    """Join consecutive sentences from the same speaker into turns."""
    if not sentences:
        return []
    turns = []
    current_speaker = sentences[0].get("speaker_name", "Unknown")
    current_texts = [sentences[0].get("text", "")]
    current_start = sentences[0].get("start_time", 0)
    current_end = sentences[0].get("end_time", 0)

    for s in sentences[1:]:
        speaker = s.get("speaker_name", "Unknown")
        if speaker == current_speaker:
            current_texts.append(s.get("text", ""))
            current_end = s.get("end_time", current_end)
        else:
            turns.append({
                "speaker": current_speaker,
                "text": " ".join(current_texts),
                "start_time": current_start,
                "end_time": current_end,
            })
            current_speaker = speaker
            current_texts = [s.get("text", "")]
            current_start = s.get("start_time", 0)
            current_end = s.get("end_time", 0)

    turns.append({
        "speaker": current_speaker,
        "text": " ".join(current_texts),
        "start_time": current_start,
        "end_time": current_end,
    })
    return turns


def chunk_turns(turns, target_words=CHUNK_TARGET_WORDS, overlap_words=CHUNK_OVERLAP_WORDS):
    """Split turns into overlapping chunks of roughly target_words."""
    if not turns:
        return []

    # Build formatted lines per turn
    formatted = []
    for t in turns:
        formatted.append({"line": f"{t['speaker']}: {t['text']}", "words": len(t["text"].split())})

    chunks = []
    i = 0
    while i < len(formatted):
        chunk_lines = []
        word_count = 0

        # Add turns until we hit the target
        j = i
        while j < len(formatted) and word_count < target_words:
            chunk_lines.append(formatted[j]["line"])
            word_count += formatted[j]["words"]
            j += 1

        chunks.append("\n".join(chunk_lines))

        # Move forward, keeping overlap
        overlap_count = 0
        next_i = j
        for k in range(j - 1, i, -1):
            overlap_count += formatted[k]["words"]
            if overlap_count >= overlap_words:
                next_i = k
                break

        # Ensure we always advance at least one turn
        if next_i <= i:
            next_i = i + 1
            # If we already consumed everything, break
            if next_i >= len(formatted):
                break

        i = next_i

    return chunks


def get_speakers(sentences):
    """Extract unique speaker names."""
    return sorted(set(s.get("speaker_name", "Unknown") for s in sentences if s.get("speaker_name")))


def process_file(filepath, collection, existing_ids):
    """Process a single transcript JSON file and add to ChromaDB."""
    with open(filepath) as f:
        data = json.load(f)

    transcript_id = data.get("id", filepath.stem)
    title = data.get("title", "Untitled")
    date = data.get("dateString", "")
    duration = data.get("duration", 0)
    sentences = data.get("sentences") or []
    summary = data.get("summary") or {}

    speakers = get_speakers(sentences)
    speakers_str = ", ".join(speakers) if speakers else "Unknown"

    docs_to_add = []
    ids_to_add = []
    metas_to_add = []

    # --- Summary document ---
    summary_id = f"{transcript_id}_summary"
    if summary_id not in existing_ids:
        overview = summary.get("overview", "") or ""
        short_summary = summary.get("short_summary", "") or ""
        summary_text = ""
        if short_summary:
            summary_text += f"Summary: {short_summary}"
        if overview:
            if summary_text:
                summary_text += "\n\n"
            summary_text += f"Overview: {overview}"

        if summary_text.strip():
            docs_to_add.append(summary_text)
            ids_to_add.append(summary_id)
            metas_to_add.append({
                "type": "summary",
                "title": title,
                "date": date,
                "duration": duration,
                "speakers": speakers_str,
                "transcript_id": transcript_id,
            })

    # --- Conversation chunks ---
    if sentences:
        turns = merge_sentences_into_turns(sentences)
        chunks = chunk_turns(turns)

        for idx, chunk_text in enumerate(chunks):
            chunk_id = f"{transcript_id}_chunk_{idx}"
            if chunk_id in existing_ids:
                continue
            docs_to_add.append(chunk_text)
            ids_to_add.append(chunk_id)
            metas_to_add.append({
                "type": "conversation",
                "title": title,
                "date": date,
                "duration": duration,
                "speakers": speakers_str,
                "transcript_id": transcript_id,
                "chunk_index": idx,
            })

    # Batch add to ChromaDB
    if docs_to_add:
        # ChromaDB has a batch limit; add in batches of 100
        for batch_start in range(0, len(docs_to_add), 100):
            batch_end = batch_start + 100
            collection.add(
                documents=docs_to_add[batch_start:batch_end],
                ids=ids_to_add[batch_start:batch_end],
                metadatas=metas_to_add[batch_start:batch_end],
            )

    return len(docs_to_add)


def main():
    print(f"ChromaDB storage: {CHROMA_DIR}")
    print(f"Transcripts dir:  {TRANSCRIPTS_DIR}")
    print()

    # Initialize ChromaDB
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Fireflies meeting transcripts with conversation chunks and summaries"},
    )

    # Get existing IDs to support re-run skipping
    existing_ids = set()
    existing = collection.get()
    if existing and existing["ids"]:
        existing_ids = set(existing["ids"])
        print(f"Found {len(existing_ids)} existing documents in collection, will skip duplicates.")

    # Gather transcript files
    files = sorted(TRANSCRIPTS_DIR.glob("*.json"))
    if not files:
        print("No JSON files found in transcripts directory.")
        sys.exit(1)

    print(f"Processing {len(files)} transcript files...\n")

    total_added = 0
    skipped_files = 0

    for filepath in tqdm(files, desc="Embedding transcripts", unit="file"):
        try:
            # Quick check: if the transcript_id already has chunks, we can check the summary ID
            with open(filepath) as f:
                data = json.load(f)
            transcript_id = data.get("id", filepath.stem)

            # If summary already exists, check if any chunks exist too — if so, likely fully processed
            summary_id = f"{transcript_id}_summary"
            chunk_0_id = f"{transcript_id}_chunk_0"
            if summary_id in existing_ids and chunk_0_id in existing_ids:
                skipped_files += 1
                continue

            added = process_file(filepath, collection, existing_ids)
            total_added += added
        except Exception as e:
            tqdm.write(f"Error processing {filepath.name}: {e}")

    print(f"\nDone!")
    print(f"  Files processed: {len(files)}")
    print(f"  Files skipped (already embedded): {skipped_files}")
    print(f"  Documents added: {total_added}")
    print(f"  Total documents in collection: {collection.count()}")


if __name__ == "__main__":
    main()
