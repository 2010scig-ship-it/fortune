import { nextUnitRandom } from "./random";
import type { RandomSource, TarotCard, TarotOrientation, DrawnTarotCard } from "./types";

export function chooseOrientation(rng: RandomSource, reversedProbability = 0.5): TarotOrientation {
  if (!Number.isFinite(reversedProbability) || reversedProbability < 0 || reversedProbability > 1) {
    throw new RangeError("reversedProbability must be in the range [0, 1]");
  }
  return nextUnitRandom(rng) < reversedProbability ? "reversed" : "upright";
}

export function orientCards(
  cards: readonly TarotCard[],
  rng: RandomSource,
  reversedProbability = 0.5,
): readonly DrawnTarotCard[] {
  return cards.map((card) => ({ card, orientation: chooseOrientation(rng, reversedProbability) }));
}
