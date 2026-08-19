import { orientCards } from "./orientation";
import { shuffleDeck } from "./shuffle";
import { placeCardsInSpread } from "./spreads";
import type { RandomSource, TarotCard, TarotSpreadDefinition, TarotSpreadDraw } from "./types";

export function drawCards<T>(deck: readonly T[], count: number, rng: RandomSource): readonly T[] {
  if (!Number.isInteger(count) || count < 0 || count > deck.length) {
    throw new RangeError(`Draw count must be an integer from 0 through ${deck.length}`);
  }
  return shuffleDeck(deck, rng).slice(0, count);
}

export function drawForSpread(
  deck: readonly TarotCard[],
  spread: TarotSpreadDefinition,
  rng: RandomSource,
  reversedProbability = 0.5,
): TarotSpreadDraw {
  const cards = drawCards(deck, spread.positions.length, rng);
  return placeCardsInSpread(spread, orientCards(cards, rng, reversedProbability));
}
