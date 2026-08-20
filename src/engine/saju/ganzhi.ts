import { EARTHLY_BRANCHES } from "../../data/earthlyBranches";
import { HEAVENLY_STEMS } from "../../data/heavenlyStems";
import type { Ganzhi } from "./types";

export function floorMod(value: number, modulus: number): number { return ((value % modulus) + modulus) % modulus; }
export function ganzhiAt(index: number): Ganzhi {
  const normalized = floorMod(index, 60);
  return { stem: HEAVENLY_STEMS[normalized % 10]!, branch: EARTHLY_BRANCHES[normalized % 12]! };
}
export function ganzhiName(ganzhi: Pick<Ganzhi, "stem" | "branch">): string { return `${ganzhi.stem.name}${ganzhi.branch.name}`; }
