"""
OpenRouter prompt builder for food detection.

Returns the system prompt that instructs the vision model to detect
food items and return structured JSON.  The prompt is designed so
that the AI only *detects* — final nutrition calculation is done
deterministically by the backend engine.
"""


def build_food_detection_prompt() -> str:
    """Return the system prompt for image-based food detection."""
    return """You are a food/nutrition detection AI. Given a photo of food, identify every distinct food item visible.

Return ONLY valid JSON matching this schema (no markdown, no explanation, no extra keys):
{
  "meal_name": "short descriptive name of the meal",
  "cuisine": "detected cuisine or Unknown",
  "food_items": [
    {
      "food_name": "human-readable display name",
      "normalized_food_name": "lowercase lookup key (e.g. chicken biryani, idli, sambar)",
      "quantity": 1,
      "unit": "piece|bowl|plate|cup|tbsp|serving",
      "portion_size": "small|medium|large",
      "cooking_style": "steamed|fried|boiled|roasted|gravy|raw|baked|mixed|unknown",
      "oil_level": "low|medium|high|unknown",
      "confidence": 0.85
    }
  ],
  "overall_confidence": 0.85,
  "notes": ""
}

Rules:
- List EVERY visible food item separately (rice, dal, curry, chutney, etc.)
- Use common Indian food names when applicable (idli, dosa, sambar, chapati, dal, biryani, etc.)
- Estimate realistic quantities visible in the image.
- confidence is 0.0 to 1.0 — be conservative when uncertain.
- Do NOT decide final nutrition values; only detect and describe food items.
- If the image is not food, set overall_confidence to 0 and food_items to [].
- Return valid JSON only. No markdown fences, no explanation text."""
