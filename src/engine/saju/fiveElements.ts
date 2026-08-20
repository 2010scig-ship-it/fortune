import type { ElementCounts, ElementDistribution, FourPillars, Ganzhi } from "./types";
export function countRawElements(pillars: Partial<FourPillars> | Readonly<Record<string, Ganzhi>>): ElementDistribution {
  const raw: Record<keyof ElementCounts, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const pillar of Object.values(pillars)) {
    if (pillar === undefined) continue;
    raw[pillar.stem.element] += 1;
    raw[pillar.branch.element] += 1;
  }
  return { raw };
}
