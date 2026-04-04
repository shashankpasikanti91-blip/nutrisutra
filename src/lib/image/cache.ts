/**
 * Image Analysis Cache (localStorage)
 *
 * Stores only lightweight metadata + analysis results keyed by image hash.
 * NEVER stores raw image data, base64, or blob URLs.
 *
 * Default TTL: 24 hours. Expired entries are cleaned on read.
 */

import type { ImageCacheEntry, AnalysisResult, ImageDetectionPayload } from "@/types";

const CACHE_KEY = "nutrisutra_image_cache";
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ═══════════════════════════════════════
// Internal helpers
// ═══════════════════════════════════════

function loadCache(): Record<string, ImageCacheEntry> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted – start fresh */ }
  return {};
}

function saveCache(cache: Record<string, ImageCacheEntry>): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

// ═══════════════════════════════════════
// Public API
// ═══════════════════════════════════════

/** Look up a cached analysis result by image hash. Returns null if missing or expired. */
export function getCachedImageResult(hash: string): ImageCacheEntry | null {
  const cache = loadCache();
  const entry = cache[hash];
  if (!entry) return null;

  // Check TTL
  if (new Date(entry.expiresAt).getTime() < Date.now()) {
    delete cache[hash];
    saveCache(cache);
    return null;
  }

  return entry;
}

/** Store an analysis result keyed by image hash. Saves only metadata — no raw image data. */
export function setCachedImageResult(
  hash: string,
  file: { name: string; type: string; size: number },
  analysisResult: AnalysisResult,
  detectionPayload: ImageDetectionPayload | null,
  ttlMs: number = DEFAULT_TTL_MS
): void {
  const cache = loadCache();

  const entry: ImageCacheEntry = {
    hash,
    mimeType: file.type,
    fileSize: file.size,
    fileName: file.name,
    analysisResult,
    detectionPayload,
    source: "image",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + ttlMs).toISOString(),
  };

  cache[hash] = entry;
  saveCache(cache);
}

/** Remove all expired entries from the cache. Call periodically or on app init. */
export function clearExpiredImageCache(): number {
  const cache = loadCache();
  const now = Date.now();
  let removed = 0;

  for (const [hash, entry] of Object.entries(cache)) {
    if (new Date(entry.expiresAt).getTime() < now) {
      delete cache[hash];
      removed++;
    }
  }

  if (removed > 0) saveCache(cache);
  return removed;
}

/** Wipe the entire image cache. */
export function clearAllImageCache(): void {
  localStorage.removeItem(CACHE_KEY);
}
