import { nextUnitRandom } from "./random";
import type { RandomSource } from "./types";

export function shuffleDeck<T>(deck: readonly T[], rng: RandomSource): readonly T[] {
  const result = [...deck];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextUnitRandom(rng) * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}
