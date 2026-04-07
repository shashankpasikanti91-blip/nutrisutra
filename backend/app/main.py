"""
NutriSutra FastAPI application entry point.

Wires up routers, CORS, and a health endpoint.
"""

from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analyze_image import router as analyze_image_router
from app.api.admin import router as admin_router
from app.core.config import settings

logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(name)s  %(message)s")

app = FastAPI(
    title="NutriSutra API",
    version="0.1.0",
    description="AI-powered nutrition analysis backend. Raw images are never stored.",
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(analyze_image_router, tags=["Image Analysis"])
app.include_router(admin_router, tags=["Admin"])


# ── Health ──
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "openrouter_configured": settings.is_openrouter_ready,
    }
