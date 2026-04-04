"""
Deterministic nutrition calculation engine (backend mirror).

Accepts a ``ParsedInput`` (AI detection output) and produces
``AnalysisResult`` with per-component and total nutrition values.

This mirrors the frontend ``src/lib/calculations/index.ts`` logic
in Python so that results are reproducible on either side.
"""

from __future__ import annotations

import math
from typing import Literal

from app.schemas.analyze_image import (
    AnalysisResult,
    ComponentResult,
    ParsedFoodItem,
    ParsedInput,
)

# ═══════════════════════════════════════
# FOOD DATABASE (inline subset — extend as needed)
# ═══════════════════════════════════════

_FoodRow = dict  # keys: calories, protein, carbs, fat, fiber, sugar, sodium, default_g

FOOD_DB: dict[str, _FoodRow] = {
    # South Indian
    "idli":              {"calories": 130, "protein": 3.5, "carbs": 27,  "fat": 0.5,  "fiber": 0.8, "sugar": 0.5, "sodium": 280, "default_g": 80},
    "dosa":              {"calories": 168, "protein": 4,   "carbs": 28,  "fat": 4.5,  "fiber": 1,   "sugar": 1,   "sodium": 320, "default_g": 120},
    "plain dosa":        {"calories": 168, "protein": 4,   "carbs": 28,  "fat": 4.5,  "fiber": 1,   "sugar": 1,   "sodium": 320, "default_g": 120},
    "masala dosa":       {"calories": 195, "protein": 4.5, "carbs": 30,  "fat": 6,    "fiber": 1.5, "sugar": 1.5, "sodium": 380, "default_g": 200},
    "ghee dosa":         {"calories": 230, "protein": 4,   "carbs": 28,  "fat": 11,   "fiber": 1,   "sugar": 1,   "sodium": 340, "default_g": 130},
    "pesarattu":         {"calories": 150, "protein": 7,   "carbs": 22,  "fat": 3.5,  "fiber": 2,   "sugar": 1,   "sodium": 250, "default_g": 150},
    "upma":              {"calories": 155, "protein": 4,   "carbs": 24,  "fat": 5,    "fiber": 1.5, "sugar": 1,   "sodium": 350, "default_g": 200},
    "pongal":            {"calories": 175, "protein": 5,   "carbs": 25,  "fat": 6,    "fiber": 1.5, "sugar": 0.5, "sodium": 300, "default_g": 200},
    "vada":              {"calories": 290, "protein": 10,  "carbs": 25,  "fat": 17,   "fiber": 3,   "sugar": 1,   "sodium": 400, "default_g": 50},
    "medu vada":         {"calories": 290, "protein": 10,  "carbs": 25,  "fat": 17,   "fiber": 3,   "sugar": 1,   "sodium": 400, "default_g": 50},
    "sambar":            {"calories": 65,  "protein": 3,   "carbs": 9,   "fat": 1.5,  "fiber": 2,   "sugar": 2,   "sodium": 500, "default_g": 150},
    "rasam":             {"calories": 35,  "protein": 1.5, "carbs": 5,   "fat": 0.8,  "fiber": 0.5, "sugar": 1,   "sodium": 600, "default_g": 150},
    "chutney":           {"calories": 80,  "protein": 2,   "carbs": 10,  "fat": 3,    "fiber": 1,   "sugar": 2,   "sodium": 350, "default_g": 30},
    "curd rice":         {"calories": 140, "protein": 4,   "carbs": 22,  "fat": 3.5,  "fiber": 0.5, "sugar": 2,   "sodium": 300, "default_g": 250},
    "lemon rice":        {"calories": 180, "protein": 3,   "carbs": 30,  "fat": 5,    "fiber": 1,   "sugar": 1,   "sodium": 350, "default_g": 200},
    # Indian breads
    "chapati":           {"calories": 240, "protein": 8,   "carbs": 42,  "fat": 5,    "fiber": 3,   "sugar": 1,   "sodium": 350, "default_g": 45},
    "roti":              {"calories": 240, "protein": 8,   "carbs": 42,  "fat": 5,    "fiber": 3,   "sugar": 1,   "sodium": 350, "default_g": 45},
    "poori":             {"calories": 320, "protein": 7,   "carbs": 40,  "fat": 14,   "fiber": 2,   "sugar": 1,   "sodium": 400, "default_g": 40},
    "naan":              {"calories": 260, "protein": 9,   "carbs": 45,  "fat": 5,    "fiber": 2,   "sugar": 3,   "sodium": 500, "default_g": 90},
    "paratha":           {"calories": 280, "protein": 7,   "carbs": 38,  "fat": 11,   "fiber": 2,   "sugar": 1,   "sodium": 400, "default_g": 80},
    # Rice dishes
    "white rice":        {"calories": 130, "protein": 2.7, "carbs": 28,  "fat": 0.3,  "fiber": 0.4, "sugar": 0,   "sodium": 5,   "default_g": 200},
    "rice":              {"calories": 130, "protein": 2.7, "carbs": 28,  "fat": 0.3,  "fiber": 0.4, "sugar": 0,   "sodium": 5,   "default_g": 200},
    "chicken biryani":   {"calories": 190, "protein": 10,  "carbs": 22,  "fat": 7,    "fiber": 0.8, "sugar": 1.5, "sodium": 480, "default_g": 350},
    "mutton biryani":    {"calories": 210, "protein": 11,  "carbs": 21,  "fat": 9,    "fiber": 0.8, "sugar": 1.5, "sodium": 500, "default_g": 350},
    "egg biryani":       {"calories": 175, "protein": 8,   "carbs": 23,  "fat": 6,    "fiber": 0.8, "sugar": 1.5, "sodium": 460, "default_g": 350},
    "veg biryani":       {"calories": 160, "protein": 4,   "carbs": 25,  "fat": 5,    "fiber": 1.5, "sugar": 2,   "sodium": 420, "default_g": 350},
    "veg pulao":         {"calories": 150, "protein": 3.5, "carbs": 24,  "fat": 4.5,  "fiber": 1.5, "sugar": 1.5, "sodium": 380, "default_g": 250},
    # Curries
    "chicken curry":     {"calories": 165, "protein": 15,  "carbs": 6,   "fat": 9,    "fiber": 1,   "sugar": 2,   "sodium": 550, "default_g": 200},
    "mutton curry":      {"calories": 195, "protein": 16,  "carbs": 5,   "fat": 12,   "fiber": 1,   "sugar": 1.5, "sodium": 580, "default_g": 200},
    "fish curry":        {"calories": 120, "protein": 14,  "carbs": 5,   "fat": 5,    "fiber": 0.5, "sugar": 1.5, "sodium": 520, "default_g": 200},
    "dal":               {"calories": 105, "protein": 7,   "carbs": 14,  "fat": 2.5,  "fiber": 3,   "sugar": 1.5, "sodium": 400, "default_g": 200},
    "veg curry":         {"calories": 90,  "protein": 3,   "carbs": 10,  "fat": 4,    "fiber": 2,   "sugar": 3,   "sodium": 450, "default_g": 200},
    "paneer butter masala": {"calories": 220, "protein": 10, "carbs": 8, "fat": 17,   "fiber": 1,   "sugar": 3,   "sodium": 500, "default_g": 200},
    # Snacks
    "samosa":            {"calories": 310, "protein": 5,   "carbs": 32,  "fat": 18,   "fiber": 2,   "sugar": 2,   "sodium": 450, "default_g": 80},
    "pakora":            {"calories": 270, "protein": 6,   "carbs": 28,  "fat": 15,   "fiber": 2,   "sugar": 1,   "sodium": 400, "default_g": 80},
    # Beverages
    "tea":               {"calories": 50,  "protein": 1,   "carbs": 8,   "fat": 1.5,  "fiber": 0,   "sugar": 6,   "sodium": 20,  "default_g": 150},
    "coffee":            {"calories": 60,  "protein": 1,   "carbs": 8,   "fat": 2,    "fiber": 0,   "sugar": 6,   "sodium": 25,  "default_g": 150},
    "milk coffee":       {"calories": 80,  "protein": 2.5, "carbs": 10,  "fat": 3,    "fiber": 0,   "sugar": 8,   "sodium": 40,  "default_g": 150},
    "filter coffee":     {"calories": 95,  "protein": 2.5, "carbs": 11,  "fat": 4,    "fiber": 0,   "sugar": 9,   "sodium": 35,  "default_g": 150},
    "buttermilk":        {"calories": 30,  "protein": 2,   "carbs": 4,   "fat": 0.8,  "fiber": 0,   "sugar": 3,   "sodium": 200, "default_g": 200},
    "lassi":             {"calories": 100, "protein": 3,   "carbs": 18,  "fat": 2,    "fiber": 0,   "sugar": 15,  "sodium": 80,  "default_g": 250},
    "curd":              {"calories": 60,  "protein": 3.5, "carbs": 5,   "fat": 3,    "fiber": 0,   "sugar": 4,   "sodium": 50,  "default_g": 100},
    # Fast food
    "burger":            {"calories": 250, "protein": 13,  "carbs": 28,  "fat": 10,   "fiber": 1.5, "sugar": 5,   "sodium": 500, "default_g": 200},
    "fries":             {"calories": 312, "protein": 3.5, "carbs": 41,  "fat": 15,   "fiber": 3.5, "sugar": 0.5, "sodium": 210, "default_g": 117},
    "pizza":             {"calories": 266, "protein": 11,  "carbs": 33,  "fat": 10,   "fiber": 2.3, "sugar": 3.6, "sodium": 598, "default_g": 107},
    "cola":              {"calories": 42,  "protein": 0,   "carbs": 10.6,"fat": 0,    "fiber": 0,   "sugar": 10.6,"sodium": 4,   "default_g": 330},
    "bubble tea":        {"calories": 240, "protein": 1,   "carbs": 56,  "fat": 3,    "fiber": 0.5, "sugar": 45,  "sodium": 50,  "default_g": 400},
    # Misc
    "almonds":           {"calories": 575, "protein": 21,  "carbs": 22,  "fat": 49,   "fiber": 12.5,"sugar": 4,   "sodium": 1,   "default_g": 14},
    "sunflower seeds":   {"calories": 584, "protein": 21,  "carbs": 20,  "fat": 51,   "fiber": 8.6, "sugar": 2.6, "sodium": 9,   "default_g": 10},
    "egg":               {"calories": 155, "protein": 13,  "carbs": 1.1, "fat": 11,   "fiber": 0,   "sugar": 1.1, "sodium": 124, "default_g": 50},
    "boiled egg":        {"calories": 155, "protein": 13,  "carbs": 1.1, "fat": 11,   "fiber": 0,   "sugar": 1.1, "sodium": 124, "default_g": 50},
    # Malaysian
    "nasi lemak":        {"calories": 210, "protein": 7,   "carbs": 28,  "fat": 8,    "fiber": 1.5, "sugar": 2,   "sodium": 520, "default_g": 350},
    "nasi goreng":       {"calories": 170, "protein": 6,   "carbs": 25,  "fat": 5,    "fiber": 1,   "sugar": 2,   "sodium": 600, "default_g": 300},
    "roti canai":        {"calories": 300, "protein": 8,   "carbs": 42,  "fat": 11,   "fiber": 1.5, "sugar": 2,   "sodium": 350, "default_g": 120},
}

