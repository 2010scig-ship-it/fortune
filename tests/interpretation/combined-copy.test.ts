import { describe, expect, it } from "vitest";
import { THEME_RELATIONS } from "../../src/data/themeRelations";
import { THEMES, THEME_LABELS } from "../../src/interpretation/themes";

describe("combined reading copy", () => {
  it("uses Korean labels and concrete guidance instead of internal signal terms", () => {
    expect(THEMES.map((theme) => THEME_LABELS[theme])).toEqual([
      "변화",
      "성장과 확장",
      "신중함",
      "관계",
      "돈과 자원",
      "일과 진로",
      "휴식과 회복",
      "갈등 조정",
      "새로운 기회",
      "배움",
      "주도성",
      "독립성",
      "안정",
    ]);

    const guidance = THEME_RELATIONS.map((relation) => relation.explanation).join(" ");
    expect(guidance).not.toMatch(/보완 신호|긴장 신호|절충점|검토 기준|주도권/);
    expect(guidance).toContain("감당할 수 있는 범위와 중단 기준을 먼저 정하세요");
    expect(guidance).toContain("되돌릴 수 있는 작은 선택부터 시작하세요");
  });
});
