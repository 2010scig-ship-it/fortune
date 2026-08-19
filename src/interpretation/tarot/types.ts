import type { TarotOrientation, TarotQuestionCategory, TarotSpreadPosition } from "../../engine/tarot/types";
import type { Theme } from "../themes";

export interface TarotCardInterpretation {
  readonly cardId: string;
  readonly cardName: string;
  readonly orientation: TarotOrientation;
  readonly position: TarotSpreadPosition;
  readonly questionCategory: TarotQuestionCategory;
  readonly keywords: readonly string[];
  readonly categoryPrompts: readonly string[];
  readonly text: string;
  readonly themes: readonly Theme[];
}

export interface TarotSpreadInterpretation {
  readonly methodology: "phase-4-rule-based-v1";
  readonly spreadId: string;
  readonly spreadName: string;
  readonly questionCategory: TarotQuestionCategory;
  readonly cards: readonly TarotCardInterpretation[];
  readonly themes: readonly Theme[];
  readonly limitations: readonly string[];
}
