import { countRawElements } from "./fiveElements";
import { calculateFourPillars } from "./pillars";
import { calculateTenGod } from "./tenGods";
import type { BirthData, FourPillars, SajuCoreResult } from "./types";
export { ganzhiAt, ganzhiName } from "./ganzhi";
export { countYinYang } from "./yinYang";
export function calculateSajuCore(birth: BirthData): SajuCoreResult {
  const fourPillars = calculateFourPillars(birth); const dayMaster = fourPillars.day.stem;
  return { fourPillars, dayMaster, fiveElements: countRawElements(fourPillars), tenGods: { stems: {
    year: calculateTenGod(dayMaster, fourPillars.year.stem), month: calculateTenGod(dayMaster, fourPillars.month.stem), day: calculateTenGod(dayMaster, dayMaster),
    ...(fourPillars.hour === undefined ? {} : { hour: calculateTenGod(dayMaster, fourPillars.hour.stem) }),
  } } };
}
