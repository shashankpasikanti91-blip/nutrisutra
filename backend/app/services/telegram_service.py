"""
Telegram notification service.

Sends admin alerts to the owner's Telegram chat for:
- New user signups
- User logins
- Trial expiry warnings
- Error events
- Food scan activity
"""

from __future__ import annotations

import logging
import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_telegram_message(text: str) -> bool:
    """Send a message to the admin chat. Returns True on success."""
    if not settings.is_telegram_ready:
        logger.debug("Telegram not configured — skipping notification")
        return False

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": settings.TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            return True
    except Exception as exc:
        logger.warning("Telegram send failed: %s", exc)
        return False


async def get_telegram_chat_id() -> str | None:
    """
    Helper: Call getUpdates to find the chat ID after the owner
    messages the bot. Returns the first chat_id found.
    """
    if not settings.TELEGRAM_BOT_TOKEN:
        return None

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/getUpdates"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url)
            data = resp.json()
            results = data.get("result", [])
            if results:
                chat_id = str(results[-1]["message"]["chat"]["id"])
                return chat_id
    except Exception as exc:
        logger.warning("getUpdates failed: %s", exc)
    return None
