import type { HeavenlyStem } from "../engine/saju/types";

export const HEAVENLY_STEMS = [
  { name: "甲", element: "wood", yinYang: "yang" },
  { name: "乙", element: "wood", yinYang: "yin" },
  { name: "丙", element: "fire", yinYang: "yang" },
  { name: "丁", element: "fire", yinYang: "yin" },
  { name: "戊", element: "earth", yinYang: "yang" },
  { name: "己", element: "earth", yinYang: "yin" },
  { name: "庚", element: "metal", yinYang: "yang" },
  { name: "辛", element: "metal", yinYang: "yin" },
  { name: "壬", element: "water", yinYang: "yang" },
  { name: "癸", element: "water", yinYang: "yin" },
] as const satisfies readonly HeavenlyStem[];

