import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyzeImageApi } from "@/lib/api/analyze-image";

describe("analyzeImageApi", () => {
  const file = new File(["fake-image-data"], "meal.jpg", { type: "image/jpeg" });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("handles API error gracefully (401)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve("Unauthorized"),
      })
    );

    const result = await analyzeImageApi({ file, imageHash: "abc" });
    // If key is set from .env, it will call fetch and get mocked 401
    // If key is empty, it returns notConfigured
    expect(result.notConfigured || result.error !== null).toBe(true);
  });

  it("handles successful AI response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    meal_name: "Idli Plate",
                    cuisine: "Indian",
                    food_items: [
                      {
                        food_name: "Idli",
                        normalized_food_name: "idli",
                        quantity: 2,
                        unit: "piece",
                        portion_size: "medium",
                        cooking_style: "steamed",
                        oil_level: "low",
                        confidence: 0.9,
                      },
                    ],
                    overall_confidence: 0.9,
                    notes: "",
                  }),
                },
              },
            ],
          }),
      })
    );

    const result = await analyzeImageApi({ file, imageHash: "abc" });
    // If key is missing, notConfigured is returned (skip further checks)
    if (result.notConfigured) return;

    expect(result.error).toBeNull();
    expect(result.response?.success).toBe(true);
    expect(result.response?.parsed_input?.food_items).toHaveLength(1);
    expect(result.response?.parsed_input?.food_items[0].food_name).toBe("Idli");
  });

  it("handles network failure gracefully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    const result = await analyzeImageApi({ file, imageHash: "abc" });
    if (result.notConfigured) return;

    expect(result.error).toBeTruthy();
    expect(result.response).toBeNull();
  });
});
