import { describe, expect, it } from "vitest";
import {
  getReadingTarotSpreadOption,
  READING_TAROT_SPREADS,
} from "../../src/application/tarotFlow";
import { getTarotSpread } from "../../src/engine/tarot";

describe("reading tarot flow", () => {
  it("offers only the requested one-card and three-card spreads", () => {
    expect(READING_TAROT_SPREADS.map(({ id }) => id)).toEqual(["one-card", "three-guidance"]);
    expect(READING_TAROT_SPREADS.map(({ positionLabels }) => positionLabels.length)).toEqual([1, 3]);
  });

  it("derives position labels from the deterministic tarot engine", () => {
    for (const option of READING_TAROT_SPREADS) {
      expect(option.positionLabels).toEqual(getTarotSpread(option.id).positions.map(({ label }) => label));
    }
    expect(getReadingTarotSpreadOption("three-guidance").title).toBe("세 장으로 살펴보기");
  });
});
