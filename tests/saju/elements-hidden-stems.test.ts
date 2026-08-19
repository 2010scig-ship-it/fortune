import { describe, expect, it } from "vitest";
import { EARTHLY_BRANCHES } from "../../src/data/earthlyBranches";
import { countRawElements } from "../../src/engine/saju/fiveElements";
import { ganzhiAt } from "../../src/engine/saju/ganzhi";
import { getHiddenStems } from "../../src/engine/saju/hiddenStems";

describe("hidden stems and raw elements", () => {
  it("keeps hidden-stem data unweighted", () => {
    const chou = EARTHLY_BRANCHES.find((branch) => branch.name === "丑")!;
    expect(getHiddenStems(chou).map(({ stem }) => stem.name)).toEqual(["己", "癸", "辛"]);
    expect(getHiddenStems(chou).every((entry) => entry.weight === undefined)).toBe(true);
  });

  it("resolves the complete documented hidden-stem table", () => {
    const actual = Object.fromEntries(EARTHLY_BRANCHES.map((branch) => [
      branch.name,
      getHiddenStems(branch).map(({ stem }) => stem.name).join(""),
    ]));
    expect(actual).toEqual({
      子: "癸", 丑: "己癸辛", 寅: "甲丙戊", 卯: "乙",
      辰: "戊乙癸", 巳: "丙戊庚", 午: "丁己", 未: "己丁乙",
      申: "庚壬戊", 酉: "辛", 戌: "戊辛丁", 亥: "壬甲",
    });
  });

  it("counts only visible stems and primary branch elements", () => {
    const distribution = countRawElements({ year: ganzhiAt(0), month: ganzhiAt(1), day: ganzhiAt(2) });
    expect(Object.values(distribution.raw).reduce((sum, count) => sum + count, 0)).toBe(6);
    expect(distribution.weighted).toBeUndefined();
  });
});