# ═══════════════════════════════════════
# COOKING-STYLE / OIL MODIFIERS
# ═══════════════════════════════════════

_COOKING_MULT: dict[str, dict[str, float]] = {
    "fried":    {"cal": 1.30, "fat": 1.60},
    "steamed":  {"cal": 0.85, "fat": 0.60},
    "boiled":   {"cal": 0.90, "fat": 0.70},
    "roasted":  {"cal": 0.95, "fat": 0.85},
    "baked":    {"cal": 0.92, "fat": 0.80},
    "gravy":    {"cal": 1.10, "fat": 1.20},
    "raw":      {"cal": 1.00, "fat": 1.00},
}

_OIL_MULT: dict[str, dict[str, float]] = {
    "low":    {"cal": 0.90, "fat": 0.70},
    "medium": {"cal": 1.00, "fat": 1.00},
    "high":   {"cal": 1.20, "fat": 1.45},
}

_PORTION_MULT: dict[str, float] = {
    "small":  0.70,
    "medium": 1.00,
    "large":  1.40,
}

# ═══════════════════════════════════════
# UNIT → grams mapping
# ═══════════════════════════════════════

_UNIT_GRAMS: dict[str, float] = {
    "piece":   1.0,   # use food default_g per piece
    "bowl":    250,
    "plate":   300,
    "cup":     200,
    "glass":   250,
    "tbsp":    15,
    "serving": 1.0,   # sentinel — use food default
}


