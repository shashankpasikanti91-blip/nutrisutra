"""
JWT token service for NutriSutra auth.

Uses PyJWT with HS256. Secret is read from JWT_SECRET env var.
Tokens are valid for 90 days.
"""

from __future__ import annotations

import logging
import os
import time
from typing import Optional

import jwt

logger = logging.getLogger(__name__)

# Read secret lazily so it picks up the value after settings are loaded
def _get_secret() -> str:
    # Try settings first, fallback to env, fallback to hardcoded dev value
    try:
        from app.core.config import settings
        if settings.JWT_SECRET:
            return settings.JWT_SECRET
    except Exception:
        pass
    return os.environ.get("JWT_SECRET", "nutrisutra_jwt_fallback_2026_change_in_prod")


_ALGORITHM = "HS256"
_EXPIRY_DAYS = 90


def create_token(user: dict) -> str:
    """Create a signed JWT for the given user dict."""
    now = int(time.time())
    payload = {
        "sub": user["id"],
        "email": user["email"],
        "name": user["name"],
        "createdAt": user["createdAt"],
        "trialEndsAt": user["trialEndsAt"],
        "iat": now,
        "exp": now + _EXPIRY_DAYS * 24 * 60 * 60,
    }
    return jwt.encode(payload, _get_secret(), algorithm=_ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT. Returns payload or None if invalid/expired."""
    try:
        return jwt.decode(token, _get_secret(), algorithms=[_ALGORITHM])
    except jwt.ExpiredSignatureError:
        logger.debug("JWT expired")
        return None
    except jwt.InvalidTokenError as exc:
        logger.debug("JWT invalid: %s", exc)
        return None
