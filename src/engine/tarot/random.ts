import type { RandomSource } from "./types";

export function nextUnitRandom(rng: RandomSource): number {
  const value = rng();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError("RNG must return a finite number in the range [0, 1)");
  }
  return value;
}
