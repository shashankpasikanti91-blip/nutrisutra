"""
Pydantic schemas for the image analysis endpoint.

Mirrors the frontend TypeScript types for full contract alignment.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


# ── Parsed food item from AI detection ──

class ParsedFoodItem(BaseModel):
    food_name: str
    normalized_food_name: str
    quantity: float = 1
    unit: str = "serving"
    portion_size: Literal["small", "medium", "large"] = "medium"
    cooking_style: str = "unknown"
    oil_level: Literal["low", "medium", "high", "unknown"] = "unknown"
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class ParsedInput(BaseModel):
    meal_name: str = ""
    cuisine: str = "Unknown"
    food_items: list[ParsedFoodItem] = []
    overall_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    notes: str = ""


# ── Per-component nutrition result ──

class ComponentResult(BaseModel):
    label: str
    quantity_label: str = ""
    grams: float = 0
    calories: float = 0
    protein: float = 0
    carbs: float = 0
    fat: float = 0
    fiber: float = 0
    sugar: float = 0
    sodium: float = 0
    matched: bool = False
    estimated: bool = True
    food_code: str | None = None


# ── Aggregated analysis result ──

class AnalysisResult(BaseModel):
    total_calories: float = 0
    protein: float = 0
    carbs: float = 0
    fats: float = 0
    fiber: float = 0
    sugar: float = 0
    sodium: float = 0
    components: list[ComponentResult] = []
    matched_count: int = 0
    estimated_count: int = 0


# ── Endpoint responses ──

class AnalyzeImageSuccessResponse(BaseModel):
    success: Literal[True] = True
    source: Literal["image"] = "image"
    image_hash: str
    parsed_input: ParsedInput
    analysis_result: AnalysisResult
    notes: list[str] = []
    confidence: Literal["high", "medium", "low"] = "medium"
    cached: bool = False


class AnalyzeImageErrorResponse(BaseModel):
    success: Literal[False] = False
    code: str
    message: str
