/**
 * CameraCapture — Live camera viewfinder with capture + gallery upload.
 *
 * Uses getUserMedia for a real-time camera preview on mobile.
 * Falls back to file upload if camera access is denied or unavailable.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImagePlus, X, SwitchCamera, Loader2 } from "lucide-react";
import { isValidImageType, isValidImageSize, MAX_IMAGE_SIZE } from "@/lib/image/hash";

const MAX_SIZE_LABEL = `${Math.round(MAX_IMAGE_SIZE / 1024 / 1024)} MB`;

interface CameraCaptureProps {
  onCapture: (file: File | null) => void;
  disabled?: boolean;
}

export function CameraCapture({ onCapture, disabled }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [starting, setStarting] = useState(false);

  // On mobile over HTTP, getUserMedia is blocked. Use native camera input instead.
  const isSecureContext = typeof window !== "undefined" && window.isSecureContext;
  const canUseGetUserMedia = isSecureContext && !!navigator.mediaDevices?.getUserMedia;

  // Stop stream helper
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
      if (preview) URL.revokeObjectURL(preview);
    };
  }, []);

  // Start camera
  const startCamera = useCallback(async (facing: "environment" | "user" = facingMode) => {
    // On insecure context (HTTP on mobile), open native camera via file input
    if (!canUseGetUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    try {
      setStarting(true);
      setCameraError(null);
      stopStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setFacingMode(facing);
    } catch {
      setCameraError("Camera access denied. Use the gallery instead.");
      setCameraActive(false);
    } finally {
      setStarting(false);
    }
  }, [facingMode, stopStream]);

  // Switch front/back
  const switchCamera = useCallback(() => {
    const next = facingMode === "environment" ? "user" : "environment";
    startCamera(next);
  }, [facingMode, startCamera]);

  // Capture photo from video stream
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `meal-${Date.now()}.jpg`, { type: "image/jpeg" });
        const url = URL.createObjectURL(file);

        // Clean previous preview
        if (preview) URL.revokeObjectURL(preview);

        setPreview(url);
        stopStream();
        setCameraActive(false);
        onCapture(file);
      },
      "image/jpeg",
      0.92
    );
  }, [preview, stopStream, onCapture]);

  // Handle gallery file 
  const handleGalleryFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (!file) return;

      if (!isValidImageType(file)) {
        setCameraError("Please use a JPG, PNG, or WebP image.");
        return;
      }
      if (!isValidImageSize(file)) {
        setCameraError(`Image must be under ${MAX_SIZE_LABEL}.`);
        return;
      }

      if (preview) URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(file);
      setPreview(url);
      stopStream();
      setCameraActive(false);
      setCameraError(null);
      onCapture(file);
    },
    [preview, stopStream, onCapture]
  );

  // Reset / retake
  const handleRetake = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onCapture(null);
    setCameraError(null);
  }, [preview, onCapture]);

  // ── Render ──
  return (
    <div className="relative w-full">
      <canvas ref={canvasRef} className="hidden" />

      <AnimatePresence mode="wait">
        {preview ? (
          /* ─── Preview ─── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-3xl"
          >
            <img
              src={preview}
              alt="Captured meal"
              className="w-full aspect-[4/3] object-cover rounded-3xl"
            />
            {/* Scanner corners overlay */}
            <div className="pointer-events-none absolute inset-4">
              <div className="absolute top-0 left-0 h-8 w-8 border-t-[3px] border-l-[3px] border-white/90 rounded-tl-lg" />
              <div className="absolute top-0 right-0 h-8 w-8 border-t-[3px] border-r-[3px] border-white/90 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b-[3px] border-l-[3px] border-white/90 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 h-8 w-8 border-b-[3px] border-r-[3px] border-white/90 rounded-br-lg" />
            </div>
            {/* Retake button */}
            <button
              onClick={handleRetake}
              disabled={disabled}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        ) : cameraActive ? (
          /* ─── Live viewfinder ─── */
          <motion.div
            key="viewfinder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden rounded-3xl bg-black"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-[4/3] object-cover rounded-3xl mirror"
              style={facingMode === "user" ? { transform: "scaleX(-1)" } : undefined}
            />

            {/* Scanner overlay */}
            <div className="pointer-events-none absolute inset-4">
              <div className="absolute top-0 left-0 h-8 w-8 border-t-[3px] border-l-[3px] border-white/70 rounded-tl-lg" />
              <div className="absolute top-0 right-0 h-8 w-8 border-t-[3px] border-r-[3px] border-white/70 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b-[3px] border-l-[3px] border-white/70 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 h-8 w-8 border-b-[3px] border-r-[3px] border-white/70 rounded-br-lg" />
            </div>

            {/* Hint text */}
            <div className="absolute top-4 inset-x-0 text-center">
              <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                Point at your meal
              </span>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-6">
              {/* Gallery */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                <ImagePlus className="h-5 w-5" />
              </button>

              {/* Shutter */}
              <button
                onClick={capturePhoto}
                disabled={disabled}
                className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[4px] border-white/90 bg-white/20 backdrop-blur-sm transition-all active:scale-90 hover:bg-white/30"
              >
                <div className="h-14 w-14 rounded-full bg-white" />
              </button>

              {/* Switch camera */}
              <button
                onClick={switchCamera}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                <SwitchCamera className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* ─── Initial state — open camera or gallery ─── */
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-border bg-gradient-to-b from-primary/5 to-transparent p-8"
          >
            {starting ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Camera className="h-8 w-8 text-primary" />
              </div>
            )}

            <div className="text-center">
              <p className="text-base font-semibold text-foreground">
                {starting ? "Opening camera…" : "Snap your meal"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Take a photo or pick from gallery
              </p>
            </div>

            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => startCamera()}
                disabled={disabled || starting}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-95 hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
                Camera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all active:scale-95 hover:bg-muted"
              >
                <ImagePlus className="h-4 w-4" />
                Gallery
              </button>
            </div>

            {cameraError && (
              <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                {cameraError}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input for gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleGalleryFile}
        className="hidden"
        aria-label="Upload meal photo"
      />
      {/* Hidden file input for native camera capture (used on insecure contexts) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleGalleryFile}
        className="hidden"
        aria-label="Take meal photo"
      />
    </div>
  );
}