def _resolve_grams(item: ParsedFoodItem, default_g: float) -> float:
    """Resolve total grams from quantity, unit, and portion size."""
    unit = item.unit.lower() if item.unit else "serving"
    qty = max(item.quantity, 0.25)

    if unit in ("piece", "serving"):
        base = default_g * qty
    elif unit in _UNIT_GRAMS:
        base = _UNIT_GRAMS[unit] * qty
    else:
        base = default_g * qty

    portion_mult = _PORTION_MULT.get(item.portion_size, 1.0)
    return base * portion_mult


# ═══════════════════════════════════════
# FALLBACK ESTIMATION
# ═══════════════════════════════════════

_FALLBACK_CAL = 150
_FALLBACK_GRAMS = 200


def _estimate_unknown(item: ParsedFoodItem) -> ComponentResult:
    qty = max(item.quantity, 1)
    return ComponentResult(
        label=item.food_name or item.normalized_food_name,
        quantity_label=f"{qty} serving(s)",
        grams=_FALLBACK_GRAMS,
        calories=round(_FALLBACK_CAL * qty),
        protein=round(5 * qty, 1),
        carbs=round(20 * qty, 1),
        fat=round(5 * qty, 1),
        fiber=round(2 * qty, 1),
        sugar=round(3 * qty, 1),
        sodium=round(300 * qty),
        matched=False,
        estimated=True,
        food_code=None,
    )


