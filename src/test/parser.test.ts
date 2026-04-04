import { describe, it, expect } from "vitest";
import { parseInput } from "@/lib/parser";

describe("parseInput", () => {
  it("parses a simple single food item", () => {
    const result = parseInput("idli");
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe("idli");
    expect(result.items[0].quantity).toBe(1);
  });

  it("parses quantity + food", () => {
    const result = parseInput("2 idli");
    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(2);
    expect(result.items[0].name).toBe("idli");
  });

  it("splits compound input with 'and'", () => {
    const result = parseInput("idli and sambar");
    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe("idli");
    expect(result.items[1].name).toBe("sambar");
  });

  it("splits compound input with 'with'", () => {
    const result = parseInput("2 idli with sambar and chutney");
    expect(result.items).toHaveLength(3);
    expect(result.items[0].name).toBe("idli");
    expect(result.items[0].quantity).toBe(2);
    expect(result.items[1].name).toBe("sambar");
    expect(result.items[2].name).toBe("chutney");
  });

  it("splits compound input with 'plus'", () => {
    const result = parseInput("burger plus fries and coke");
    expect(result.items).toHaveLength(3);
    expect(result.items[0].name).toBe("burger");
    expect(result.items[1].name).toBe("fries");
    // coke should alias to cola
    expect(result.items[2].name).toBe("cola");
  });

  it("detects modifiers", () => {
    // 'with' splits segments, so 'no sugar' becomes its own segment.
    // Test modifier detection within a single segment instead.
    const result = parseInput("coffee no sugar");
    expect(result.items[0].modifiers).toContain("no_sugar");
  });

  it("splits modifiers across segments with 'with'", () => {
    const result = parseInput("white coffee with no sugar");
    // 'with' splits: ["white coffee", "no sugar"]
    expect(result.items).toHaveLength(2);
    // 'no sugar' segment has the modifier
    expect(result.items[1].modifiers).toContain("no_sugar");
  });

  it("handles food aliases", () => {
    const result = parseInput("chai");
    expect(result.items[0].name).toBe("tea");
  });

  it("handles quantity with units", () => {
    const result = parseInput("1 bowl dal");
    expect(result.items[0].quantity).toBe(1);
    expect(result.items[0].unit).toBe("bowl");
  });

  it("handles half plate modifier", () => {
    const result = parseInput("chicken biryani half plate");
    expect(result.items[0].modifiers).toContain("half_plate");
  });

  it("preserves original input", () => {
    const result = parseInput("2 idli with sambar");
    expect(result.original).toBe("2 idli with sambar");
  });

  it("handles numbers in compound items", () => {
    const result = parseInput("coffee with 8 soaked almonds and 10 sunflower seeds");
    expect(result.items).toHaveLength(3);
    expect(result.items[1].quantity).toBe(8);
    expect(result.items[1].modifiers).toContain("soaked");
    expect(result.items[2].quantity).toBe(10);
  });
});
