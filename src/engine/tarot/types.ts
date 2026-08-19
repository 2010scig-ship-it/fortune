export type TarotArcana = "major" | "minor";
export type TarotSuit = "wands" | "cups" | "swords" | "pentacles";
export type TarotRank = "ace" | "two" | "three" | "four" | "five" | "six" | "seven" | "eight" | "nine" | "ten" | "page" | "knight" | "queen" | "king";
export type TarotOrientation = "upright" | "reversed";
export type TarotQuestionCategory = "general" | "love" | "career" | "wealth" | "relationship";

export interface TarotCard {
  readonly id: string;
  readonly name: string;
  readonly arcana: TarotArcana;
  readonly suit?: TarotSuit;
  readonly rank?: TarotRank;
  readonly number?: number;
  readonly meanings: {
    readonly upright: readonly string[];
    readonly reversed: readonly string[];
  };
  readonly categories: {
    readonly love?: readonly string[];
    readonly career?: readonly string[];
    readonly wealth?: readonly string[];
    readonly relationship?: readonly string[];
  };
}

export interface DrawnTarotCard {
  readonly card: TarotCard;
  readonly orientation: TarotOrientation;
}

export type TarotSpreadId = "one-card" | "three-timeline" | "three-guidance" | "five-card";

export interface TarotSpreadPosition {
  readonly id: string;
  readonly label: string;
  readonly prompt: string;
}

export interface TarotSpreadDefinition {
  readonly id: TarotSpreadId;
  readonly name: string;
  readonly positions: readonly TarotSpreadPosition[];
}

export interface PositionedTarotCard {
  readonly position: TarotSpreadPosition;
  readonly drawn: DrawnTarotCard;
}

export interface TarotSpreadDraw {
  readonly spread: TarotSpreadDefinition;
  readonly cards: readonly PositionedTarotCard[];
}

export type RandomSource = () => number;
