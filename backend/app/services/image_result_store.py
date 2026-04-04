"""
In-memory image result store.

Stores and retrieves lightweight metadata + analysis JSON keyed by
image hash.  No raw image data is ever persisted.

Designed with an interface that can be swapped for PostgreSQL later.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger(__name__)

# In-memory store (process-scoped; resets on restart)
_store: dict[str, dict[str, Any]] = {}


def get_cached_result(image_hash: str) -> dict[str, Any] | None:
    """Return cached result dict for *image_hash*, or ``None``."""
    return _store.get(image_hash)


def save_result(
    image_hash: str,
    mime_type: str,
    file_size: int,
    session_id: str | None,
    parsed_input: dict[str, Any],
    analysis_result: dict[str, Any],
    notes: list[str],
    confidence: str,
) -> None:
    """Persist only metadata + result JSON.  No raw image data."""
    _store[image_hash] = {
        "image_hash": image_hash,
        "mime_type": mime_type,
        "file_size": file_size,
        "session_id": session_id,
        "parsed_input": parsed_input,
        "analysis_result": analysis_result,
        "notes": notes,
        "confidence": confidence,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("Cached result for hash %s…%s", image_hash[:8], image_hash[-4:])
