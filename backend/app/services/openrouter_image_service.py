"""
OpenRouter vision service for food image analysis.

Sends a base64-encoded image to a multimodal model via OpenRouter's
OpenAI-compatible API and returns the raw detection dict.

If the API key is missing or the feature is disabled the caller
should handle the ``not configured`` path — this module never raises
ugly exceptions for missing config.
"""

from __future__ import annotations

import base64
import logging

import httpx

from app.core.config import settings
from app.services.prompts import build_food_detection_prompt

logger = logging.getLogger(__name__)


def is_openrouter_configured() -> bool:
    """Check whether the OpenRouter integration is ready to use."""
    return settings.is_openrouter_ready


async def analyze_food_image(
    file_bytes: bytes,
    mime_type: str,
) -> dict:
    """Send *file_bytes* to OpenRouter and return the parsed detection dict.

    Returns a dict matching the ``ImageDetectionPayload`` shape on success.
    Raises ``RuntimeError`` with a user-safe message on failure.
    """
    b64 = base64.standard_b64encode(file_bytes).decode("ascii")
    data_url = f"data:{mime_type};base64,{b64}"

    system_prompt = build_food_detection_prompt()

    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": data_url}},
                    {
                        "type": "text",
                        "text": "Identify all food items in this image. Return JSON only.",
                    },
                ],
            },
        ],
        "max_tokens": 1024,
        "temperature": 0.2,
    }

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "X-Title": "NutriSutra Backend",
    }

    async with httpx.AsyncClient(timeout=settings.OPENROUTER_TIMEOUT_SECONDS) as client:
        resp = await client.post(
            settings.OPENROUTER_BASE_URL,
            json=payload,
            headers=headers,
        )

    if resp.status_code == 401 or resp.status_code == 403:
        raise RuntimeError("OpenRouter API key is invalid or expired.")
    if resp.status_code == 429:
        raise RuntimeError("Rate limit reached. Please wait and try again.")
    if resp.status_code >= 400:
        logger.error("OpenRouter returned %s: %s", resp.status_code, resp.text[:500])
        raise RuntimeError(f"AI service returned HTTP {resp.status_code}.")

    data = resp.json()
    raw_content: str = (
        data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
    )

    if not raw_content:
        raise RuntimeError("AI returned an empty response. Try a clearer photo.")

    # The model sometimes wraps JSON in markdown code fences.
    from app.services.structured_parser import parse_detection_json

    return parse_detection_json(raw_content)
