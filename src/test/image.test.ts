import { describe, it, expect, beforeEach } from "vitest";
import { isValidImageType, isValidImageSize, MAX_IMAGE_SIZE } from "@/lib/image/hash";
import {
  getCachedImageResult,
  setCachedImageResult,
  clearExpiredImageCache,
  clearAllImageCache,
} from "@/lib/image/cache";
import type { AnalysisResult } from "@/types";

// ═══════════════════════════════════════
// Image Hash Utilities
// ═══════════════════════════════════════

describe("isValidImageType", () => {
  it("accepts jpeg", () => {
    const file = new File(["x"], "test.jpg", { type: "image/jpeg" });
    expect(isValidImageType(file)).toBe(true);
  });

  it("accepts png", () => {
    const file = new File(["x"], "test.png", { type: "image/png" });
    expect(isValidImageType(file)).toBe(true);
  });

  it("accepts webp", () => {
    const file = new File(["x"], "test.webp", { type: "image/webp" });
    expect(isValidImageType(file)).toBe(true);
  });

  it("accepts gif", () => {
    const file = new File(["x"], "test.gif", { type: "image/gif" });
    expect(isValidImageType(file)).toBe(true);
  });

  it("rejects pdf", () => {
    const file = new File(["x"], "test.pdf", { type: "application/pdf" });
    expect(isValidImageType(file)).toBe(false);
  });
});

describe("isValidImageSize", () => {
  it("accepts a small file", () => {
    const file = new File(["x"], "small.jpg", { type: "image/jpeg" });
    expect(isValidImageSize(file)).toBe(true);
  });

  it("rejects a file larger than 10 MB", () => {
    const bigBuffer = new Uint8Array(MAX_IMAGE_SIZE + 1);
    const file = new File([bigBuffer], "huge.jpg", { type: "image/jpeg" });
    expect(isValidImageSize(file)).toBe(false);
  });
});

// ═══════════════════════════════════════
// Image Cache
// ═══════════════════════════════════════

const makeFakeResult = (): AnalysisResult => ({
  input: "test food",
  normalizedLabel: "Test Food",
  components: [],
  totals: { calories: 200, protein: 10, carbs: 25, fat: 8, fiber: 3, sugar: 5, sodium: 100 },
  matchedCount: 1,
  estimatedCount: 0,
  confidence: "high",
  notes: [],
});

describe("Image Cache", () => {
  beforeEach(() => {
    clearAllImageCache();
  });

  it("returns null for unknown hash", () => {
    expect(getCachedImageResult("nonexistent")).toBeNull();
  });

  it("stores and retrieves a cache entry", () => {
    const hash = "abc123";
    const analysis = makeFakeResult();
    const fileMeta = { name: "food.jpg", type: "image/jpeg", size: 5000 };

    setCachedImageResult(hash, fileMeta, analysis, null);

    const cached = getCachedImageResult(hash);
    expect(cached).not.toBeNull();
    expect(cached!.hash).toBe(hash);
    expect(cached!.analysisResult.totals.calories).toBe(200);
    expect(cached!.fileName).toBe("food.jpg");
  });

  it("expires entries after TTL", () => {
    const hash = "expiring";
    const analysis = makeFakeResult();
    const fileMeta = { name: "food.jpg", type: "image/jpeg", size: 5000 };

    // Set with a TTL of -1ms (forces past expiry)
    setCachedImageResult(hash, fileMeta, analysis, null, -1);

    // Should return null because it's expired
    const cached = getCachedImageResult(hash);
    expect(cached).toBeNull();
  });

  it("clearExpiredImageCache removes only expired entries", () => {
    const analysis = makeFakeResult();
    const fileMeta = { name: "food.jpg", type: "image/jpeg", size: 5000 };

    // One valid, one already expired (negative TTL forces past expiry)
    setCachedImageResult("valid", fileMeta, analysis, null, 60000);
    setCachedImageResult("expired", fileMeta, analysis, null, -1);

    const removed = clearExpiredImageCache();
    expect(removed).toBe(1);

    expect(getCachedImageResult("valid")).not.toBeNull();
    expect(getCachedImageResult("expired")).toBeNull();
  });

  it("clearAllImageCache wipes everything", () => {
    const analysis = makeFakeResult();
    const fileMeta = { name: "food.jpg", type: "image/jpeg", size: 5000 };

    setCachedImageResult("a", fileMeta, analysis, null);
    setCachedImageResult("b", fileMeta, analysis, null);

    clearAllImageCache();

    expect(getCachedImageResult("a")).toBeNull();
    expect(getCachedImageResult("b")).toBeNull();
  });
});
