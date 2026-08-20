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
  const [primaryMeaning, secondaryMeaning] = keywords;
  const meaningText = [
    primaryMeaning === undefined ? "" : `이 카드가 먼저 보여 주는 모습은 '${primaryMeaning}'입니다.`,
    secondaryMeaning === undefined ? "" : `함께 살펴볼 점은 '${secondaryMeaning}'입니다.`,
    drawn.orientation === "upright"
      ? "지금 활용할 수 있는 강점이나 가능성을 실제 선택에 어떻게 연결할지 생각해 보세요."
      : "일이 막히거나 지나치게 진행되는 부분은 없는지 확인하고, 서두르기 전에 한 가지씩 정리해 보세요.",
  ].filter((text) => text.length > 0).join(" ");
  return {
    cardId: drawn.card.id,
    cardName: drawn.card.name,
    orientation: drawn.orientation,
    position,
    questionCategory,
    keywords,
    categoryPrompts,
    text: `'${drawn.card.name}' 카드가 '${position.label}' 자리에 ${ORIENTATION_LABEL[drawn.orientation]}으로 나왔습니다. ${position.prompt} ${meaningText}${categoryText}`,
    themes: themesForDrawnCard(drawn),
  };
}
