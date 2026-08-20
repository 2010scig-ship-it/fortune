import type { FourPillars } from "./types";
export function countYinYang(pillars: FourPillars): { readonly yin: number; readonly yang: number } {
  let yin = 0; let yang = 0;
  for (const pillar of Object.values(pillars)) {
    if (pillar === undefined) continue;
    if (pillar.stem.yinYang === "yin") yin += 1; else yang += 1;
    if (pillar.branch.yinYang === "yin") yin += 1; else yang += 1;
  }
  return { yin, yang };
}
