/**
 * Image Hash Utility
 *
 * Generates a deterministic SHA-256 fingerprint for an uploaded file
 * using the browser's built-in Web Crypto API.
 *
 * Used for cache lookup — same image always produces the same hash.
 * No raw image data is stored; only the hash string is persisted.
 */

/**
 * Generate a hex-encoded SHA-256 hash from a File object.
 * Reads the file's ArrayBuffer and passes it through SubtleCrypto.
 */
export async function generateImageHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Validate that a file is an accepted image type */
export function isValidImageType(file: File): boolean {
  // Accept any image/* MIME type (covers jpeg, png, webp, heic, heif, bmp, gif, tiff, avif, etc.)
  if (file.type && file.type.startsWith("image/")) return true;

  // Fallback: check extension when MIME type is missing (common on some mobile browsers)
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "heic", "heif", "bmp", "gif", "tiff", "tif", "avif", "svg"];
  return IMAGE_EXTENSIONS.includes(ext);
}

/** Max file size: 10 MB */
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export function isValidImageSize(file: File): boolean {
  return file.size <= MAX_IMAGE_SIZE;
}
