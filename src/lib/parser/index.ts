/**
 * NutriSutra Natural Language Food Parser
 *
 * Parses raw user input like:
 *   "2 idli with sambar and chutney"
 *   "white coffee with no sugar"
 *   "coffee with 8 soaked almonds and 10 sunflower seeds"
 *   "chicken biryani half plate"
 *   "burger plus fries and coke"
 *
 * Returns structured ParsedInput with individual items,
 * quantities, units, and modifiers.
 */

import type { ParsedInput, ParsedFoodItem, Modifier } from "@/types";

// ═══════════════════════════════════════
// SPLITTER — break compound inputs
// ═══════════════════════════════════════

const SPLIT_PATTERN = /\s+(?:with|and|plus|\+)\s+|,\s*/i;

function splitCompoundInput(input: string): string[] {
  const segments = input.split(SPLIT_PATTERN).map(s => s.trim()).filter(Boolean);
  return segments.length > 0 ? segments : [input.trim()];
}

// ═══════════════════════════════════════
// MODIFIER DETECTION
// ═══════════════════════════════════════

interface ModifierRule {
  pattern: RegExp;
  modifier: Modifier;
}

const MODIFIER_RULES: ModifierRule[] = [
  { pattern: /\bno\s+sugar\b/i, modifier: "no_sugar" },
  { pattern: /\bsugar\s*free\b/i, modifier: "no_sugar" },
  { pattern: /\bwithout\s+sugar\b/i, modifier: "no_sugar" },
  { pattern: /\bless\s+sugar\b/i, modifier: "less_sugar" },
  { pattern: /\bhalf\s+sugar\b/i, modifier: "less_sugar" },
  { pattern: /\bextra\s+sugar\b/i, modifier: "extra_sugar" },
  { pattern: /\blow\s+oil\b/i, modifier: "low_oil" },
  { pattern: /\bless\s+oil\b/i, modifier: "low_oil" },
  { pattern: /\boily\b/i, modifier: "oily" },
  { pattern: /\bextra\s+oil\b/i, modifier: "oily" },
  { pattern: /\bghee\b/i, modifier: "ghee" },
  { pattern: /\bwith\s+ghee\b/i, modifier: "ghee" },
  { pattern: /\bhomemade\b/i, modifier: "homemade" },
  { pattern: /\bhome\s*made\b/i, modifier: "homemade" },
  { pattern: /\bhome\s+style\b/i, modifier: "homemade" },
  { pattern: /\brestaurant\b/i, modifier: "restaurant" },
  { pattern: /\bhotel\b/i, modifier: "restaurant" },
  { pattern: /\bout\s*side\b/i, modifier: "restaurant" },
  { pattern: /\bboiled\b/i, modifier: "boiled" },
  { pattern: /\bfried\b/i, modifier: "fried" },
  { pattern: /\bdeep\s*fried\b/i, modifier: "fried" },
  { pattern: /\bsteamed\b/i, modifier: "steamed" },
  { pattern: /\broasted\b/i, modifier: "roasted" },
  { pattern: /\bbaked\b/i, modifier: "baked" },
  { pattern: /\bsoaked\b/i, modifier: "soaked" },
  { pattern: /\braw\b/i, modifier: "raw" },
  { pattern: /\bhalf\s+plate\b/i, modifier: "half_plate" },
  { pattern: /\bfull\s+plate\b/i, modifier: "full_plate" },
];

function extractModifiers(text: string): { modifiers: Modifier[]; cleaned: string } {
  const modifiers: Modifier[] = [];
  let cleaned = text;

  for (const rule of MODIFIER_RULES) {
    if (rule.pattern.test(cleaned)) {
      modifiers.push(rule.modifier);
      cleaned = cleaned.replace(rule.pattern, " ").trim();
    }
  }

  return { modifiers: [...new Set(modifiers)], cleaned };
}

// ═══════════════════════════════════════
// QUANTITY & UNIT PARSING
// ═══════════════════════════════════════

const UNIT_ALIASES: Record<string, string> = {
  piece: "piece",
  pieces: "piece",
  pc: "piece",
  pcs: "piece",
  nos: "piece",
  bowl: "bowl",
  bowls: "bowl",
  plate: "plate",
  plates: "plate",
  cup: "cup",
  cups: "cup",
  glass: "glass",
  glasses: "glass",
  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  slice: "slice",
  slices: "slice",
  serving: "serving",
  servings: "serving",
  scoop: "scoop",
  scoops: "scoop",
  can: "can",
  cans: "can",
};

// Matches: "2 idli", "3 pieces", "10 almonds", "1 bowl"
const QUANTITY_UNIT_PATTERN = /^(\d+(?:\.\d+)?)\s*(?:(piece|pieces|pc|pcs|nos|bowl|bowls|plate|plates|cup|cups|glass|glasses|tbsp|tablespoons?|tsp|teaspoons?|slice|slices?|serving|servings?|scoop|scoops?|can|cans?)\s+(?:of\s+)?)?/i;

// Just a leading number
const LEADING_NUMBER = /^(\d+(?:\.\d+)?)\s+/;

