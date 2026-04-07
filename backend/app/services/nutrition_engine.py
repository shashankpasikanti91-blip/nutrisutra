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

    # ─── South Indian — Dosa varieties ───
    "rava dosa":         {"calories": 185, "protein": 4,   "carbs": 26,  "fat": 7,    "fiber": 1,   "sugar": 1.5, "sodium": 340, "default_g": 130},
    "sooji dosa":        {"calories": 185, "protein": 4,   "carbs": 26,  "fat": 7,    "fiber": 1,   "sugar": 1.5, "sodium": 340, "default_g": 130},
    "semolina dosa":     {"calories": 185, "protein": 4,   "carbs": 26,  "fat": 7,    "fiber": 1,   "sugar": 1.5, "sodium": 340, "default_g": 130},
    "set dosa":          {"calories": 170, "protein": 4,   "carbs": 28,  "fat": 5,    "fiber": 1.2, "sugar": 1,   "sodium": 300, "default_g": 200},
    "paper dosa":        {"calories": 140, "protein": 3.5, "carbs": 25,  "fat": 3.5,  "fiber": 0.8, "sugar": 1,   "sodium": 280, "default_g": 100},
    "onion dosa":        {"calories": 180, "protein": 4,   "carbs": 27,  "fat": 6,    "fiber": 1,   "sugar": 1.5, "sodium": 330, "default_g": 130},
    "uttapam":           {"calories": 175, "protein": 5,   "carbs": 28,  "fat": 5,    "fiber": 1.5, "sugar": 2,   "sodium": 300, "default_g": 150},
    "uthappam":          {"calories": 175, "protein": 5,   "carbs": 28,  "fat": 5,    "fiber": 1.5, "sugar": 2,   "sodium": 300, "default_g": 150},
    "adai":              {"calories": 175, "protein": 7,   "carbs": 25,  "fat": 5,    "fiber": 3,   "sugar": 1,   "sodium": 300, "default_g": 120},
    "appam":             {"calories": 120, "protein": 2.5, "carbs": 22,  "fat": 2,    "fiber": 0.5, "sugar": 1,   "sodium": 200, "default_g": 70},
    "palappam":          {"calories": 120, "protein": 2.5, "carbs": 22,  "fat": 2,    "fiber": 0.5, "sugar": 1,   "sodium": 200, "default_g": 70},
    "idiyappam":         {"calories": 110, "protein": 2,   "carbs": 24,  "fat": 0.5,  "fiber": 0.5, "sugar": 0.5, "sodium": 180, "default_g": 60},
    "string hoppers":    {"calories": 110, "protein": 2,   "carbs": 24,  "fat": 0.5,  "fiber": 0.5, "sugar": 0.5, "sodium": 180, "default_g": 60},
    "nool puttu":        {"calories": 110, "protein": 2,   "carbs": 24,  "fat": 0.5,  "fiber": 0.5, "sugar": 0.5, "sodium": 180, "default_g": 60},
    "puttu":             {"calories": 210, "protein": 4,   "carbs": 38,  "fat": 5,    "fiber": 2,   "sugar": 1,   "sodium": 150, "default_g": 150},
    "kuzhi paniyaram":   {"calories": 160, "protein": 4,   "carbs": 24,  "fat": 5.5,  "fiber": 1,   "sugar": 1,   "sodium": 280, "default_g": 100},
    "paniyaram":         {"calories": 160, "protein": 4,   "carbs": 24,  "fat": 5.5,  "fiber": 1,   "sugar": 1,   "sodium": 280, "default_g": 100},
    "appe":              {"calories": 160, "protein": 4,   "carbs": 24,  "fat": 5.5,  "fiber": 1,   "sugar": 1,   "sodium": 280, "default_g": 100},
    "paddu":             {"calories": 160, "protein": 4,   "carbs": 24,  "fat": 5.5,  "fiber": 1,   "sugar": 1,   "sodium": 280, "default_g": 100},

    # ─── South Indian — rice dishes ───
    "tamarind rice":     {"calories": 175, "protein": 3,   "carbs": 32,  "fat": 4,    "fiber": 1.5, "sugar": 3,   "sodium": 350, "default_g": 200},
    "pulihora":          {"calories": 175, "protein": 3,   "carbs": 32,  "fat": 4,    "fiber": 1.5, "sugar": 3,   "sodium": 350, "default_g": 200},
    "puliyodharai":      {"calories": 175, "protein": 3,   "carbs": 32,  "fat": 4,    "fiber": 1.5, "sugar": 3,   "sodium": 350, "default_g": 200},
    "puliyogare":        {"calories": 175, "protein": 3,   "carbs": 32,  "fat": 4,    "fiber": 1.5, "sugar": 3,   "sodium": 350, "default_g": 200},
    "coconut rice":      {"calories": 190, "protein": 3,   "carbs": 30,  "fat": 7,    "fiber": 2,   "sugar": 1,   "sodium": 280, "default_g": 200},
    "kobbari annam":     {"calories": 190, "protein": 3,   "carbs": 30,  "fat": 7,    "fiber": 2,   "sugar": 1,   "sodium": 280, "default_g": 200},
    "thengai sadam":     {"calories": 190, "protein": 3,   "carbs": 30,  "fat": 7,    "fiber": 2,   "sugar": 1,   "sodium": 280, "default_g": 200},
    "bisi bele bath":    {"calories": 165, "protein": 5,   "carbs": 28,  "fat": 4,    "fiber": 2,   "sugar": 2,   "sodium": 380, "default_g": 250},
    "bisibelebath":      {"calories": 165, "protein": 5,   "carbs": 28,  "fat": 4,    "fiber": 2,   "sugar": 2,   "sodium": 380, "default_g": 250},
    "vangi bath":        {"calories": 185, "protein": 3.5, "carbs": 32,  "fat": 5,    "fiber": 2.5, "sugar": 3,   "sodium": 360, "default_g": 200},
    "brinjal rice":      {"calories": 185, "protein": 3.5, "carbs": 32,  "fat": 5,    "fiber": 2.5, "sugar": 3,   "sodium": 360, "default_g": 200},

    # ─── South Indian — curries/sides ───
    "avial":             {"calories": 100, "protein": 2.5, "carbs": 10,  "fat": 6,    "fiber": 3,   "sugar": 2,   "sodium": 300, "default_g": 150},
    "thoran":            {"calories": 85,  "protein": 2.5, "carbs": 8,   "fat": 5,    "fiber": 2.5, "sugar": 2,   "sodium": 200, "default_g": 100},
    "olan":              {"calories": 80,  "protein": 2,   "carbs": 8,   "fat": 5,    "fiber": 2,   "sugar": 2,   "sodium": 250, "default_g": 150},
    "erissery":          {"calories": 95,  "protein": 3,   "carbs": 12,  "fat": 4.5,  "fiber": 3,   "sugar": 3,   "sodium": 280, "default_g": 150},
    "stew":              {"calories": 110, "protein": 8,   "carbs": 8,   "fat": 5,    "fiber": 1.5, "sugar": 2,   "sodium": 380, "default_g": 200},
    "kerala stew":       {"calories": 110, "protein": 8,   "carbs": 8,   "fat": 5,    "fiber": 1.5, "sugar": 2,   "sodium": 380, "default_g": 200},
    "fish molee":        {"calories": 130, "protein": 14,  "carbs": 4,   "fat": 7,    "fiber": 0.5, "sugar": 2,   "sodium": 480, "default_g": 200},
    "meen moilee":       {"calories": 130, "protein": 14,  "carbs": 4,   "fat": 7,    "fiber": 0.5, "sugar": 2,   "sodium": 480, "default_g": 200},
    "prawn curry":       {"calories": 140, "protein": 16,  "carbs": 6,   "fat": 6,    "fiber": 1,   "sugar": 2,   "sodium": 550, "default_g": 200},
    "konju curry":       {"calories": 140, "protein": 16,  "carbs": 6,   "fat": 6,    "fiber": 1,   "sugar": 2,   "sodium": 550, "default_g": 200},
    "crab curry":        {"calories": 145, "protein": 15,  "carbs": 5,   "fat": 7,    "fiber": 0.5, "sugar": 2,   "sodium": 580, "default_g": 200},
    "karimeen pollichathu": {"calories": 175, "protein": 18, "carbs": 5, "fat": 10,   "fiber": 1,   "sugar": 1,   "sodium": 520, "default_g": 200},
    "kappa":             {"calories": 120, "protein": 1.5, "carbs": 28,  "fat": 0.3,  "fiber": 1.5, "sugar": 1,   "sodium": 50,  "default_g": 200},
    "tapioca":           {"calories": 120, "protein": 1.5, "carbs": 28,  "fat": 0.3,  "fiber": 1.5, "sugar": 1,   "sodium": 50,  "default_g": 200},
    "gutti vankaya":     {"calories": 120, "protein": 2.5, "carbs": 10,  "fat": 8,    "fiber": 3,   "sugar": 3,   "sodium": 450, "default_g": 150},
    "stuffed brinjal curry": {"calories": 120, "protein": 2.5, "carbs": 10, "fat": 8, "fiber": 3,   "sugar": 3,   "sodium": 450, "default_g": 150},
    "dosakaya pappu":    {"calories": 110, "protein": 7,   "carbs": 15,  "fat": 2.5,  "fiber": 3,   "sugar": 2,   "sodium": 380, "default_g": 200},
    "majjiga pulusu":    {"calories": 70,  "protein": 3,   "carbs": 7,   "fat": 3,    "fiber": 0.5, "sugar": 4,   "sodium": 350, "default_g": 150},
    "mor kulambu":       {"calories": 70,  "protein": 3,   "carbs": 7,   "fat": 3,    "fiber": 0.5, "sugar": 4,   "sodium": 350, "default_g": 150},
    "chettinad chicken": {"calories": 170, "protein": 16,  "carbs": 5,   "fat": 10,   "fiber": 1.5, "sugar": 1.5, "sodium": 560, "default_g": 200},
    "chettinad fish curry": {"calories": 145, "protein": 15, "carbs": 5, "fat": 8,    "fiber": 1,   "sugar": 1.5, "sodium": 540, "default_g": 200},
    "gongura chicken":   {"calories": 155, "protein": 14,  "carbs": 4,   "fat": 9,    "fiber": 1.5, "sugar": 1,   "sodium": 500, "default_g": 200},
    "gongura mutton":    {"calories": 175, "protein": 15,  "carbs": 4,   "fat": 11,   "fiber": 1.5, "sugar": 1,   "sodium": 520, "default_g": 200},
    "gongura pachadi":   {"calories": 120, "protein": 2,   "carbs": 8,   "fat": 8,    "fiber": 2,   "sugar": 1,   "sodium": 800, "default_g": 30},
    "gongura chutney":   {"calories": 120, "protein": 2,   "carbs": 8,   "fat": 8,    "fiber": 2,   "sugar": 1,   "sodium": 800, "default_g": 30},
    "punugulu":          {"calories": 250, "protein": 6,   "carbs": 30,  "fat": 12,   "fiber": 1.5, "sugar": 1,   "sodium": 320, "default_g": 80},
    "jonna rotte":       {"calories": 190, "protein": 5,   "carbs": 38,  "fat": 2,    "fiber": 4,   "sugar": 1,   "sodium": 200, "default_g": 60},
    "bobbatlu":          {"calories": 260, "protein": 5,   "carbs": 42,  "fat": 8,    "fiber": 2,   "sugar": 18,  "sodium": 80,  "default_g": 75},
    "obbattu":           {"calories": 260, "protein": 5,   "carbs": 42,  "fat": 8,    "fiber": 2,   "sugar": 18,  "sodium": 80,  "default_g": 75},
    "holige":            {"calories": 260, "protein": 5,   "carbs": 42,  "fat": 8,    "fiber": 2,   "sugar": 18,  "sodium": 80,  "default_g": 75},
    "murukku":           {"calories": 450, "protein": 8,   "carbs": 55,  "fat": 22,   "fiber": 3,   "sugar": 1,   "sodium": 600, "default_g": 30},
    "chakli":            {"calories": 450, "protein": 8,   "carbs": 55,  "fat": 22,   "fiber": 3,   "sugar": 1,   "sodium": 600, "default_g": 30},
    "mysore pak":        {"calories": 440, "protein": 6,   "carbs": 42,  "fat": 28,   "fiber": 1,   "sugar": 32,  "sodium": 20,  "default_g": 40},
    "ragi mudde":        {"calories": 110, "protein": 3.5, "carbs": 22,  "fat": 1.5,  "fiber": 3,   "sugar": 1,   "sodium": 80,  "default_g": 120},
    "ragi ball":         {"calories": 110, "protein": 3.5, "carbs": 22,  "fat": 1.5,  "fiber": 3,   "sugar": 1,   "sodium": 80,  "default_g": 120},

    # ─── Kerala parotta (porotta) ───
    "kerala porotta":    {"calories": 310, "protein": 7,   "carbs": 42,  "fat": 13,   "fiber": 1.5, "sugar": 2,   "sodium": 420, "default_g": 90},
    "porotta":           {"calories": 310, "protein": 7,   "carbs": 42,  "fat": 13,   "fiber": 1.5, "sugar": 2,   "sodium": 420, "default_g": 90},
    "parotta":           {"calories": 310, "protein": 7,   "carbs": 42,  "fat": 13,   "fiber": 1.5, "sugar": 2,   "sodium": 420, "default_g": 90},
    "malabar parotta":   {"calories": 310, "protein": 7,   "carbs": 42,  "fat": 13,   "fiber": 1.5, "sugar": 2,   "sodium": 420, "default_g": 90},

    # ─── North Indian breads ───
    "aloo paratha":      {"calories": 300, "protein": 7,   "carbs": 40,  "fat": 13,   "fiber": 3,   "sugar": 2,   "sodium": 400, "default_g": 120},
    "gobi paratha":      {"calories": 290, "protein": 6.5, "carbs": 38,  "fat": 12,   "fiber": 3,   "sugar": 2,   "sodium": 380, "default_g": 120},
    "paneer paratha":    {"calories": 320, "protein": 11,  "carbs": 38,  "fat": 14,   "fiber": 2,   "sugar": 2,   "sodium": 400, "default_g": 120},
    "laccha paratha":    {"calories": 280, "protein": 6,   "carbs": 35,  "fat": 13,   "fiber": 2,   "sugar": 1,   "sodium": 380, "default_g": 80},
    "bhatura":           {"calories": 340, "protein": 8,   "carbs": 45,  "fat": 15,   "fiber": 2,   "sugar": 2,   "sodium": 450, "default_g": 100},
    "kulcha":            {"calories": 270, "protein": 7,   "carbs": 44,  "fat": 7,    "fiber": 2,   "sugar": 2,   "sodium": 430, "default_g": 90},
    "amritsari kulcha":  {"calories": 280, "protein": 7.5, "carbs": 44,  "fat": 8,    "fiber": 2,   "sugar": 2,   "sodium": 440, "default_g": 100},
    "missi roti":        {"calories": 220, "protein": 9,   "carbs": 34,  "fat": 6,    "fiber": 4,   "sugar": 2,   "sodium": 380, "default_g": 60},
    "makki ki roti":     {"calories": 195, "protein": 4.5, "carbs": 38,  "fat": 3,    "fiber": 3,   "sugar": 2,   "sodium": 180, "default_g": 70},
    "jowar roti":        {"calories": 190, "protein": 5,   "carbs": 38,  "fat": 2,    "fiber": 4,   "sugar": 1,   "sodium": 200, "default_g": 60},
    "bajra roti":        {"calories": 180, "protein": 5,   "carbs": 34,  "fat": 3,    "fiber": 4,   "sugar": 1,   "sodium": 180, "default_g": 60},

    # ─── North Indian curries ───
    "sarson ka saag":    {"calories": 110, "protein": 4,   "carbs": 10,  "fat": 6,    "fiber": 4,   "sugar": 2,   "sodium": 350, "default_g": 200},
    "mustard greens":    {"calories": 110, "protein": 4,   "carbs": 10,  "fat": 6,    "fiber": 4,   "sugar": 2,   "sodium": 350, "default_g": 200},
    "shahi paneer":      {"calories": 260, "protein": 11,  "carbs": 9,   "fat": 20,   "fiber": 1,   "sugar": 4,   "sodium": 530, "default_g": 200},
    "matar paneer":      {"calories": 190, "protein": 11,  "carbs": 12,  "fat": 11,   "fiber": 2.5, "sugar": 3,   "sodium": 470, "default_g": 200},
    "aloo gobi":         {"calories": 115, "protein": 3,   "carbs": 16,  "fat": 4.5,  "fiber": 3,   "sugar": 3,   "sodium": 380, "default_g": 200},
    "kadai paneer":      {"calories": 230, "protein": 12,  "carbs": 10,  "fat": 17,   "fiber": 2,   "sugar": 4,   "sodium": 510, "default_g": 200},
    "karahi paneer":     {"calories": 230, "protein": 12,  "carbs": 10,  "fat": 17,   "fiber": 2,   "sugar": 4,   "sodium": 510, "default_g": 200},
    "rogan josh":        {"calories": 200, "protein": 17,  "carbs": 6,   "fat": 13,   "fiber": 1.5, "sugar": 2,   "sodium": 520, "default_g": 200},
    "roghan josh":       {"calories": 200, "protein": 17,  "carbs": 6,   "fat": 13,   "fiber": 1.5, "sugar": 2,   "sodium": 520, "default_g": 200},
    "seekh kebab":       {"calories": 210, "protein": 18,  "carbs": 5,   "fat": 14,   "fiber": 0.5, "sugar": 1,   "sodium": 480, "default_g": 100},
    "reshmi kebab":      {"calories": 195, "protein": 17,  "carbs": 4,   "fat": 13,   "fiber": 0.5, "sugar": 1.5, "sodium": 450, "default_g": 100},
    "chicken tikka":     {"calories": 175, "protein": 22,  "carbs": 5,   "fat": 8,    "fiber": 0.5, "sugar": 1,   "sodium": 500, "default_g": 150},
    "jeera rice":        {"calories": 145, "protein": 3,   "carbs": 28,  "fat": 3.5,  "fiber": 0.8, "sugar": 0.5, "sodium": 280, "default_g": 200},
    "amritsari fish":    {"calories": 260, "protein": 22,  "carbs": 15,  "fat": 13,   "fiber": 1,   "sugar": 1,   "sodium": 550, "default_g": 150},
    "keema":             {"calories": 200, "protein": 16,  "carbs": 6,   "fat": 13,   "fiber": 1,   "sugar": 2,   "sodium": 450, "default_g": 180},
    "kheema":            {"calories": 200, "protein": 16,  "carbs": 6,   "fat": 13,   "fiber": 1,   "sugar": 2,   "sodium": 450, "default_g": 180},

    # ─── Gujarati / Maharashtrian ───
    "dhokla":            {"calories": 160, "protein": 6,   "carbs": 26,  "fat": 4,    "fiber": 1.5, "sugar": 4,   "sodium": 450, "default_g": 100},
    "khaman":            {"calories": 160, "protein": 6,   "carbs": 26,  "fat": 4,    "fiber": 1.5, "sugar": 4,   "sodium": 450, "default_g": 100},
    "khandvi":           {"calories": 145, "protein": 7,   "carbs": 16,  "fat": 6,    "fiber": 1.5, "sugar": 2,   "sodium": 380, "default_g": 80},
    "thepla":            {"calories": 210, "protein": 6,   "carbs": 30,  "fat": 8,    "fiber": 3,   "sugar": 1,   "sodium": 320, "default_g": 60},
    "methi thepla":      {"calories": 210, "protein": 6,   "carbs": 30,  "fat": 8,    "fiber": 3,   "sugar": 1,   "sodium": 320, "default_g": 60},
    "puran poli":        {"calories": 260, "protein": 6,   "carbs": 44,  "fat": 7,    "fiber": 3,   "sugar": 18,  "sodium": 80,  "default_g": 80},
    "shrikhand":         {"calories": 220, "protein": 5,   "carbs": 32,  "fat": 8,    "fiber": 0,   "sugar": 28,  "sodium": 50,  "default_g": 100},
    "misal pav":         {"calories": 290, "protein": 9,   "carbs": 40,  "fat": 9,    "fiber": 6,   "sugar": 4,   "sodium": 520, "default_g": 250},
    "sabudana khichdi":  {"calories": 205, "protein": 3,   "carbs": 38,  "fat": 6,    "fiber": 1,   "sugar": 2,   "sodium": 280, "default_g": 200},
    "sago khichdi":      {"calories": 205, "protein": 3,   "carbs": 38,  "fat": 6,    "fiber": 1,   "sugar": 2,   "sodium": 280, "default_g": 200},
    "kolhapuri chicken": {"calories": 185, "protein": 17,  "carbs": 6,   "fat": 11,   "fiber": 1.5, "sugar": 2,   "sodium": 580, "default_g": 200},
    "sol kadhi":         {"calories": 45,  "protein": 1,   "carbs": 5,   "fat": 2,    "fiber": 0.5, "sugar": 3,   "sodium": 350, "default_g": 200},
    "modak":             {"calories": 200, "protein": 3,   "carbs": 34,  "fat": 6,    "fiber": 2,   "sugar": 16,  "sodium": 80,  "default_g": 60},
    "ukadiche modak":    {"calories": 200, "protein": 3,   "carbs": 34,  "fat": 6,    "fiber": 2,   "sugar": 16,  "sodium": 80,  "default_g": 60},

    # ─── Bengali / Odia ───
    "hilsa fish":        {"calories": 155, "protein": 18,  "carbs": 3,   "fat": 8,    "fiber": 0.5, "sugar": 1,   "sodium": 520, "default_g": 200},
    "ilish mach":        {"calories": 155, "protein": 18,  "carbs": 3,   "fat": 8,    "fiber": 0.5, "sugar": 1,   "sodium": 520, "default_g": 200},
    "shorshe ilish":     {"calories": 155, "protein": 18,  "carbs": 3,   "fat": 8,    "fiber": 0.5, "sugar": 1,   "sodium": 520, "default_g": 200},
    "chingri malai curry":{"calories": 165, "protein": 16, "carbs": 5,   "fat": 9,    "fiber": 0.5, "sugar": 3,   "sodium": 500, "default_g": 200},
    "prawn malai curry": {"calories": 165, "protein": 16,  "carbs": 5,   "fat": 9,    "fiber": 0.5, "sugar": 3,   "sodium": 500, "default_g": 200},
    "macher jhol":       {"calories": 130, "protein": 15,  "carbs": 5,   "fat": 6,    "fiber": 1.5, "sugar": 2,   "sodium": 480, "default_g": 200},
    "bengali fish curry": {"calories": 130, "protein": 15, "carbs": 5,   "fat": 6,    "fiber": 1.5, "sugar": 2,   "sodium": 480, "default_g": 200},
    "aloo posto":        {"calories": 155, "protein": 3.5, "carbs": 22,  "fat": 6,    "fiber": 2,   "sugar": 2,   "sodium": 350, "default_g": 150},
    "mishti doi":        {"calories": 130, "protein": 4.5, "carbs": 22,  "fat": 3,    "fiber": 0,   "sugar": 20,  "sodium": 60,  "default_g": 100},
    "sweet curd":        {"calories": 130, "protein": 4.5, "carbs": 22,  "fat": 3,    "fiber": 0,   "sugar": 20,  "sodium": 60,  "default_g": 100},
    "sandesh":           {"calories": 275, "protein": 8,   "carbs": 34,  "fat": 12,   "fiber": 0,   "sugar": 30,  "sodium": 40,  "default_g": 50},
    "dalma":             {"calories": 115, "protein": 6,   "carbs": 16,  "fat": 3,    "fiber": 4,   "sugar": 2,   "sodium": 350, "default_g": 200},
    "chhena poda":       {"calories": 290, "protein": 8,   "carbs": 36,  "fat": 13,   "fiber": 0,   "sugar": 28,  "sodium": 60,  "default_g": 80},

    # ─── Japanese ───
    "sushi":             {"calories": 150, "protein": 6,   "carbs": 28,  "fat": 2,    "fiber": 1,   "sugar": 4,   "sodium": 500, "default_g": 150},
    "sushi roll":        {"calories": 150, "protein": 6,   "carbs": 28,  "fat": 2,    "fiber": 1,   "sugar": 4,   "sodium": 500, "default_g": 150},
    "maki roll":         {"calories": 150, "protein": 6,   "carbs": 28,  "fat": 2,    "fiber": 1,   "sugar": 4,   "sodium": 500, "default_g": 150},
    "california roll":   {"calories": 150, "protein": 6,   "carbs": 28,  "fat": 2,    "fiber": 1,   "sugar": 4,   "sodium": 500, "default_g": 150},
    "nigiri":            {"calories": 130, "protein": 7,   "carbs": 20,  "fat": 1.5,  "fiber": 0.5, "sugar": 3,   "sodium": 450, "default_g": 80},
    "ramen":             {"calories": 190, "protein": 10,  "carbs": 26,  "fat": 5,    "fiber": 1.5, "sugar": 2,   "sodium": 700, "default_g": 400},
    "ramen noodles":     {"calories": 190, "protein": 10,  "carbs": 26,  "fat": 5,    "fiber": 1.5, "sugar": 2,   "sodium": 700, "default_g": 400},
    "udon":              {"calories": 165, "protein": 7,   "carbs": 30,  "fat": 2,    "fiber": 1.5, "sugar": 3,   "sodium": 600, "default_g": 350},
    "udon noodles":      {"calories": 165, "protein": 7,   "carbs": 30,  "fat": 2,    "fiber": 1.5, "sugar": 3,   "sodium": 600, "default_g": 350},
    "tempura":           {"calories": 245, "protein": 8,   "carbs": 22,  "fat": 14,   "fiber": 1,   "sugar": 2,   "sodium": 350, "default_g": 100},
    "prawn tempura":     {"calories": 245, "protein": 8,   "carbs": 22,  "fat": 14,   "fiber": 1,   "sugar": 2,   "sodium": 350, "default_g": 100},
    "gyoza":             {"calories": 220, "protein": 10,  "carbs": 20,  "fat": 10,   "fiber": 1.5, "sugar": 2,   "sodium": 520, "default_g": 120},
    "dumplings":         {"calories": 230, "protein": 10,  "carbs": 28,  "fat": 9,    "fiber": 1,   "sugar": 2,   "sodium": 550, "default_g": 150},
    "momos":             {"calories": 200, "protein": 9,   "carbs": 24,  "fat": 7.5,  "fiber": 1,   "sugar": 2,   "sodium": 500, "default_g": 120},
    "tonkatsu":          {"calories": 290, "protein": 20,  "carbs": 14,  "fat": 17,   "fiber": 0.5, "sugar": 1,   "sodium": 500, "default_g": 150},
    "miso soup":         {"calories": 40,  "protein": 3,   "carbs": 4,   "fat": 1.5,  "fiber": 0.5, "sugar": 1,   "sodium": 620, "default_g": 200},
    "onigiri":           {"calories": 155, "protein": 4,   "carbs": 30,  "fat": 1.5,  "fiber": 0.5, "sugar": 1,   "sodium": 380, "default_g": 100},
    "rice ball":         {"calories": 155, "protein": 4,   "carbs": 30,  "fat": 1.5,  "fiber": 0.5, "sugar": 1,   "sodium": 380, "default_g": 100},
    "yakitori":          {"calories": 200, "protein": 17,  "carbs": 6,   "fat": 12,   "fiber": 0,   "sugar": 5,   "sodium": 450, "default_g": 100},
    "teriyaki chicken":  {"calories": 180, "protein": 20,  "carbs": 8,   "fat": 7,    "fiber": 0.5, "sugar": 6,   "sodium": 550, "default_g": 200},
    "chicken teriyaki":  {"calories": 180, "protein": 20,  "carbs": 8,   "fat": 7,    "fiber": 0.5, "sugar": 6,   "sodium": 550, "default_g": 200},
    "takoyaki":          {"calories": 230, "protein": 8,   "carbs": 28,  "fat": 10,   "fiber": 1,   "sugar": 3,   "sodium": 580, "default_g": 100},
    "katsu curry":       {"calories": 320, "protein": 18,  "carbs": 35,  "fat": 12,   "fiber": 2,   "sugar": 4,   "sodium": 620, "default_g": 400},
    "dim sum":           {"calories": 180, "protein": 9,   "carbs": 18,  "fat": 7,    "fiber": 1,   "sugar": 2,   "sodium": 480, "default_g": 100},
    "har gow":           {"calories": 180, "protein": 9,   "carbs": 18,  "fat": 7,    "fiber": 1,   "sugar": 2,   "sodium": 480, "default_g": 100},
    "siu mai":           {"calories": 185, "protein": 10,  "carbs": 17,  "fat": 8,    "fiber": 1,   "sugar": 2,   "sodium": 490, "default_g": 100},
    "soup dumplings":    {"calories": 195, "protein": 10,  "carbs": 20,  "fat": 8,    "fiber": 1,   "sugar": 2,   "sodium": 480, "default_g": 120},
    "xiao long bao":     {"calories": 195, "protein": 10,  "carbs": 20,  "fat": 8,    "fiber": 1,   "sugar": 2,   "sodium": 480, "default_g": 120},

    # ─── Korean ───
    "bibimbap":          {"calories": 185, "protein": 8,   "carbs": 30,  "fat": 4.5,  "fiber": 3,   "sugar": 3,   "sodium": 600, "default_g": 400},
    "korean rice bowl":  {"calories": 185, "protein": 8,   "carbs": 30,  "fat": 4.5,  "fiber": 3,   "sugar": 3,   "sodium": 600, "default_g": 400},
    "kimchi":            {"calories": 15,  "protein": 1.5, "carbs": 2,   "fat": 0.5,  "fiber": 1,   "sugar": 1,   "sodium": 380, "default_g": 80},
    "bulgogi":           {"calories": 225, "protein": 22,  "carbs": 8,   "fat": 11,   "fiber": 0.5, "sugar": 6,   "sodium": 620, "default_g": 200},
    "korean bbq beef":   {"calories": 225, "protein": 22,  "carbs": 8,   "fat": 11,   "fiber": 0.5, "sugar": 6,   "sodium": 620, "default_g": 200},
    "tteokbokki":        {"calories": 170, "protein": 4,   "carbs": 36,  "fat": 2,    "fiber": 1,   "sugar": 6,   "sodium": 680, "default_g": 200},
    "ddukbokki":         {"calories": 170, "protein": 4,   "carbs": 36,  "fat": 2,    "fiber": 1,   "sugar": 6,   "sodium": 680, "default_g": 200},
    "korean fried chicken": {"calories": 300, "protein": 20, "carbs": 14, "fat": 18,  "fiber": 0.5, "sugar": 6,   "sodium": 650, "default_g": 150},
    "japchae":           {"calories": 175, "protein": 5,   "carbs": 30,  "fat": 4,    "fiber": 2,   "sugar": 5,   "sodium": 500, "default_g": 300},
    "korean glass noodles": {"calories": 175, "protein": 5, "carbs": 30, "fat": 4,    "fiber": 2,   "sugar": 5,   "sodium": 500, "default_g": 300},
    "samgyeopsal":       {"calories": 390, "protein": 17,  "carbs": 0,   "fat": 35,   "fiber": 0,   "sugar": 0,   "sodium": 320, "default_g": 150},
    "pork belly bbq":    {"calories": 390, "protein": 17,  "carbs": 0,   "fat": 35,   "fiber": 0,   "sugar": 0,   "sodium": 320, "default_g": 150},
    "bingsu":            {"calories": 250, "protein": 3,   "carbs": 52,  "fat": 3,    "fiber": 1,   "sugar": 40,  "sodium": 80,  "default_g": 250},
    "kimbap":            {"calories": 155, "protein": 5,   "carbs": 28,  "fat": 3,    "fiber": 1,   "sugar": 3,   "sodium": 420, "default_g": 150},

    # ─── Thai ───
    "pad thai":          {"calories": 180, "protein": 8,   "carbs": 24,  "fat": 6,    "fiber": 1.5, "sugar": 4,   "sodium": 560, "default_g": 300},
    "thai noodles":      {"calories": 180, "protein": 8,   "carbs": 24,  "fat": 6,    "fiber": 1.5, "sugar": 4,   "sodium": 560, "default_g": 300},
    "green curry":       {"calories": 165, "protein": 10,  "carbs": 8,   "fat": 11,   "fiber": 1.5, "sugar": 3,   "sodium": 580, "default_g": 250},
    "thai green curry":  {"calories": 165, "protein": 10,  "carbs": 8,   "fat": 11,   "fiber": 1.5, "sugar": 3,   "sodium": 580, "default_g": 250},
    "red curry":         {"calories": 175, "protein": 11,  "carbs": 8,   "fat": 12,   "fiber": 1,   "sugar": 3.5, "sodium": 600, "default_g": 250},
    "thai red curry":    {"calories": 175, "protein": 11,  "carbs": 8,   "fat": 12,   "fiber": 1,   "sugar": 3.5, "sodium": 600, "default_g": 250},
    "massaman curry":    {"calories": 180, "protein": 12,  "carbs": 12,  "fat": 10,   "fiber": 2,   "sugar": 4,   "sodium": 560, "default_g": 250},
    "tom yum":           {"calories": 70,  "protein": 5,   "carbs": 6,   "fat": 2.5,  "fiber": 1,   "sugar": 2,   "sodium": 700, "default_g": 350},
    "tom yum goong":     {"calories": 70,  "protein": 5,   "carbs": 6,   "fat": 2.5,  "fiber": 1,   "sugar": 2,   "sodium": 700, "default_g": 350},
    "tom kha gai":       {"calories": 115, "protein": 8,   "carbs": 6,   "fat": 7,    "fiber": 0.5, "sugar": 3,   "sodium": 580, "default_g": 350},
    "coconut chicken soup": {"calories": 115, "protein": 8, "carbs": 6,  "fat": 7,    "fiber": 0.5, "sugar": 3,   "sodium": 580, "default_g": 350},
    "som tam":           {"calories": 80,  "protein": 2,   "carbs": 14,  "fat": 1.5,  "fiber": 3,   "sugar": 7,   "sodium": 480, "default_g": 200},
    "papaya salad":      {"calories": 80,  "protein": 2,   "carbs": 14,  "fat": 1.5,  "fiber": 3,   "sugar": 7,   "sodium": 480, "default_g": 200},
    "mango sticky rice": {"calories": 220, "protein": 3.5, "carbs": 44,  "fat": 4,    "fiber": 1.5, "sugar": 18,  "sodium": 80,  "default_g": 200},
    "khao niao mamuang": {"calories": 220, "protein": 3.5, "carbs": 44,  "fat": 4,    "fiber": 1.5, "sugar": 18,  "sodium": 80,  "default_g": 200},
    "basil chicken":     {"calories": 190, "protein": 18,  "carbs": 8,   "fat": 9,    "fiber": 1,   "sugar": 3,   "sodium": 620, "default_g": 250},
    "pad krapow":        {"calories": 190, "protein": 18,  "carbs": 8,   "fat": 9,    "fiber": 1,   "sugar": 3,   "sodium": 620, "default_g": 250},

    # ─── Vietnamese ───
    "pho":               {"calories": 140, "protein": 12,  "carbs": 18,  "fat": 3,    "fiber": 1,   "sugar": 2,   "sodium": 650, "default_g": 500},
    "pho bo":            {"calories": 140, "protein": 12,  "carbs": 18,  "fat": 3,    "fiber": 1,   "sugar": 2,   "sodium": 650, "default_g": 500},
    "banh mi":           {"calories": 230, "protein": 12,  "carbs": 30,  "fat": 7,    "fiber": 2,   "sugar": 3,   "sodium": 680, "default_g": 200},
    "vietnamese sandwich": {"calories": 230, "protein": 12, "carbs": 30, "fat": 7,    "fiber": 2,   "sugar": 3,   "sodium": 680, "default_g": 200},
    "fresh spring rolls": {"calories": 95, "protein": 5,   "carbs": 14,  "fat": 2,    "fiber": 1.5, "sugar": 2,   "sodium": 280, "default_g": 80},
    "goi cuon":          {"calories": 95,  "protein": 5,   "carbs": 14,  "fat": 2,    "fiber": 1.5, "sugar": 2,   "sodium": 280, "default_g": 80},
    "summer rolls":      {"calories": 95,  "protein": 5,   "carbs": 14,  "fat": 2,    "fiber": 1.5, "sugar": 2,   "sodium": 280, "default_g": 80},

    # ─── Chinese / Indo-Chinese ───
    "manchurian":        {"calories": 220, "protein": 5,   "carbs": 28,  "fat": 9,    "fiber": 2,   "sugar": 6,   "sodium": 650, "default_g": 150},
    "veg manchurian":    {"calories": 200, "protein": 4,   "carbs": 26,  "fat": 8,    "fiber": 2,   "sugar": 5,   "sodium": 620, "default_g": 150},
    "chicken manchurian": {"calories": 240, "protein": 14, "carbs": 18,  "fat": 12,   "fiber": 1,   "sugar": 5,   "sodium": 700, "default_g": 150},
    "gobi manchurian":   {"calories": 200, "protein": 4,   "carbs": 26,  "fat": 8,    "fiber": 2,   "sugar": 5,   "sodium": 620, "default_g": 150},
    "hakka noodles":     {"calories": 200, "protein": 7,   "carbs": 30,  "fat": 6,    "fiber": 2,   "sugar": 3,   "sodium": 680, "default_g": 300},
    "schezwan fried rice": {"calories": 210, "protein": 7, "carbs": 34,  "fat": 6,    "fiber": 1.5, "sugar": 3,   "sodium": 700, "default_g": 300},
    "szechuan rice":     {"calories": 210, "protein": 7,   "carbs": 34,  "fat": 6,    "fiber": 1.5, "sugar": 3,   "sodium": 700, "default_g": 300},
    "sweet and sour pork": {"calories": 215, "protein": 12, "carbs": 22, "fat": 9,    "fiber": 1,   "sugar": 11,  "sodium": 580, "default_g": 250},
    "mapo tofu":         {"calories": 145, "protein": 8,   "carbs": 8,   "fat": 9,    "fiber": 1,   "sugar": 2,   "sodium": 680, "default_g": 200},
    "spicy tofu":        {"calories": 145, "protein": 8,   "carbs": 8,   "fat": 9,    "fiber": 1,   "sugar": 2,   "sodium": 680, "default_g": 200},
    "peking duck":       {"calories": 295, "protein": 18,  "carbs": 8,   "fat": 22,   "fiber": 0.5, "sugar": 4,   "sodium": 580, "default_g": 150},

    # ─── SE Asian ───
    "tempeh":            {"calories": 195, "protein": 19,  "carbs": 10,  "fat": 11,   "fiber": 3,   "sugar": 1,   "sodium": 9,   "default_g": 100},
    "gado gado":         {"calories": 165, "protein": 7,   "carbs": 16,  "fat": 9,    "fiber": 3,   "sugar": 5,   "sodium": 420, "default_g": 250},
    "mee goreng":        {"calories": 190, "protein": 8,   "carbs": 27,  "fat": 6,    "fiber": 1.5, "sugar": 3,   "sodium": 680, "default_g": 300},
    "mi goreng":         {"calories": 190, "protein": 8,   "carbs": 27,  "fat": 6,    "fiber": 1.5, "sugar": 3,   "sodium": 680, "default_g": 300},
    "kottu roti":        {"calories": 215, "protein": 10,  "carbs": 28,  "fat": 7,    "fiber": 2,   "sugar": 2,   "sodium": 600, "default_g": 350},
    "kottu":             {"calories": 215, "protein": 10,  "carbs": 28,  "fat": 7,    "fiber": 2,   "sugar": 2,   "sodium": 600, "default_g": 350},

    # ─── Western ───
    "steak":             {"calories": 255, "protein": 26,  "carbs": 0,   "fat": 16,   "fiber": 0,   "sugar": 0,   "sodium": 65,  "default_g": 200},
    "grilled steak":     {"calories": 255, "protein": 26,  "carbs": 0,   "fat": 16,   "fiber": 0,   "sugar": 0,   "sodium": 65,  "default_g": 200},
    "ribeye":            {"calories": 275, "protein": 24,  "carbs": 0,   "fat": 19,   "fiber": 0,   "sugar": 0,   "sodium": 65,  "default_g": 200},
    "sirloin":           {"calories": 245, "protein": 27,  "carbs": 0,   "fat": 14,   "fiber": 0,   "sugar": 0,   "sodium": 60,  "default_g": 200},
    "bbq ribs":          {"calories": 290, "protein": 20,  "carbs": 10,  "fat": 19,   "fiber": 0.5, "sugar": 7,   "sodium": 480, "default_g": 200},
    "pork ribs":         {"calories": 290, "protein": 20,  "carbs": 10,  "fat": 19,   "fiber": 0.5, "sugar": 7,   "sodium": 480, "default_g": 200},
    "chicken wings":     {"calories": 290, "protein": 17,  "carbs": 8,   "fat": 20,   "fiber": 0.5, "sugar": 2,   "sodium": 630, "default_g": 100},
    "buffalo wings":     {"calories": 290, "protein": 17,  "carbs": 8,   "fat": 20,   "fiber": 0.5, "sugar": 2,   "sodium": 630, "default_g": 100},
    "pancakes":          {"calories": 215, "protein": 6,   "carbs": 35,  "fat": 7,    "fiber": 1,   "sugar": 9,   "sodium": 380, "default_g": 130},
    "waffles":           {"calories": 245, "protein": 7,   "carbs": 36,  "fat": 9,    "fiber": 1,   "sugar": 10,  "sodium": 420, "default_g": 130},
    "french toast":      {"calories": 225, "protein": 8,   "carbs": 26,  "fat": 10,   "fiber": 1,   "sugar": 8,   "sodium": 350, "default_g": 100},
    "omelette":          {"calories": 185, "protein": 13,  "carbs": 3,   "fat": 14,   "fiber": 0.5, "sugar": 1.5, "sodium": 380, "default_g": 150},
    "omelet":            {"calories": 185, "protein": 13,  "carbs": 3,   "fat": 14,   "fiber": 0.5, "sugar": 1.5, "sodium": 380, "default_g": 150},
    "eggs benedict":     {"calories": 290, "protein": 15,  "carbs": 20,  "fat": 18,   "fiber": 1,   "sugar": 2,   "sodium": 680, "default_g": 200},
    "bacon":             {"calories": 540, "protein": 37,  "carbs": 1.4, "fat": 42,   "fiber": 0,   "sugar": 0,   "sodium": 1700,"default_g": 30},
    "hash brown":        {"calories": 230, "protein": 2.5, "carbs": 28,  "fat": 12,   "fiber": 2,   "sugar": 0.5, "sodium": 320, "default_g": 60},
    "hashbrown":         {"calories": 230, "protein": 2.5, "carbs": 28,  "fat": 12,   "fiber": 2,   "sugar": 0.5, "sodium": 320, "default_g": 60},
    "bagel":             {"calories": 270, "protein": 10,  "carbs": 52,  "fat": 1.5,  "fiber": 2,   "sugar": 5,   "sodium": 460, "default_g": 100},
    "croissant":         {"calories": 400, "protein": 8,   "carbs": 44,  "fat": 21,   "fiber": 2,   "sugar": 10,  "sodium": 400, "default_g": 80},
    "quiche":            {"calories": 280, "protein": 10,  "carbs": 16,  "fat": 19,   "fiber": 1,   "sugar": 3,   "sodium": 420, "default_g": 150},
    "lasagna":           {"calories": 220, "protein": 12,  "carbs": 22,  "fat": 10,   "fiber": 2,   "sugar": 4,   "sodium": 480, "default_g": 250},
    "lasagne":           {"calories": 220, "protein": 12,  "carbs": 22,  "fat": 10,   "fiber": 2,   "sugar": 4,   "sodium": 480, "default_g": 250},
    "risotto":           {"calories": 185, "protein": 5,   "carbs": 30,  "fat": 5.5,  "fiber": 1,   "sugar": 2,   "sodium": 450, "default_g": 300},
    "bruschetta":        {"calories": 180, "protein": 5,   "carbs": 28,  "fat": 5,    "fiber": 2,   "sugar": 4,   "sodium": 380, "default_g": 80},
    "tiramisu":          {"calories": 280, "protein": 5,   "carbs": 28,  "fat": 16,   "fiber": 0.5, "sugar": 20,  "sodium": 120, "default_g": 110},
    "fish and chips":    {"calories": 285, "protein": 14,  "carbs": 30,  "fat": 13,   "fiber": 2.5, "sugar": 1,   "sodium": 520, "default_g": 350},
    "fish chips":        {"calories": 285, "protein": 14,  "carbs": 30,  "fat": 13,   "fiber": 2.5, "sugar": 1,   "sodium": 520, "default_g": 350},
    "shepherd's pie":    {"calories": 190, "protein": 12,  "carbs": 18,  "fat": 8,    "fiber": 3,   "sugar": 3,   "sodium": 480, "default_g": 300},
    "shepherd pie":      {"calories": 190, "protein": 12,  "carbs": 18,  "fat": 8,    "fiber": 3,   "sugar": 3,   "sodium": 480, "default_g": 300},
    "paella":            {"calories": 200, "protein": 12,  "carbs": 26,  "fat": 5.5,  "fiber": 1,   "sugar": 2,   "sodium": 540, "default_g": 350},
    "schnitzel":         {"calories": 280, "protein": 22,  "carbs": 14,  "fat": 15,   "fiber": 0.5, "sugar": 0.5, "sodium": 480, "default_g": 150},
    "ratatouille":       {"calories": 75,  "protein": 2,   "carbs": 10,  "fat": 3,    "fiber": 3,   "sugar": 5,   "sodium": 320, "default_g": 250},
    "beef bourguignon":  {"calories": 245, "protein": 22,  "carbs": 10,  "fat": 13,   "fiber": 2,   "sugar": 3,   "sodium": 520, "default_g": 300},
    "caesar salad":      {"calories": 120, "protein": 8,   "carbs": 5,   "fat": 8,    "fiber": 1.5, "sugar": 2,   "sodium": 380, "default_g": 250},
    "greek salad":       {"calories": 95,  "protein": 3.5, "carbs": 7,   "fat": 6.5,  "fiber": 2,   "sugar": 4,   "sodium": 450, "default_g": 250},
    "grilled salmon":    {"calories": 208, "protein": 20,  "carbs": 0,   "fat": 13,   "fiber": 0,   "sugar": 0,   "sodium": 59,  "default_g": 150},
    "baked salmon":      {"calories": 208, "protein": 20,  "carbs": 0,   "fat": 13,   "fiber": 0,   "sugar": 0,   "sodium": 59,  "default_g": 150},
    "salmon fillet":     {"calories": 208, "protein": 20,  "carbs": 0,   "fat": 13,   "fiber": 0,   "sugar": 0,   "sodium": 59,  "default_g": 150},
    "brown rice":        {"calories": 112, "protein": 2.6, "carbs": 23,  "fat": 0.9,  "fiber": 1.8, "sugar": 0.3, "sodium": 5,   "default_g": 200},
    "quinoa":            {"calories": 120, "protein": 4.4, "carbs": 21,  "fat": 1.9,  "fiber": 2.8, "sugar": 0.9, "sodium": 5,   "default_g": 185},
    "sweet potato":      {"calories": 86,  "protein": 1.6, "carbs": 20,  "fat": 0.1,  "fiber": 3,   "sugar": 4.2, "sodium": 55,  "default_g": 130},
    "baked sweet potato": {"calories": 86, "protein": 1.6, "carbs": 20,  "fat": 0.1,  "fiber": 3,   "sugar": 4.2, "sodium": 55,  "default_g": 130},
    "steamed broccoli":  {"calories": 35,  "protein": 2.4, "carbs": 6,   "fat": 0.4,  "fiber": 2.4, "sugar": 1.7, "sodium": 30,  "default_g": 150},
    "broccoli":          {"calories": 35,  "protein": 2.4, "carbs": 6,   "fat": 0.4,  "fiber": 2.4, "sugar": 1.7, "sodium": 30,  "default_g": 150},
    "smoothie bowl":     {"calories": 195, "protein": 4.5, "carbs": 35,  "fat": 5,    "fiber": 5,   "sugar": 22,  "sodium": 60,  "default_g": 300},
    "acai bowl":         {"calories": 210, "protein": 4,   "carbs": 40,  "fat": 5,    "fiber": 6,   "sugar": 24,  "sodium": 55,  "default_g": 300},
    "granola":           {"calories": 400, "protein": 9,   "carbs": 65,  "fat": 13,   "fiber": 6,   "sugar": 22,  "sodium": 70,  "default_g": 60},
    "protein bar":       {"calories": 200, "protein": 20,  "carbs": 22,  "fat": 7,    "fiber": 3,   "sugar": 8,   "sodium": 140, "default_g": 60},

    # ─── Mexican ───
    "burrito":           {"calories": 295, "protein": 14,  "carbs": 36,  "fat": 11,   "fiber": 4,   "sugar": 3,   "sodium": 680, "default_g": 280},
    "quesadilla":        {"calories": 330, "protein": 14,  "carbs": 30,  "fat": 17,   "fiber": 2,   "sugar": 2,   "sodium": 620, "default_g": 150},
    "nachos":            {"calories": 345, "protein": 8,   "carbs": 40,  "fat": 17,   "fiber": 3,   "sugar": 2,   "sodium": 680, "default_g": 130},
    "guacamole":         {"calories": 155, "protein": 2,   "carbs": 8,   "fat": 14,   "fiber": 6,   "sugar": 0.5, "sodium": 300, "default_g": 80},
    "enchiladas":        {"calories": 250, "protein": 14,  "carbs": 22,  "fat": 12,   "fiber": 3,   "sugar": 4,   "sodium": 650, "default_g": 200},

    # ─── Middle Eastern / Mediterranean ───
    "falafel":           {"calories": 333, "protein": 13,  "carbs": 32,  "fat": 18,   "fiber": 5,   "sugar": 2,   "sodium": 580, "default_g": 100},
    "falafel wrap":      {"calories": 290, "protein": 11,  "carbs": 38,  "fat": 11,   "fiber": 5,   "sugar": 3,   "sodium": 620, "default_g": 200},
    "falafel pita":      {"calories": 290, "protein": 11,  "carbs": 38,  "fat": 11,   "fiber": 5,   "sugar": 3,   "sodium": 620, "default_g": 200},
    "doner kebab":       {"calories": 320, "protein": 18,  "carbs": 30,  "fat": 14,   "fiber": 2,   "sugar": 3,   "sodium": 680, "default_g": 250},
    "kebab wrap":        {"calories": 320, "protein": 18,  "carbs": 30,  "fat": 14,   "fiber": 2,   "sugar": 3,   "sodium": 680, "default_g": 250},
    "gyro":              {"calories": 320, "protein": 18,  "carbs": 30,  "fat": 14,   "fiber": 2,   "sugar": 3,   "sodium": 680, "default_g": 250},
    "tabbouleh":         {"calories": 75,  "protein": 2,   "carbs": 12,  "fat": 2.5,  "fiber": 2,   "sugar": 2,   "sodium": 260, "default_g": 150},
    "pita bread":        {"calories": 275, "protein": 9,   "carbs": 55,  "fat": 1.5,  "fiber": 2,   "sugar": 1,   "sodium": 520, "default_g": 60},
    "pita":              {"calories": 275, "protein": 9,   "carbs": 55,  "fat": 1.5,  "fiber": 2,   "sugar": 1,   "sodium": 520, "default_g": 60},
    "shakshuka":         {"calories": 135, "protein": 8,   "carbs": 10,  "fat": 7,    "fiber": 2.5, "sugar": 5,   "sodium": 480, "default_g": 250},
    "hummus":            {"calories": 166, "protein": 8,   "carbs": 14,  "fat": 10,   "fiber": 6,   "sugar": 0,   "sodium": 380, "default_g": 60},
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
