import { describe, expect, it } from "vitest";
import { calculateSajuCore } from "../../src/engine/saju/index";
import { getSewoon } from "../../src/engine/saju/sewoon";
import { interpretSaju } from "../../src/interpretation/saju/index";

const birthData = {
  date: "2026-02-17",
  time: "14:30",
  calendarType: "solar",
  gender: "male",
  location: { country: "KR", city: "Seoul", timezone: "Asia/Seoul" },
} as const;

describe("rule-based Saju interpretation", () => {
  it("returns all six categories with explicit evidence", () => {
    const result = interpretSaju({ core: calculateSajuCore(birthData), sewoon: getSewoon(2026) });

    expect(result.methodology).toBe("phase-3-rule-based-v1");
    expect(result.categories.personality).toHaveLength(3);
    expect(result.categories.career.length).toBeGreaterThanOrEqual(2);
    expect(result.categories.wealth).toHaveLength(1);
    expect(result.categories.relationship).toHaveLength(1);
    expect(result.categories.health).toHaveLength(2);
    expect(result.categories.fortune).toHaveLength(1);

    const points = Object.values(result.categories).flat();
    expect(points.every((point) => point.evidence.length > 0)).toBe(true);
    expect(points.every((point) => point.text.length > 0)).toBe(true);
  });

  it("is deterministic for identical structured input", () => {
    const input = { core: calculateSajuCore(birthData), sewoon: getSewoon(2026) };
    expect(interpretSaju(input)).toEqual(interpretSaju(input));
  });

  it("handles unknown birth time without inventing an hour pillar", () => {
    const core = calculateSajuCore({
      date: "1985-03-15",
      calendarType: "solar",
      gender: "male",
      location: birthData.location,
      unknownBirthTime: true,
    });
    const result = interpretSaju({ core });
    expect(core.fourPillars.hour).toBeUndefined();
    expect(result.categories.personality.length).toBeGreaterThan(0);
    expect(result.categories.fortune).toEqual([]);
    expect(result.limitations.some((text) => text.includes("세운이 제공되지 않아"))).toBe(true);
  });

  it("keeps health and future wording non-diagnostic and non-certain", () => {
    const result = interpretSaju({ core: calculateSajuCore(birthData), sewoon: getSewoon(2026) });
    const allText = [...Object.values(result.categories).flat().map((point) => point.text), ...result.limitations].join(" ");
    expect(allText).not.toMatch(/반드시 (성공|실패)|사고가 납니다|큰 병에 걸립니다|헤어지게 됩니다|투자하면 돈을 법니다/);
    expect(result.categories.health.some((point) => point.text.includes("의학적 결핍을 뜻하지 않"))).toBe(true);
    expect(result.limitations.some((text) => text.includes("의료·법률·투자"))).toBe(true);
  });

  it("orders selected rules by weight and then stable rule ID", () => {
    const result = interpretSaju({ core: calculateSajuCore(birthData), sewoon: getSewoon(2026) });
    for (const points of Object.values(result.categories)) {
      for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1]!;
        const current = points[index]!;
        expect(previous.weight).toBeGreaterThanOrEqual(current.weight);
        if (previous.weight === current.weight) {
          expect(previous.ruleId.localeCompare(current.ruleId)).toBeLessThanOrEqual(0);
        }
      }
    }
  });
});
