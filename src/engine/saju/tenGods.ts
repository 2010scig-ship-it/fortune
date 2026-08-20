import type { Element, HeavenlyStem, TenGod } from "./types";
const GENERATES: Readonly<Record<Element, Element>> = { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" };
const CONTROLS: Readonly<Record<Element, Element>> = { wood: "earth", fire: "metal", earth: "water", metal: "wood", water: "fire" };
export function calculateTenGod(dayMaster: HeavenlyStem, target: HeavenlyStem): TenGod {
  const samePolarity = dayMaster.yinYang === target.yinYang;
  if (dayMaster.element === target.element) return samePolarity ? "비견" : "겁재";
  if (GENERATES[dayMaster.element] === target.element) return samePolarity ? "식신" : "상관";
  if (CONTROLS[dayMaster.element] === target.element) return samePolarity ? "편재" : "정재";
  if (CONTROLS[target.element] === dayMaster.element) return samePolarity ? "편관" : "정관";
  return samePolarity ? "편인" : "정인";
}
