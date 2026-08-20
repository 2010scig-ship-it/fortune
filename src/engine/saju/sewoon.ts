import { civilPartsAt } from "./calendar";
import { ganzhiAt } from "./ganzhi";
import { calculateSolarTerm } from "./solarTerms";
import type { Sewoon } from "./types";
export function getSewoon(sajuYear: number): Sewoon {
  if (!Number.isInteger(sajuYear) || sajuYear < 1899 || sajuYear > 2100) throw new RangeError("sewoon year outside supported range");
  return { ...ganzhiAt(sajuYear - 4), sajuYear, startInstantMs: calculateSolarTerm(sajuYear, "입춘").instantMs, endInstantMs: calculateSolarTerm(sajuYear + 1, "입춘").instantMs, methodology: "ipchun-year-boundary" };
}
export function getSewoonAt(instantMs: number, timezone = "Asia/Seoul"): Sewoon {
  if (!Number.isFinite(instantMs)) throw new RangeError("invalid instant");
  const civilYear = civilPartsAt(instantMs, timezone).year;
  const sajuYear = instantMs < calculateSolarTerm(civilYear, "입춘").instantMs ? civilYear - 1 : civilYear;
  return getSewoon(sajuYear);
}
export function getCurrentSewoon(options: { readonly clock: () => number; readonly timezone: string }): Sewoon { return getSewoonAt(options.clock(), options.timezone); }
