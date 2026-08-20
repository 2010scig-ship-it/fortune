import { HEAVENLY_STEMS } from "../../data/heavenlyStems";
import { HIDDEN_STEM_NAMES } from "../../data/hiddenStems";
import type { EarthlyBranch, HeavenlyStem } from "./types";
export interface HiddenStem { readonly stem: HeavenlyStem; readonly weight?: number }
export function getHiddenStems(branch: EarthlyBranch): readonly HiddenStem[] {
  return HIDDEN_STEM_NAMES[branch.name].map((name) => ({ stem: HEAVENLY_STEMS.find((stem) => stem.name === name)! }));
}
