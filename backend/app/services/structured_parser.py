"""
Structured response parser.

Validates and cleans the JSON string returned by the AI model,
mapping it into a ``ParsedInput`` schema instance.
"""

from __future__ import annotations

import json
import re
import logging
from typing import Any

from app.schemas.analyze_image import ParsedInput

logger = logging.getLogger(__name__)


def _strip_markdown_fences(text: str) -> str:
    """Remove ```json ... ``` wrappers if present."""
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text, flags=re.IGNORECASE)
    return text.strip()


def _fix_trailing_commas(text: str) -> str:
    """Remove trailing commas before closing brackets/braces."""
    return re.sub(r",\s*([}\]])", r"\1", text)


def parse_detection_json(raw: str) -> dict[str, Any]:
    """Parse the raw AI text into a validated dict.

    Raises ``ValueError`` if the response cannot be salvaged.
    """
    cleaned = _strip_markdown_fences(raw)
    cleaned = _fix_trailing_commas(cleaned)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse AI JSON: %s", raw[:500])
        raise ValueError("AI response was not valid JSON.") from exc

    if not isinstance(data, dict):
        raise ValueError("AI response is not a JSON object.")

    return data


def validate_parsed_input(data: dict[str, Any]) -> ParsedInput:
    """Validate an AI detection dict against the ``ParsedInput`` schema.

    Raises ``ValueError`` with details if the structure is invalid.
    """
    try:
        return ParsedInput.model_validate(data)
    except Exception as exc:
        logger.error("ParsedInput validation failed: %s", exc)
        raise ValueError(f"Invalid detection structure: {exc}") from exc
