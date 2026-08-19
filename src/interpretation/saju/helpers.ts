import { ELEMENT_LABELS, type TenGodGroup, type WealthCountBand, type YinYangBalance } from "../../data/interpretations";
import { countYinYang } from "../../engine/saju/yinYang";
import type { Element, ElementCounts, SajuCoreResult, TenGod } from "../../engine/saju/types";

const ELEMENTS = ["wood", "fire", "earth", "metal", "water"] as const satisfies readonly Element[];

const TEN_GOD_GROUP: Readonly<Record<TenGod, TenGodGroup>> = {
  비견: "peer", 겁재: "peer",
  식신: "output", 상관: "output",
  편재: "wealth", 정재: "wealth",
  편관: "authority", 정관: "authority",
  편인: "resource", 정인: "resource",
};

export function elementNamesAtExtreme(counts: ElementCounts, extreme: "max" | "min"): readonly Element[] {
  const target = Math[extreme](...ELEMENTS.map((element) => counts[element]));
  return ELEMENTS.filter((element) => counts[element] === target);
}

export function elementLabels(elements: readonly Element[]): string {
  return elements.map((element) => ELEMENT_LABELS[element]).join("·");
}

export function visibleTenGodsExcludingDay(core: SajuCoreResult): readonly TenGod[] {
  const { year, month, hour } = core.tenGods.stems;
  return hour === undefined ? [year, month] : [year, month, hour];
}

export function dominantVisibleTenGodGroups(core: SajuCoreResult): readonly TenGodGroup[] {
  const counts: Record<TenGodGroup, number> = { peer: 0, output: 0, wealth: 0, authority: 0, resource: 0 };
  for (const tenGod of visibleTenGodsExcludingDay(core)) counts[TEN_GOD_GROUP[tenGod]] += 1;
  const maximum = Math.max(...Object.values(counts));
  return (Object.keys(counts) as TenGodGroup[]).filter((group) => counts[group] === maximum && maximum > 0);
}

export function visibleWealthBand(core: SajuCoreResult): { readonly count: number; readonly band: WealthCountBand } {
  const count = visibleTenGodsExcludingDay(core).filter((tenGod) => tenGod === "편재" || tenGod === "정재").length;
  return { count, band: count === 0 ? "none" : count === 1 ? "single" : "multiple" };
}

export function yinYangBalance(core: SajuCoreResult): { readonly yin: number; readonly yang: number; readonly balance: YinYangBalance } {
  const { yin, yang } = countYinYang(core.fourPillars);
  return { yin, yang, balance: yin === yang ? "balanced" : yin > yang ? "yin-dominant" : "yang-dominant" };
}
