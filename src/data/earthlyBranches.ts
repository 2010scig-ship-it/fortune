import type { EarthlyBranch } from "../engine/saju/types";

export const EARTHLY_BRANCHES = [
  { name: "子", element: "water", yinYang: "yang" },
  { name: "丑", element: "earth", yinYang: "yin" },
  { name: "寅", element: "wood", yinYang: "yang" },
  { name: "卯", element: "wood", yinYang: "yin" },
  { name: "辰", element: "earth", yinYang: "yang" },
  { name: "巳", element: "fire", yinYang: "yin" },
  { name: "午", element: "fire", yinYang: "yang" },
  { name: "未", element: "earth", yinYang: "yin" },
  { name: "申", element: "metal", yinYang: "yang" },
  { name: "酉", element: "metal", yinYang: "yin" },
  { name: "戌", element: "earth", yinYang: "yang" },
  { name: "亥", element: "water", yinYang: "yin" },
] as const satisfies readonly EarthlyBranch[];

