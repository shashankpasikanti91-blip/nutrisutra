"""
Admin & Event API — NutriSutra

Endpoints:
  POST /api/event          — frontend reports signup/login/scan/error
  GET  /api/admin/stats    — owner dashboard stats (requires admin API key)
  GET  /api/admin/events   — recent event log (requires admin API key)
  GET  /api/admin/telegram-setup — discover Telegram chat ID
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Header, HTTPException, Request
from pydantic import BaseModel, EmailStr

from app.core.config import settings
from app.services.event_store import get_events, get_stats, log_event
from app.services.telegram_service import get_telegram_chat_id, send_telegram_message

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


# ──────────────────────────────────────────────────────────
# Auth helpers
# ──────────────────────────────────────────────────────────

def _require_admin(x_admin_key: str = "") -> None:
    if not x_admin_key or x_admin_key != settings.ADMIN_API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden")


# ──────────────────────────────────────────────────────────
# Event reporting (called from frontend)
# ──────────────────────────────────────────────────────────

class EventPayload(BaseModel):
    type: str          # signup | login | logout | food_scan | trial_warning | error
    email: str = ""
    name: str = ""
    data: dict = {}


@router.post("/event")
async def record_event(payload: EventPayload, request: Request):
    """
    Frontend calls this on signup, login, food scan, etc.
    Logs the event and sends a Telegram notification for key events.
    """
    ip = request.client.host if request.client else ""
    log_event(payload.type, email=payload.email, data={"name": payload.name, **payload.data}, ip=ip)

    # ── Telegram notifications for important events ──
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    if payload.type == "signup":
        msg = (
            f"🎉 <b>New Signup</b>\n"
            f"👤 {payload.name or 'Unknown'}\n"
            f"📧 {payload.email}\n"
            f"🕐 {now}"
        )
        await send_telegram_message(msg)

    elif payload.type == "login":
        msg = (
            f"🔑 <b>User Login</b>\n"
            f"📧 {payload.email}\n"
            f"🕐 {now}"
        )
        await send_telegram_message(msg)

    elif payload.type == "trial_warning":
        days = payload.data.get("days_left", "?")
        msg = (
            f"⚠️ <b>Trial Expiring</b>\n"
            f"📧 {payload.email}\n"
            f"📅 {days} day(s) remaining\n"
            f"🕐 {now}"
        )
        await send_telegram_message(msg)

    elif payload.type == "trial_expired":
        msg = (
            f"🚫 <b>Trial Expired</b>\n"
            f"📧 {payload.email}\n"
            f"🕐 {now}"
        )
        await send_telegram_message(msg)

    elif payload.type == "food_scan":
        # Tenant privacy: do NOT log what food was scanned — just count the activity
        pass

    elif payload.type == "error":
        err = payload.data.get("message", "unknown")
        msg = (
            f"❌ <b>App Error</b>\n"
            f"📧 {payload.email or 'anon'}\n"
            f"💬 {err[:200]}\n"
            f"🕐 {now}"
        )
        await send_telegram_message(msg)

    return {"ok": True}


# ──────────────────────────────────────────────────────────
# Admin dashboard (owner only)
# ──────────────────────────────────────────────────────────

@router.get("/admin/stats")
async def admin_stats(x_admin_key: str = Header(default="")):
    _require_admin(x_admin_key)
    return get_stats()


@router.get("/admin/events")
async def admin_events(limit: int = 200, x_admin_key: str = Header(default="")):
    _require_admin(x_admin_key)
    limit = max(1, min(limit, 1000))
    return {"events": get_events(limit=limit)}


@router.get("/admin/telegram-setup")
async def telegram_setup(x_admin_key: str = Header(default="")):
    """
    Call this after messaging the bot to discover your Telegram chat ID.
    Then set TELEGRAM_CHAT_ID in .env and restart backend.
    """
    _require_admin(x_admin_key)
    chat_id = await get_telegram_chat_id()
    if chat_id:
        return {"chat_id": chat_id, "instruction": f"Set TELEGRAM_CHAT_ID={chat_id} in .env and restart."}
    return {"chat_id": None, "instruction": "Send any message to your Telegram bot first, then call this endpoint again."}


@router.post("/admin/test-telegram")
async def test_telegram(x_admin_key: str = Header(default="")):
    """Send a test Telegram message to verify the setup."""
    _require_admin(x_admin_key)
    ok = await send_telegram_message("✅ <b>NutriSutra Admin</b> — Telegram is working!")
    if ok:
        return {"ok": True, "message": "Test message sent to Telegram."}
    return {"ok": False, "message": "Failed — check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env."}