# ═══════════════════════════════════════
# COMPONENT CALCULATION
# ═══════════════════════════════════════

def _calculate_component(item: ParsedFoodItem) -> ComponentResult:
    key = (item.normalized_food_name or item.food_name).lower().strip()
    food = FOOD_DB.get(key)

    if food is None:
        return _estimate_unknown(item)

    grams = _resolve_grams(item, food["default_g"])
    portion_factor = grams / 100.0

    cal = food["calories"] * portion_factor
    protein = food["protein"] * portion_factor
    carbs = food["carbs"] * portion_factor
    fat = food["fat"] * portion_factor
    fiber = food["fiber"] * portion_factor
    sugar = food["sugar"] * portion_factor
    sodium = food["sodium"] * portion_factor

    # Cooking-style modifier
    cm = _COOKING_MULT.get(item.cooking_style.lower(), {})
    cal *= cm.get("cal", 1.0)
    fat *= cm.get("fat", 1.0)

    # Oil-level modifier
    om = _OIL_MULT.get(item.oil_level.lower(), {})
    cal *= om.get("cal", 1.0)
    fat *= om.get("fat", 1.0)

    qty_label = f"{item.quantity} {item.unit or 'serving'}(s) ({round(grams)}g)"

    return ComponentResult(
        label=item.food_name or key,
        quantity_label=qty_label,
        grams=round(grams),
        calories=round(cal),
        protein=round(protein, 1),
        carbs=round(carbs, 1),
        fat=round(fat, 1),
        fiber=round(fiber, 1),
        sugar=round(sugar, 1),
        sodium=round(sodium),
        matched=True,
        estimated=False,
        food_code=key,
    )


# ═══════════════════════════════════════
# PUBLIC API
# ═══════════════════════════════════════

def calculate_nutrition(parsed: ParsedInput) -> tuple[AnalysisResult, list[str], Literal["high", "medium", "low"]]:
    """Run deterministic nutrition calculation on *parsed* detection.

    Returns ``(analysis_result, notes, confidence)``.
    """
    if not parsed.food_items:
        return (
            AnalysisResult(),
            ["No food items to analyze."],
            "low",
        )

    components: list[ComponentResult] = []
    notes: list[str] = []

    for item in parsed.food_items:
        comp = _calculate_component(item)
        components.append(comp)

    matched = sum(1 for c in components if c.matched)
    estimated = sum(1 for c in components if c.estimated)

    totals = AnalysisResult(
        total_calories=sum(c.calories for c in components),
        protein=round(sum(c.protein for c in components), 1),
        carbs=round(sum(c.carbs for c in components), 1),
        fats=round(sum(c.fat for c in components), 1),
        fiber=round(sum(c.fiber for c in components), 1),
        sugar=round(sum(c.sugar for c in components), 1),
        sodium=round(sum(c.sodium for c in components)),
        components=components,
        matched_count=matched,
        estimated_count=estimated,
    )

    # Confidence
    if estimated == 0:
        confidence: Literal["high", "medium", "low"] = "high"
    elif matched >= estimated:
        confidence = "medium"
    else:
        confidence = "low"

    if estimated > 0:
        names = [c.label for c in components if c.estimated]
        notes.append(f"Estimated values used for: {', '.join(names)}.")

    if parsed.cuisine and parsed.cuisine != "Unknown":
        notes.append(f"Detected cuisine: {parsed.cuisine}")

    return totals, notes, confidence
