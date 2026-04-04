"""
Image hash utility — SHA-256.

Generates a deterministic fingerprint from raw image bytes.
Used for cache lookups so the same image always maps to the same key.
"""

import hashlib


def generate_image_hash(file_bytes: bytes) -> str:
    """Return hex-encoded SHA-256 digest of *file_bytes*."""
    return hashlib.sha256(file_bytes).hexdigest()
