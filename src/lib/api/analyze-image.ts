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
  import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-4o-mini";
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

/**
 * Resize + compress image to max 1024px wide/tall at JPEG 0.82 quality.
 * Mobile photos are often 5–10 MB; base64 encoding them exceeds API request
 * size limits and causes 400 errors. This keeps the payload well under 400 KB.
 */
function resizeImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width >= height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file); // fallback: send original
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          resolve(new File([blob], "meal.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // fallback: send original
    };

    img.src = url;
  });
}

const SYSTEM_PROMPT = `You are an advanced food/nutrition detection AI specializing in Indian and global cuisine. Given a photo of food, identify every distinct food item visible with precision.

Return ONLY valid JSON matching this schema (no markdown, no explanation):
{
  "meal_name": "short descriptive name of the overall meal",
  "cuisine": "detected cuisine (e.g. South Indian, North Indian, Chinese, Western, etc.)",
  "food_items": [
    {
      "food_name": "precise display name (e.g. Masala Dosa, Butter Chicken, French Fries)",
      "normalized_food_name": "lowercase lookup key matching common names (e.g. masala dosa, butter chicken, fries, banana)",
      "quantity": 1,
      "unit": "plate|piece|cup|bowl|glass|serving",
      "portion_size": "small|medium|large",
      "cooking_style": "fried|deep-fried|boiled|steamed|grilled|baked|raw|mixed|unknown",
      "oil_level": "low|medium|high|unknown",
      "confidence": 0.85
    }
  ],
  "overall_confidence": 0.85,
  "notes": "any relevant observation about the meal"
}

Rules:
- List EVERY visible food item separately (rice, dal, curry, roti, chutney, pickle, etc.)
- Use common Indian food names when applicable (idli, dosa, sambar, chapati, dal, biryani, vada, etc.)
- For oily/fried food visible with excess oil, set oil_level to "high" and cooking_style to "fried"
- For clearly greasy, deep-fried items (pakora, vada, samosa, fries), set cooking_style to "deep-fried" and oil_level to "high"
- For steamed/boiled items (idli, boiled rice, etc.), set cooking_style accordingly with oil_level "low"
- Estimate realistic quantities visible in the image
- confidence is 0.0 to 1.0
- If image is not food, set overall_confidence to 0 and food_items to []
- Preserve the exact food name as visible — do not generalize "chicken curry" as just "curry"`;


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
    // Step 1: Compress/resize image to avoid API request-too-large (400) errors
    const compressed = await resizeImage(file);

    // Step 2: Convert image to base64 data-URL
    const base64 = await fileToBase64(compressed);

    // Step 3: Call OpenRouter
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
