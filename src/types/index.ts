/**
 * NutriSutra Core Types
 * Used across parser, calculation engine, and UI
 */

// ═══════════════════════════════════════
// PARSER OUTPUT TYPES
// ═══════════════════════════════════════

export type Modifier =
  | "no_sugar"
  | "less_sugar"
  | "extra_sugar"
  | "low_oil"
  | "oily"
  | "ghee"
  | "homemade"
  | "restaurant"
  | "boiled"
  | "fried"
  | "steamed"
  | "roasted"
  | "baked"
  | "soaked"
  | "raw"
  | "half_plate"
  | "full_plate";

export interface ParsedFoodItem {
  /** Raw text segment before normalization */
  raw: string;
  /** Cleaned base food name for lookup */
  name: string;
  /** Parsed quantity (default 1) */
  quantity: number;
  /** Parsed unit if any */
  unit: string | null;
  /** Modifiers like no_sugar, oily, homemade, etc. */
  modifiers: Modifier[];
}

export interface ParsedInput {
  /** Original raw user input */
  original: string;
  /** Individual parsed food components */
  items: ParsedFoodItem[];
}

// ═══════════════════════════════════════
// ANALYSIS RESULT TYPES
// ═══════════════════════════════════════

export interface ComponentResult {
  /** Parsed food item that generated this */
  parsed: ParsedFoodItem;
  /** Whether this was found in database */
  matched: boolean;
  /** Database food code if matched */
  foodCode: string | null;
  /** Display label (normalized) */
  label: string;
  /** Quantity string for display */
  quantityLabel: string;
  /** Grams used for calculation */
  grams: number;
  /** Calculated nutrition */
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  /** Whether values are estimated (not from DB) */
  estimated: boolean;
}

export interface AnalysisResult {
  /** Original input */
  input: string;
  /** Normalized display label */
  normalizedLabel: string;
  /** Individual component results */
  components: ComponentResult[];
  /** Totals */
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  /** How many components were matched vs estimated */
  matchedCount: number;
  estimatedCount: number;
  /** Overall confidence */
  confidence: "high" | "medium" | "low";
  /** Any notes/warnings */
  notes: string[];
}

// ═══════════════════════════════════════
// USER GOAL
// ═══════════════════════════════════════

export type UserGoal = "lose" | "gain" | "maintain";

// ═══════════════════════════════════════
// HEALTH CONDITIONS
// ═══════════════════════════════════════

export type HealthCondition = "diabetes" | "high_bp" | "low_bp";

export interface HealthProfile {
  conditions: HealthCondition[];
}

// ═══════════════════════════════════════
// DECISION ENGINE
// ═══════════════════════════════════════

export type Verdict = "good" | "moderate" | "avoid";

export interface MealDecision {
  verdict: Verdict;
  headline: string;
  reasons: string[];
  suggestions: string[];
  cuisine: string | null;
  mealName: string;
  /** Health condition-specific alerts */
  healthAlerts: HealthAlert[];
  /** Night meal warning if applicable */
  nightMealWarning: string | null;
}

export interface HealthAlert {
  condition: HealthCondition;
  severity: "info" | "warning" | "danger";
  message: string;
  suggestion: string;
}

// ═══════════════════════════════════════
// ANALYZE SOURCE
// ═══════════════════════════════════════

export type AnalyzeSource = "text" | "image";

// ═══════════════════════════════════════
// IMAGE ANALYSIS TYPES
// ═══════════════════════════════════════

export type ImageAnalysisStatus =
  | "idle"
  | "hashing"
  | "cache_hit"
  | "uploading"
  | "analyzing"
  | "done"
  | "error"
  | "not_configured";

/** Structured food detection from AI (before deterministic calculation) */
export interface DetectedFoodItem {
  food_name: string;
  normalized_food_name: string;
  quantity: number;
  unit: string;
  portion_size: "small" | "medium" | "large";
  cooking_style: string;
  oil_level: "low" | "medium" | "high" | "unknown";
  confidence: number;
}

/** AI detection payload returned from backend */
export interface ImageDetectionPayload {
  meal_name: string;
  cuisine: string;
  food_items: DetectedFoodItem[];
  overall_confidence: number;
  notes: string;
}

/** Full response from POST /api/analyze-image */
export interface ImageAnalysisResponse {
  success: boolean;
  /** Present when success=true */
  source?: "image";
  image_hash?: string;
  parsed_input?: ImageDetectionPayload;
  analysis_result?: {
    total_calories: number;
    protein: number;
    carbs: number;
    fats: number;
    components: ComponentResult[];
  };
  notes?: string[];
  confidence?: "high" | "medium" | "low";
  cached?: boolean;
  /** Present when success=false */
  code?: string;
  message?: string;
}

/** Lightweight metadata stored in local cache — no raw image data */
export interface ImageCacheEntry {
  hash: string;
  mimeType: string;
  fileSize: number;
  fileName: string;
  /** The AnalysisResult generated from detection */
  analysisResult: AnalysisResult;
  /** Original detection payload from AI */
  detectionPayload: ImageDetectionPayload | null;
  /** Source tag */
  source: "image";
  /** ISO timestamp */
  createdAt: string;
  /** TTL expiry ISO timestamp */
  expiresAt: string;
}