function extractQuantityAndUnit(text: string): {
  quantity: number;
  unit: string | null;
  cleaned: string;
} {
  let quantity = 1;
  let unit: string | null = null;
  let cleaned = text;

  // Try quantity + unit pattern first
  const quMatch = cleaned.match(QUANTITY_UNIT_PATTERN);
  if (quMatch && quMatch[1]) {
    quantity = parseFloat(quMatch[1]);
    if (quMatch[2]) {
      unit = UNIT_ALIASES[quMatch[2].toLowerCase()] || quMatch[2].toLowerCase();
    }
    cleaned = cleaned.slice(quMatch[0].length).trim();
  } else {
    // Just leading number
    const numMatch = cleaned.match(LEADING_NUMBER);
    if (numMatch) {
      quantity = parseFloat(numMatch[1]);
      cleaned = cleaned.slice(numMatch[0].length).trim();
    }
  }

  // Clamp to reasonable range
  quantity = Math.max(0.25, Math.min(50, quantity));

  return { quantity, unit, cleaned };
}

// ═══════════════════════════════════════
// FOOD NAME NORMALIZATION
// ═══════════════════════════════════════

const FOOD_ALIASES: Record<string, string> = {
  "white coffee": "milk coffee",
  "black coffee": "coffee",
  "masala tea": "tea",
  "chai": "tea",
  "milk tea": "tea",
  "green tea": "black tea",
  "pappu": "dal",
  "lentils": "dal",
  "daal": "dal",
  "yogurt": "curd",
  "dahi": "curd",
  "perugu": "curd",
  "roti": "chapati",
  "phulka": "chapati",
  "naan": "chapati",
  "idly": "idli",
  "medu vada": "vada",
  "garelu": "vada",
  "coke": "cola",
  "pepsi": "cola",
  "soda": "cola",
  "soft drink": "cola",
  "badam": "almonds",
  "almond": "almonds",
  "chaas": "buttermilk",
  "majjiga": "buttermilk",
  "boba": "bubble tea",
  "boba tea": "bubble tea",
  "kaapi": "filter coffee",
  "south indian coffee": "filter coffee",
  "degree coffee": "filter coffee",
  "coconut chutney": "chutney",
  "tomato chutney": "chutney",
  "mint chutney": "chutney",
  "sabzi": "veg curry",
  "curry": "veg curry",
  "french fries": "fries",
  "chips": "fries",
  "hamburger": "burger",
  "cheeseburger": "burger",
  "biryani": "chicken biryani",
  "rice": "white rice",
  "plain rice": "white rice",
  "steamed rice": "white rice",
  "annam": "white rice",
  "sambhar": "sambar",
};

function normalizeFoodName(text: string): string {
  const lower = text.toLowerCase().trim();

  // Direct alias match
  if (FOOD_ALIASES[lower]) {
    return FOOD_ALIASES[lower];
  }

  // Check if input starts with any alias (for partial matches)
  for (const [alias, canonical] of Object.entries(FOOD_ALIASES)) {
    if (lower === alias) {
      return canonical;
    }
  }

  return lower;
}

// ═══════════════════════════════════════
// LABEL GENERATION
// ═══════════════════════════════════════

const MODIFIER_LABELS: Record<Modifier, string> = {
  no_sugar: "No Sugar",
  less_sugar: "Less Sugar",
  extra_sugar: "Extra Sugar",
  low_oil: "Low Oil",
  oily: "Oily",
  ghee: "With Ghee",
  homemade: "Homemade",
  restaurant: "Restaurant",
  boiled: "Boiled",
  fried: "Fried",
  steamed: "Steamed",
  roasted: "Roasted",
  baked: "Baked",
  soaked: "Soaked",
  raw: "Raw",
  half_plate: "Half Plate",
  full_plate: "Full Plate",
};

function capitalize(s: string): string {
  return s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function generateItemLabel(item: ParsedFoodItem): string {
  const parts: string[] = [];

  if (item.quantity !== 1) {
    parts.push(String(item.quantity));
  }
  if (item.unit) {
    parts.push(item.unit);
  }

  parts.push(capitalize(item.name));

  // Append modifiers
  const modLabels = item.modifiers
    .filter(m => !["half_plate", "full_plate"].includes(m))
    .map(m => MODIFIER_LABELS[m]);

  if (item.modifiers.includes("half_plate")) {
    parts.push("(Half Plate)");
  } else if (item.modifiers.includes("full_plate")) {
    parts.push("(Full Plate)");
  }

  if (modLabels.length > 0) {
    parts.push("·");
    parts.push(modLabels.join(", "));
  }

  return parts.join(" ");
}

export function generateNormalizedLabel(items: ParsedFoodItem[]): string {
  return items.map(generateItemLabel).join(" + ");
}

// ═══════════════════════════════════════
// MAIN PARSER
// ═══════════════════════════════════════

function parseSegment(raw: string): ParsedFoodItem {
  const trimmed = raw.trim();

  // 1. Extract modifiers
  const { modifiers, cleaned: afterModifiers } = extractModifiers(trimmed);

  // 2. Extract quantity and unit
  const { quantity, unit, cleaned: afterQuantity } = extractQuantityAndUnit(afterModifiers);

  // 3. Normalize food name
  const name = normalizeFoodName(afterQuantity || trimmed);

  return {
    raw: trimmed,
    name,
    quantity,
    unit,
    modifiers,
  };
}

export function parseInput(input: string): ParsedInput {
  const trimmed = input.trim();
  if (!trimmed) {
    return { original: input, items: [] };
  }

  const segments = splitCompoundInput(trimmed);
  const items = segments.map(parseSegment);

  return {
    original: input,
    items,
  };
}
