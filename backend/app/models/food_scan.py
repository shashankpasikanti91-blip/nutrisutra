"""
FoodScan DB model (optional, for future PostgreSQL persistence).

Stores only lightweight metadata + analysis results.
No raw image data, no image URLs, no base64 blobs.
"""

from __future__ import annotations

from datetime import datetime, timezone

from pydantic import BaseModel, Field


class FoodScan(BaseModel):
    """Row schema matching a future ``food_scans`` table.

    This is not an ORM model yet — convert to SQLAlchemy / Tortoise when
    a database backend is wired up.
    """

    id: int | None = None
    session_id: str | None = None
    image_hash: str
    mime_type: str
    file_size: int
    parsed_input_json: dict = Field(default_factory=dict)
    analysis_result_json: dict = Field(default_factory=dict)
    notes_json: list[str] = Field(default_factory=list)
    confidence: str = "medium"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # IMPORTANT: no image_url, no image_blob, no base64 field.
