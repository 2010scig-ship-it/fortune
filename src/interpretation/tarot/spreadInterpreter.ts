import type { TarotQuestionCategory, TarotSpreadDraw } from "../../engine/tarot/types";
import { interpretCard } from "./cardInterpreter";
import { mergeThemes } from "./themeMapping";
import type { TarotSpreadInterpretation } from "./types";

const LIMITATIONS = [
  "이 결과는 엔터테인먼트와 자기성찰을 위한 규칙 기반 타로 해석입니다.",
  "카드는 가능성과 점검 주제를 제시하며 미래의 성공·실패를 확정하지 않습니다.",
  "의료·법률·투자 등 중요한 결정은 이 결과만으로 판단하지 않아야 합니다.",
] as const;

export function interpretSpread(
  draw: TarotSpreadDraw,
  questionCategory: TarotQuestionCategory = "general",
): TarotSpreadInterpretation {
  const cards = draw.cards.map(({ position, drawn }) => interpretCard(drawn, position, questionCategory));
  return {
    methodology: "phase-4-rule-based-v1",
    spreadId: draw.spread.id,
    spreadName: draw.spread.name,
    questionCategory,
    cards,
    themes: mergeThemes(cards.map(({ themes }) => themes)),
    limitations: LIMITATIONS,
  };
}
