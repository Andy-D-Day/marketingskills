#!/usr/bin/env python3
"""MCP server for searching Fireflies transcripts stored in ChromaDB."""

from pathlib import Path

import chromadb
from mcp.server.fastmcp import FastMCP

CHROMA_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "agency_transcripts"

mcp = FastMCP("transcript-search")

# Initialize ChromaDB on startup
_client = chromadb.PersistentClient(path=str(CHROMA_DIR))
_collection = _client.get_or_create_collection(name=COLLECTION_NAME)


@mcp.tool()
def search_transcripts(query: str, n_results: int = 5) -> str:
    """Search Fireflies meeting transcripts by semantic similarity.

    Use this to find discussions about any topic across all recorded meetings.
    Returns matching conversation chunks and meeting summaries with metadata.

    Args:
        query: Natural language search query (e.g. "pricing strategy", "client onboarding")
        n_results: Number of results to return (default 5, max 20)
    """
    n_results = min(max(1, n_results), 20)

    results = _collection.query(query_texts=[query], n_results=n_results)

    if not results["documents"] or not results["documents"][0]:
        return "No matching transcripts found."

    output_parts = []
    docs = results["documents"][0]
    metas = results["metadatas"][0]
    distances = results["distances"][0] if results.get("distances") else [None] * len(docs)

    for i, (doc, meta, dist) in enumerate(zip(docs, metas, distances), 1):
        doc_type = meta.get("type", "unknown")
        title = meta.get("title", "Untitled")
        date = meta.get("date", "Unknown date")
        speakers = meta.get("speakers", "Unknown")
        duration = meta.get("duration", 0)
        transcript_id = meta.get("transcript_id", "")

        # Format date for readability (trim time if present)
        date_display = date[:10] if len(date) > 10 else date

        header = (
            f"--- Result {i} ---\n"
            f"Meeting: {title}\n"
            f"Date: {date_display} | Duration: {duration} min | Type: {doc_type}\n"
            f"Speakers: {speakers}\n"
            f"Transcript ID: {transcript_id}"
        )

        if dist is not None:
            header += f"\nRelevance distance: {dist:.4f}"

        output_parts.append(f"{header}\n\n{doc}\n")

    summary = f"Found {len(docs)} results for: \"{query}\"\n\n"
    return summary + "\n".join(output_parts)


if __name__ == "__main__":
    mcp.run()
