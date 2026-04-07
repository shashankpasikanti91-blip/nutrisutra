"""
Event logging service.

Stores app events (signups, logins, scans, errors) in a JSON-lines file
at /opt/nutrisutra/data/events.jsonl (or local fallback).

Each line is a JSON object with: type, email, data, timestamp, ip
"""

from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path

logger = logging.getLogger(__name__)

# Data directory — use /opt/nutrisutra/data in prod, ./data locally
_BASE_DIR = Path(os.environ.get("DATA_DIR", "data"))
_EVENTS_FILE = _BASE_DIR / "events.jsonl"

# Max lines to keep (rolling window)
MAX_EVENTS = 10_000


def _ensure_dir() -> None:
    _BASE_DIR.mkdir(parents=True, exist_ok=True)


def log_event(
    event_type: str,
    email: str = "",
    data: dict | None = None,
    ip: str = "",
) -> None:
    """Append a single event to the JSONL log. Safe — never raises."""
    try:
        _ensure_dir()
        record = {
            "type": event_type,
            "email": email,
            "data": data or {},
            "ip": ip,
            "ts": datetime.now(timezone.utc).isoformat(),
        }
        with _EVENTS_FILE.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(record) + "\n")
    except Exception as exc:
        logger.warning("log_event failed: %s", exc)


def get_events(limit: int = 500) -> list[dict]:
    """Read the last `limit` events from the log file."""
    try:
        if not _EVENTS_FILE.exists():
            return []
        lines = _EVENTS_FILE.read_text(encoding="utf-8").splitlines()
        tail = lines[-limit:] if len(lines) > limit else lines
        return [json.loads(l) for l in reversed(tail) if l.strip()]
    except Exception as exc:
        logger.warning("get_events failed: %s", exc)
        return []


def get_stats() -> dict:
    """Compute aggregate stats from the event log."""
    events = get_events(limit=MAX_EVENTS)
    signups = [e for e in events if e["type"] == "signup"]
    logins = [e for e in events if e["type"] == "login"]
    scans = [e for e in events if e["type"] == "food_scan"]
    errors = [e for e in events if e["type"] == "error"]

    # Unique users
    unique_users = len({e["email"] for e in events if e.get("email")})
    # Today's activity
    today = datetime.now(timezone.utc).date().isoformat()
    today_logins = [e for e in logins if e["ts"][:10] == today]
    today_scans = [e for e in scans if e["ts"][:10] == today]

    return {
        "total_signups": len(signups),
        "total_logins": len(logins),
        "total_scans": len(scans),
        "total_errors": len(errors),
        "unique_users": unique_users,
        "today_logins": len(today_logins),
        "today_scans": len(today_scans),
        "recent_events": events[:100],
    }
