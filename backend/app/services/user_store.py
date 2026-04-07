"""
User storage service.

Stores user accounts in /opt/nutrisutra/data/users.json (production)
or ./data/users.json (local dev).

Each user record:
{
  "id": "user_xxx",
  "name": "...",
  "email": "...",          # lowercase, unique key
  "passwordHash": "...",   # bcrypt
  "createdAt": 1712000000000,   # milliseconds
  "trialEndsAt": 1714600000000  # milliseconds
}
"""

from __future__ import annotations

import json
import logging
import os
import time
from pathlib import Path
from typing import Optional

from passlib.context import CryptContext

logger = logging.getLogger(__name__)

_BASE_DIR = Path(os.environ.get("DATA_DIR", "data"))
_USERS_FILE = _BASE_DIR / "users.json"

TRIAL_DAYS = 30

# bcrypt password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ──────────────────────────────────────────
# Internal helpers
# ──────────────────────────────────────────

def _ensure_dir() -> None:
    _BASE_DIR.mkdir(parents=True, exist_ok=True)


def _load_users() -> dict[str, dict]:
    """Return all users as a dict keyed by email (lowercase)."""
    try:
        if _USERS_FILE.exists():
            return json.loads(_USERS_FILE.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.warning("load_users failed: %s", exc)
    return {}


def _save_users(users: dict[str, dict]) -> None:
    try:
        _ensure_dir()
        _USERS_FILE.write_text(json.dumps(users, indent=2), encoding="utf-8")
    except Exception as exc:
        logger.warning("save_users failed: %s", exc)


# ──────────────────────────────────────────
# Public API
# ──────────────────────────────────────────

def get_user_by_email(email: str) -> Optional[dict]:
    return _load_users().get(email.strip().lower())


def user_exists(email: str) -> bool:
    return email.strip().lower() in _load_users()


def create_user(
    name: str,
    email: str,
    password: str,
    trial_days: int = TRIAL_DAYS,
    suggested_id: Optional[str] = None,
) -> dict:
    """Create and persist a new user. Raises ValueError if email already exists."""
    email = email.strip().lower()
    users = _load_users()

    if email in users:
        raise ValueError(f"User already exists: {email}")

    now_ms = int(time.time() * 1000)
    uid = suggested_id if suggested_id and suggested_id.startswith("user_") else f"user_{now_ms}_{os.urandom(3).hex()}"

    user: dict = {
        "id": uid,
        "name": name.strip(),
        "email": email,
        "passwordHash": pwd_context.hash(password),
        "createdAt": now_ms,
        "trialEndsAt": now_ms + trial_days * 24 * 60 * 60 * 1000,
    }
    users[email] = user
    _save_users(users)
    return user


def verify_password(plain: str, user: dict) -> bool:
    return pwd_context.verify(plain, user["passwordHash"])


def update_user_name(email: str, new_name: str) -> None:
    email = email.strip().lower()
    users = _load_users()
    if email in users:
        users[email]["name"] = new_name.strip()
        _save_users(users)


def get_all_users() -> list[dict]:
    """Return all users (without password hashes)."""
    users = _load_users()
    return [
        {k: v for k, v in u.items() if k != "passwordHash"}
        for u in users.values()
    ]


# ──────────────────────────────────────────
# System account seeding
# ──────────────────────────────────────────

def _seed_system_accounts() -> None:
    admin_email = os.environ.get("ADMIN_EMAIL", "pasikantishashank24@gmail.com")

    if not user_exists(admin_email):
        logger.info("Seeding owner account: %s", admin_email)
        create_user(
            "Shashank",
            admin_email,
            "NutriAdmin@2026",
            trial_days=365 * 10,  # 10 years
            suggested_id="user_owner_shashank",
        )

    if not user_exists("demo@nutrisutra.com"):
        logger.info("Seeding demo account")
        create_user(
            "Demo User",
            "demo@nutrisutra.com",
            "demo1234",
            trial_days=365,
            suggested_id="user_demo_account",
        )


try:
    _seed_system_accounts()
except Exception as _e:
    logger.warning("Could not seed system accounts: %s", _e)
