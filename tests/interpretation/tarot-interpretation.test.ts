import { describe, expect, it } from "vitest";
import { RWS_DECK } from "../../src/engine/tarot/deck";
import { getTarotSpread, placeCardsInSpread } from "../../src/engine/tarot/spreads";
import { interpretCard } from "../../src/interpretation/tarot/cardInterpreter";
import { interpretSpread } from "../../src/interpretation/tarot/spreadInterpreter";

describe("rule-based tarot interpretation", () => {
  const spread = getTarotSpread("three-guidance");
  const draw = placeCardsInSpread(spread, [
    { card: RWS_DECK[0]!, orientation: "upright" },
    { card: RWS_DECK[7]!, orientation: "reversed" },
    { card: RWS_DECK[16]!, orientation: "upright" },
  ]);

  it("combines card, orientation, position, and question category", () => {
    const result = interpretCard(draw.cards[1]!.drawn, draw.cards[1]!.position, "career");
    expect(result.cardName).toBe("The Chariot");
    expect(result.orientation).toBe("reversed");
    expect(result.position.id).toBe("advice");
    expect(result.keywords).toEqual(draw.cards[1]!.drawn.card.meanings.reversed);
    expect(result.categoryPrompts.length).toBeGreaterThan(0);
    expect(result.text).toContain("역방향");
  });

  it("preserves spread order and deduplicates mapped themes", () => {
    const result = interpretSpread(draw, "career");
    expect(result.cards.map(({ position }) => position.id)).toEqual(["situation", "advice", "outcome"]);
    expect(new Set(result.themes).size).toBe(result.themes.length);
    expect(result.themes).toContain("CAUTION");
    expect(result.methodology).toBe("phase-4-rule-based-v1");
  });

  it("keeps wording non-certain and includes decision limitations", () => {
    const result = interpretSpread(draw, "wealth");
    const text = [...result.cards.map((card) => card.text), ...result.limitations].join(" ");
    expect(text).not.toMatch(/반드시 (성공|실패)|사고가 납니다|큰 병에 걸립니다|헤어지게 됩니다|투자하면 돈을 법니다/);
    expect(result.limitations.some((line) => line.includes("의료·법률·투자"))).toBe(true);
  });
});
