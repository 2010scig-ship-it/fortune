import type { DrawnTarotCard, TarotQuestionCategory, TarotSpreadPosition } from "../../engine/tarot/types";
import { themesForDrawnCard } from "./themeMapping";
import type { TarotCardInterpretation } from "./types";

const ORIENTATION_LABEL = { upright: "정방향", reversed: "역방향" } as const;

export function interpretCard(
  drawn: DrawnTarotCard,
  position: TarotSpreadPosition,
  questionCategory: TarotQuestionCategory = "general",
): TarotCardInterpretation {
  const keywords = drawn.card.meanings[drawn.orientation];
  const categoryPrompts = questionCategory === "general"
    ? []
    : drawn.card.categories[questionCategory] ?? [];
  const categoryText = categoryPrompts.length === 0 ? "" : ` ${categoryPrompts.join(" ")}`;
  return {
    cardId: drawn.card.id,
    cardName: drawn.card.name,
    orientation: drawn.orientation,
    position,
    questionCategory,
    keywords,
    categoryPrompts,
    text: `${position.label} 위치의 ${drawn.card.name} ${ORIENTATION_LABEL[drawn.orientation]}은(는) ${keywords.join("·")}을(를) 중심으로 살펴보라는 상징적 메시지입니다. ${position.prompt}.${categoryText}`,
    themes: themesForDrawnCard(drawn),
  };
}
