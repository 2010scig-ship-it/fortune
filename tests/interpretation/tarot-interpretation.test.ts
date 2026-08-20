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
    expect(result.text).toContain("지금 현실적으로 취할 수 있는 태도와 행동을 살펴보는 자리입니다.");
    expect(result.text).not.toMatch(/[이가은는을를]\([가는를]\)|상징적 메시지|Outcome 위치/);
    expect(result.text).toContain("일과 진로에 관한 질문이라면");
  });

  it("preserves spread order and deduplicates mapped themes", () => {
    const result = interpretSpread(draw, "career");
    expect(result.cards.map(({ position }) => position.id)).toEqual(["situation", "advice", "outcome"]);
    expect(new Set(result.themes).size).toBe(result.themes.length);
    expect(result.themes).toContain("CAUTION");
    expect(result.methodology).toBe("phase-4-rule-based-v1");
  });

  it("turns a reversed Page of Wands outcome into plain Korean guidance", () => {
    const pageOfWands = RWS_DECK.find((card) => card.id === "minor-wands-page");
    const outcome = spread.positions.find((position) => position.id === "outcome");
    expect(pageOfWands).toBeDefined();
    expect(outcome).toBeDefined();

    const result = interpretCard({ card: pageOfWands!, orientation: "reversed" }, outcome!, "wealth");
    expect(result.text).toContain("'앞으로의 방향' 자리에 역방향으로 나왔습니다");
    expect(result.text).toContain("의욕은 있지만 속도나 방향이 맞지 않는 상태");
    expect(result.text).toContain("생각이 흩어지거나 말을 충분히 다듬지 못한 상태");
    expect(result.text).toContain("기대하는 이익과 감당할 수 있는 손실을 숫자로 확인한 뒤 결정하세요");
    expect(result.text).not.toMatch(/Outcome|은\(는\)|을\(를\)|상징적 메시지|행동·동기·창조성/);
  });

  it("keeps wording non-certain and includes decision limitations", () => {
    const result = interpretSpread(draw, "wealth");
    const text = [...result.cards.map((card) => card.text), ...result.limitations].join(" ");
    expect(text).not.toMatch(/반드시 (성공|실패)|사고가 납니다|큰 병에 걸립니다|헤어지게 됩니다|투자하면 돈을 법니다/);
    expect(result.limitations.some((line) => line.includes("의료·법률·투자"))).toBe(true);
  });
});
