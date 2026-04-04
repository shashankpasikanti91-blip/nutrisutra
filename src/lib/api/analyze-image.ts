/**
 * Image Analysis API Client — OpenRouter Direct
 *
 * Calls OpenRouter's vision model directly to detect food items from a photo.
 * Uses the OpenAI-compatible chat completions API with base64 image input.
 *
 * ⚠️  DEMO ONLY: The API key is embedded in the frontend bundle via Vite env vars.
 *     Never ship this pattern to production — use a backend proxy instead.
 */

import type { ImageAnalysisResponse, ImageDetectionPayload } from "@/types";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL =
  import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-4.1-mini";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface AnalyzeImageParams {
  file: File;
  imageHash: string;
  sessionId?: string;
}

export interface AnalyzeImageResult {
  response: ImageAnalysisResponse | null;
  error: string | null;
  notConfigured: boolean;
}

/** Convert a File to a base64 data-URL string */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const SYSTEM_PROMPT = `You are a food/nutrition detection AI. Given a photo of food, identify every distinct food item visible.

Return ONLY valid JSON matching this schema (no markdown, no explanation):
{
  "meal_name": "short descriptive name",
  "cuisine": "detected cuisine or Unknown",
  "food_items": [
    {
      "food_name": "display name",
      "normalized_food_name": "lowercase lookup key (e.g. chicken biryani, idli, sambar)",
      "quantity": 1,
      "unit": "plate|piece|cup|bowl|glass|serving",
      "portion_size": "small|medium|large",
      "cooking_style": "fried|boiled|steamed|grilled|baked|raw|mixed|unknown",
      "oil_level": "low|medium|high|unknown",
      "confidence": 0.85
    }
  ],
  "overall_confidence": 0.85,
  "notes": ""
}

Rules:
- List EVERY visible food item separately (rice, dal, curry, roti, chutney, etc.)
- Use common Indian food names when applicable (idli, dosa, sambar, chapati, dal, biryani, etc.)
- Estimate realistic quantities visible in the image
- confidence is 0.0 to 1.0
- If the image is not food, set overall_confidence to 0 and food_items to []`;

/**
 * Send image to OpenRouter vision model for food detection.
 * Never throws — all failures are captured in the return value.
 */
export async function analyzeImageApi(
  params: AnalyzeImageParams
): Promise<AnalyzeImageResult> {
  const { file, imageHash } = params;

  // Guard: no API key configured
  if (!OPENROUTER_API_KEY) {
    return {
      response: null,
      error: null,
      notConfigured: true,
    };
  }

  try {
    // Step 1: Convert image to base64 data-URL
    const base64 = await fileToBase64(file);

    // Step 2: Call OpenRouter
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "NutriSutra Demo",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: base64 },
              },
              {
                type: "text",
                text: "Identify all food items in this image. Return JSON only.",
              },
            ],
          },
        ],
        max_tokens: 1024,
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error("[analyzeImageApi] OpenRouter error:", res.status, errBody);

      if (res.status === 401 || res.status === 403) {
        return {
          response: null,
          error: "API key is invalid or expired. Check your .env file.",
          notConfigured: false,
        };
      }
      if (res.status === 429) {
        return {
          response: null,
          error: "Rate limit reached. Please wait a moment and try again.",
          notConfigured: false,
        };
      }
      return {
        response: null,
        error: `AI service returned ${res.status}. Please try again.`,
        notConfigured: false,
      };
    }

    const data = await res.json();
    const rawContent: string =
      data?.choices?.[0]?.message?.content?.trim() ?? "";

    if (!rawContent) {
      return {
        response: null,
        error: "AI returned an empty response. Please try a clearer photo.",
        notConfigured: false,
      };
    }

    // Step 3: Parse the JSON from the model response
    // Strip markdown code fences if the model wraps in ```json ... ```
    const jsonStr = rawContent
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed: ImageDetectionPayload;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("[analyzeImageApi] Failed to parse JSON:", rawContent);
      return {
        response: null,
        error: "AI response was not valid JSON. Please try again.",
        notConfigured: false,
      };
    }

    // Step 4: Basic validation
    if (
      !parsed.food_items ||
      !Array.isArray(parsed.food_items) ||
      parsed.food_items.length === 0
    ) {
      return {
        response: {
          success: false,
          message: "No food items detected in this image. Try a clearer photo.",
        },
        error: "No food items detected. Try a different or clearer photo.",
        notConfigured: false,
      };
    }

    // Step 5: Return structured response
    const response: ImageAnalysisResponse = {
      success: true,
      source: "image",
      image_hash: imageHash,
      parsed_input: parsed,
    };

    return {
      response,
      error: null,
      notConfigured: false,
    };
  } catch (err) {
    console.error("[analyzeImageApi] Unexpected error:", err);
    return {
      response: null,
      error:
        "Could not connect to the AI service. Check your internet connection.",
      notConfigured: false,
    };
  }
}
