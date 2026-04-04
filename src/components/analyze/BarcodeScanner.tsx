/**
 * BarcodeScanner — Scan product barcodes to fetch nutrition data
 * 
 * Uses html5-qrcode for scanning and Open Food Facts API for lookup.
 * Open Food Facts is a free, open-source food product database.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanBarcode, X, Loader2, AlertCircle, Package, Search } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { Input } from "@/components/ui/input";

const OPEN_FOOD_FACTS_API = "https://world.openfoodfacts.org/api/v2/product";

export interface BarcodeNutrition {
  barcode: string;
  productName: string;
  brand: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  imageUrl: string | null;
}

interface BarcodeScannerProps {
  onResult: (nutrition: BarcodeNutrition) => void;
  disabled?: boolean;
}

async function lookupBarcode(barcode: string): Promise<BarcodeNutrition | null> {
  try {
    const res = await fetch(`${OPEN_FOOD_FACTS_API}/${encodeURIComponent(barcode)}.json`);
    if (!res.ok) return null;
    const data = await res.json();

    if (data.status !== 1 || !data.product) return null;

    const p = data.product;
    const n = p.nutriments || {};

    return {
      barcode,
      productName: p.product_name || p.product_name_en || "Unknown product",
      brand: p.brands || "",
      servingSize: p.serving_size || "100g",
      calories: Math.round(n["energy-kcal_100g"] || n["energy-kcal"] || 0),
      protein: Math.round((n.proteins_100g || 0) * 10) / 10,
      carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
      fat: Math.round((n.fat_100g || 0) * 10) / 10,
      fiber: Math.round((n.fiber_100g || 0) * 10) / 10,
      sugar: Math.round((n.sugars_100g || 0) * 10) / 10,
      sodium: Math.round((n.sodium_100g || 0) * 1000), // convert g to mg
      imageUrl: p.image_front_small_url || p.image_url || null,
    };
  } catch {
    return null;
  }
}

export function BarcodeScanner({ onResult, disabled }: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BarcodeNutrition | null>(null);
  const [manualCode, setManualCode] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => {
    return () => { stopScanner(); };
  }, [stopScanner]);

  const handleBarcode = useCallback(async (barcode: string) => {
    await stopScanner();
    setLoading(true);
    setError(null);

    const data = await lookupBarcode(barcode.trim());
    if (data) {
      setResult(data);
      onResult(data);
    } else {
      setError(`Product not found for barcode: ${barcode}. Try manual entry.`);
    }
    setLoading(false);
  }, [stopScanner, onResult]);

  const startScanner = useCallback(async () => {
    setError(null);
    setResult(null);
    setScanning(true);

    try {
      const scanner = new Html5Qrcode("barcode-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 280, height: 120 },
          aspectRatio: 1.5,
        },
        (decodedText) => { handleBarcode(decodedText); },
        () => {} // ignore scan failures
      );
    } catch {
      setError("Camera access denied. Enter barcode manually below.");
      setScanning(false);
    }
  }, [handleBarcode]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) handleBarcode(manualCode.trim());
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setManualCode("");
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {result ? (
          /* ─── Product Result ─── */
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              {result.imageUrl ? (
                <img src={result.imageUrl} alt={result.productName} className="h-16 w-16 rounded-xl object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="h-7 w-7 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{result.productName}</p>
                {result.brand && <p className="text-xs text-muted-foreground">{result.brand}</p>}
                <p className="text-xs text-muted-foreground mt-0.5">Per 100g · Barcode: {result.barcode}</p>
              </div>
              <button onClick={handleReset} disabled={disabled} className="shrink-0 text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nutrition grid */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              <div className="rounded-xl bg-orange-50 dark:bg-orange-950/30 p-2 text-center">
                <p className="text-lg font-bold text-orange-600">{result.calories}</p>
                <p className="text-[10px] text-orange-600/70">kcal</p>
              </div>
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 p-2 text-center">
                <p className="text-lg font-bold text-blue-600">{result.protein}g</p>
                <p className="text-[10px] text-blue-600/70">Protein</p>
              </div>
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-2 text-center">
                <p className="text-lg font-bold text-amber-600">{result.carbs}g</p>
                <p className="text-[10px] text-amber-600/70">Carbs</p>
              </div>
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 p-2 text-center">
                <p className="text-lg font-bold text-red-600">{result.fat}g</p>
                <p className="text-[10px] text-red-600/70">Fat</p>
              </div>
            </div>
          </motion.div>
        ) : scanning ? (
          /* ─── Scanner View ─── */
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden rounded-2xl bg-black"
          >
            <div id="barcode-reader" className="w-full" style={{ minHeight: 280 }} />
            <button
              onClick={stopScanner}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        ) : (
          /* ─── Idle State ─── */
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-gradient-to-b from-amber-500/5 to-transparent p-6"
          >
            {loading ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
                <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
              </div>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
                <ScanBarcode className="h-7 w-7 text-amber-600" />
              </div>
            )}

            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {loading ? "Looking up product…" : "Scan a barcode"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Packaged food, drinks, snacks — 3M+ products
              </p>
            </div>

            <button
              onClick={startScanner}
              disabled={disabled || loading}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all active:scale-95 hover:bg-amber-600 disabled:opacity-50"
            >
              <ScanBarcode className="h-4 w-4" />
              Open Scanner
            </button>

            {/* Manual barcode entry */}
            <form onSubmit={handleManualSubmit} className="flex w-full max-w-xs gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter barcode number"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="h-9 pl-8 text-xs rounded-xl"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={!manualCode.trim() || loading}
                className="shrink-0 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80 disabled:opacity-50"
              >
                Look up
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
            <p className="text-xs text-destructive">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
