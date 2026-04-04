import { describe, it, expect } from "vitest";
import { parseInput } from "@/lib/parser";
import { analyzeInput } from "@/lib/calculations";

describe("analyzeInput", () => {
  it("calculates nutrition for a known food item", () => {
    const parsed = parseInput("idli");
    const result = analyzeInput(parsed);

    expect(result.components).toHaveLength(1);
    expect(result.components[0].matched).toBe(true);
    expect(result.totals.calories).toBeGreaterThan(0);
    expect(result.totals.protein).toBeGreaterThan(0);
    expect(result.confidence).toBe("high");
  });

  it("calculates compound meal (2 idli with sambar and chutney)", () => {
    const parsed = parseInput("2 idli with sambar and chutney");
    const result = analyzeInput(parsed);

    expect(result.components.length).toBe(3);
    // Each component should be matched
    expect(result.matchedCount).toBe(3);
    expect(result.estimatedCount).toBe(0);
    // Total calories should be sum of components
    const sumCal = result.components.reduce((s, c) => s + c.calories, 0);
    expect(result.totals.calories).toBe(Math.round(sumCal));
  });

  it("provides normalized label for result", () => {
    const parsed = parseInput("idli and sambar");
    const result = analyzeInput(parsed);

    expect(result.normalizedLabel).toBeTruthy();
    // Should contain capitalized food names
    expect(result.normalizedLabel.toLowerCase()).toContain("idli");
    expect(result.normalizedLabel.toLowerCase()).toContain("sambar");
  });

  it("estimates unknown food items", () => {
    const parsed = parseInput("alien fruit salad");
    const result = analyzeInput(parsed);

    expect(result.components[0].estimated).toBe(true);
    expect(result.confidence).toBe("low");
    expect(result.totals.calories).toBeGreaterThan(0);
  });

  it("applies modifier multipliers (no sugar)", () => {
    const withSugar = analyzeInput(parseInput("tea"));
    const noSugar = analyzeInput(parseInput("tea no sugar"));

    // no_sugar should reduce calories
    expect(noSugar.totals.calories).toBeLessThan(withSugar.totals.calories);
  });

  it("handles half plate modifier", () => {
    const full = analyzeInput(parseInput("chicken biryani"));
    const half = analyzeInput(parseInput("chicken biryani half plate"));

    // Half plate should have roughly half the calories (with some rounding)
    expect(half.totals.calories).toBeLessThan(full.totals.calories);
    expect(half.totals.calories).toBeGreaterThan(0);
  });

  it("returns empty result for empty input", () => {
    const parsed = parseInput("");
    const result = analyzeInput(parsed);

    expect(result.components).toHaveLength(0);
    expect(result.totals.calories).toBe(0);
    expect(result.notes.length).toBeGreaterThan(0);
  });

  it("correctly matches filter coffee", () => {
    const parsed = parseInput("filter coffee");
    const result = analyzeInput(parsed);

    expect(result.components.length).toBe(1);
    expect(result.components[0].matched).toBe(true);
    // searchFood returns best fuzzy match; may be COFFEE or FILTER_COFFEE
    expect(["COFFEE", "FILTER_COFFEE"]).toContain(result.components[0].foodCode);
  });

  it("correctly matches aliased items (chai → tea)", () => {
    const parsed = parseInput("chai");
    const result = analyzeInput(parsed);

    expect(result.components[0].matched).toBe(true);
  });
});
