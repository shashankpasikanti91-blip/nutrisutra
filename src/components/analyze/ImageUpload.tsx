/**
 * ImageUpload Component
 *
 * Drag-and-drop + click-to-upload for meal photos.
 * Shows a temporary client-side preview using object URLs.
 * Object URLs are revoked on unmount / file change to avoid leaks.
 *
 * No raw image data is stored permanently.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, FileImage, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isValidImageType, isValidImageSize, MAX_IMAGE_SIZE } from "@/lib/image/hash";

const ACCEPTED_TYPES = "image/*";
const MAX_SIZE_LABEL = `${Math.round(MAX_IMAGE_SIZE / 1024 / 1024)} MB`;

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ onFileSelect, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URL on cleanup or file change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = useCallback(
    (file: File | null) => {
      setError(null);

      // Clear previous preview
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }

      if (!file) {
        setFileName(null);
        setFileSize(0);
        onFileSelect(null);
        return;
      }

      if (!isValidImageType(file)) {
        setError("Please upload a JPG, PNG, or WebP image.");
        return;
      }

      if (!isValidImageSize(file)) {
        setError(`Image must be smaller than ${MAX_SIZE_LABEL}.`);
        return;
      }

      // Create temporary preview — object URL, not base64
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setFileName(file.name);
      setFileSize(file.size);
      onFileSelect(file);
    },
    [onFileSelect, preview]
  );

  const handleReset = () => {
    handleFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
  };

  // Drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {preview ? (
          /* ── Preview State ── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card-lg"
          >
            <div className="relative">
              <img
                src={preview}
                alt="Meal preview"
                className="h-56 w-full object-cover sm:h-64"
              />
              {/* Scanner corners */}
              <div className="pointer-events-none absolute inset-3">
                <div className="absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 border-white/80 rounded-tl-sm" />
                <div className="absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 border-white/80 rounded-tr-sm" />
                <div className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-white/80 rounded-bl-sm" />
                <div className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-white/80 rounded-br-sm" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileImage className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">
                    {fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(fileSize)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={disabled}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          /* ── Drop Zone ── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-200 ${
              isDragging
                ? "border-primary bg-primary/5 shadow-card-lg"
                : "border-border bg-card hover:border-primary/40 hover:shadow-card"
            } ${disabled ? "pointer-events-none opacity-50" : ""}`}
          >
            <div className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
              isDragging ? "bg-primary/15" : "bg-primary/10"
            }`}>
              {isDragging ? (
                <Upload className="h-7 w-7 text-primary" />
              ) : (
                <Camera className="h-7 w-7 text-primary" />
              )}
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">
              {isDragging ? "Drop your photo here" : "Snap your meal"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap to open camera · JPG, PNG, WebP
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload meal photo"
      />
    </div>
  );
}
