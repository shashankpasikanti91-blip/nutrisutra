"""
POST /api/analyze-image

Accepts a multipart food image, generates a hash, checks cache,
optionally calls OpenRouter for AI detection, runs deterministic
nutrition calculation, and returns the result.

Raw image bytes are NEVER persisted — only metadata and results.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, File, Form, UploadFile

from app.core.config import settings
from app.schemas.analyze_image import (
    AnalyzeImageErrorResponse,
    AnalyzeImageSuccessResponse,
)
from app.services import image_result_store
from app.services.nutrition_engine import calculate_nutrition
from app.services.openrouter_image_service import analyze_food_image, is_openrouter_configured
from app.services.structured_parser import validate_parsed_input
from app.utils.image_hash import generate_image_hash

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_MIME_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}


@router.post(
    "/api/analyze-image",
    response_model=AnalyzeImageSuccessResponse | AnalyzeImageErrorResponse,
)
async def analyze_image(
    image: UploadFile = File(...),
    session_id: str | None = Form(default=None),
):
    """Analyze food in an uploaded image.

    Pipeline:
    1. Validate file type and size.
    2. Read bytes into memory (temporary only).
    3. Generate SHA-256 image hash.
    4. Check in-memory cache by hash — return early if hit.
    5. If OpenRouter is not configured → friendly error.
    6. Call OpenRouter for structured food detection.
    7. Validate AI response.
    8. Run deterministic nutrition engine.
    9. Cache metadata + result (no raw image).
    10. Return nutrition result.
    """

    # ── 1. Validate MIME type ──
    mime = image.content_type or ""
    if mime not in ALLOWED_MIME_TYPES:
        return AnalyzeImageErrorResponse(
            code="INVALID_IMAGE_TYPE",
            message="Please upload a JPG, PNG, or WEBP image.",
        )

    # ── 2. Read file bytes (temporary — not saved to disk) ──
    file_bytes = await image.read()

    if not file_bytes:
        return AnalyzeImageErrorResponse(
            code="EMPTY_UPLOAD",
            message="The uploaded file is empty. Please select a valid image.",
        )

    # ── 3. Validate size ──
    if len(file_bytes) > settings.max_image_bytes:
        return AnalyzeImageErrorResponse(
            code="IMAGE_TOO_LARGE",
            message=f"Please upload an image smaller than {settings.MAX_IMAGE_UPLOAD_MB} MB.",
        )

    # ── 4. Generate image hash ──
    image_hash = generate_image_hash(file_bytes)

    # ── 5. Check cache ──
    cached = image_result_store.get_cached_result(image_hash)
    if cached is not None:
        return AnalyzeImageSuccessResponse(
            image_hash=cached["image_hash"],
            parsed_input=cached["parsed_input"],
            analysis_result=cached["analysis_result"],
            notes=cached.get("notes", []),
            confidence=cached.get("confidence", "medium"),
            cached=True,
        )

    # ── 6. Check OpenRouter config ──
    if not is_openrouter_configured():
        return AnalyzeImageErrorResponse(
            code="IMAGE_AI_NOT_CONFIGURED",
            message="Image AI analysis is not configured yet. Please use text analysis for now.",
        )

    # ── 7. Call OpenRouter ──
    try:
        detection_dict = await analyze_food_image(file_bytes, mime)
    except (RuntimeError, ValueError) as exc:
        logger.warning("OpenRouter call failed: %s", exc)
        return AnalyzeImageErrorResponse(
            code="AI_SERVICE_ERROR",
            message=str(exc),
        )

    # ── 8. Validate structured response ──
    try:
        parsed_input = validate_parsed_input(detection_dict)
    except ValueError as exc:
        logger.warning("AI response validation failed: %s", exc)
        return AnalyzeImageErrorResponse(
            code="AI_INVALID_RESPONSE",
            message="AI returned an invalid response. Please try again or use text analysis.",
        )

    if not parsed_input.food_items:
        return AnalyzeImageErrorResponse(
            code="NO_FOOD_DETECTED",
            message="No food items detected in this image. Try a clearer photo.",
        )

    # ── 9. Deterministic nutrition calculation ──
    try:
        analysis_result, notes, confidence = calculate_nutrition(parsed_input)
    except Exception:
        logger.exception("Nutrition calculation failed")
        return AnalyzeImageErrorResponse(
            code="CALCULATION_ERROR",
            message="Nutrition calculation failed. Please try text analysis instead.",
        )

    notes.insert(0, "Detected from uploaded image via AI.")

    # ── 10. Cache metadata + result (no raw image bytes) ──
    if settings.ENABLE_IMAGE_RESULT_PERSISTENCE:
        image_result_store.save_result(
            image_hash=image_hash,
            mime_type=mime,
            file_size=len(file_bytes),
            session_id=session_id,
            parsed_input=parsed_input.model_dump(),
            analysis_result=analysis_result.model_dump(),
            notes=notes,
            confidence=confidence,
        )

    # Raw image bytes go out of scope here — never saved to disk.
    return AnalyzeImageSuccessResponse(
        image_hash=image_hash,
        parsed_input=parsed_input,
        analysis_result=analysis_result,
        notes=notes,
        confidence=confidence,
        cached=False,
    )
