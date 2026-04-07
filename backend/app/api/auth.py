"""
Authentication API — NutriSutra

POST /api/auth/register   — create account, returns JWT
POST /api/auth/login      — login, returns JWT
GET  /api/auth/me         — validate token, return user info
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from app.services.jwt_service import create_token, decode_token
from app.services.user_store import (
    create_user,
    get_user_by_email,
    user_exists,
    verify_password,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth")


# ──────────────────────────────────────────
# Request / Response models
# ──────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    suggested_id: str = ""  # optional: client can pass existing localStorage userId


class LoginRequest(BaseModel):
    email: str
    password: str


def _safe_user(user: dict) -> dict:
    """Return user dict without passwordHash."""
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "createdAt": user["createdAt"],
        "trialEndsAt": user["trialEndsAt"],
    }


# ──────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────

@router.post("/register")
async def register(req: RegisterRequest):
    email = req.email.strip().lower()
    name = req.name.strip()

    if len(name) < 2:
        raise HTTPException(status_code=400, detail="Name must be at least 2 characters.")
    if not email or "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    if user_exists(email):
        raise HTTPException(status_code=409, detail="An account with this email already exists. Try logging in.")

    user = create_user(
        name=name,
        email=email,
        password=req.password,
        suggested_id=req.suggested_id or None,
    )
    token = create_token(user)
    return {"token": token, "user": _safe_user(user)}


@router.post("/login")
async def login(req: LoginRequest):
    email = req.email.strip().lower()
    user = get_user_by_email(email)

    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email.")

    if not verify_password(req.password, user):
        raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")

    token = create_token(user)
    return {"token": token, "user": _safe_user(user)}


@router.get("/me")
async def me(authorization: str = Header(default="")):
    """Validate the Bearer token and return the current user."""
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header.")

    token = authorization[7:].strip()
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token is invalid or expired.")

    email = payload.get("email", "")
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return _safe_user(user)
