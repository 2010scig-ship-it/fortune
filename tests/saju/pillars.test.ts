import { describe, expect, it } from "vitest";
import { ganzhiName } from "../../src/engine/saju/ganzhi";
import { AmbiguousSolarTermBoundaryError, calculateDayPillar, calculateFourPillars, calculateHourPillar, calculateMonthPillar } from "../../src/engine/saju/pillars";
import { calculateSolarTerm, MONTH_BOUNDARY_TERMS } from "../../src/engine/saju/solarTerms";

const baseBirth = { calendarType: "solar", gender: "male", location: { country: "KR", city: "Seoul", timezone: "Asia/Seoul" } } as const;

describe("four pillars", () => {
  it("changes year and month exactly at Ipchun", () => {
    const boundary = calculateSolarTerm(2026, "입춘").instantMs;
    const before = new Date(boundary - 60_000);
    const after = new Date(boundary + 60_000);
    const beforeResult = calculateFourPillars({ ...baseBirth, date: "2026-02-04", time: kstTime(before) });
    const afterResult = calculateFourPillars({ ...baseBirth, date: "2026-02-04", time: kstTime(after) });
    expect(ganzhiName(beforeResult.year)).toBe("乙巳");
    expect(ganzhiName(afterResult.year)).toBe("丙午");
    expect(beforeResult.month.branch.name).toBe("丑");
    expect(afterResult.month.branch.name).toBe("寅");
  });

  it("uses the verified Julian-day epoch", () => {
    expect(ganzhiName(calculateDayPillar(2000, 1, 7))).toBe("甲子");
    expect(ganzhiName(calculateDayPillar(2026, 2, 17))).toBe("壬戌");
  });

  it("omits hour when birth time is unknown", () => {
    const result = calculateFourPillars({ ...baseBirth, date: "1985-03-15", unknownBirthTime: true });
    expect(result.hour).toBeUndefined();
  });

  it("does not guess an unknown time on a solar-term boundary date", () => {
    expect(() => calculateFourPillars({ ...baseBirth, date: "2026-02-04", unknownBirthTime: true }))
      .toThrow(AmbiguousSolarTermBoundaryError);
  });

  it("uses Zi hour from 23:00 while retaining civil-midnight day rollover", () => {
    const before = calculateFourPillars({ ...baseBirth, date: "2000-01-07", time: "22:59" });
    const after = calculateFourPillars({ ...baseBirth, date: "2000-01-07", time: "23:00" });
    expect(before.hour?.branch.name).toBe("亥");
    expect(after.hour?.branch.name).toBe("子");
    expect(ganzhiName(after.day)).toBe("甲子");
  });

  it.each(MONTH_BOUNDARY_TERMS)("changes month branch exactly at %s", (term) => {
    const boundary = calculateSolarTerm(2026, term).instantMs;
    const before = calculateMonthPillar(boundary - 1);
    const after = calculateMonthPillar(boundary);
    expect(ganzhiName(before)).not.toBe(ganzhiName(after));
  });

  it("applies the Five Rat rule across all twelve hour branches", () => {
    const jiaDay = calculateDayPillar(2000, 1, 7);
    const atBranchStarts = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]
      .map((hour) => ganzhiName(calculateHourPillar(jiaDay, hour)));
    expect(atBranchStarts).toEqual([
      "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳",
      "庚午", "辛未", "壬申", "癸酉", "甲戌", "乙亥",
    ]);
    expect(() => calculateHourPillar(jiaDay, 24)).toThrow(RangeError);
  });
});

function kstTime(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.hour}:${values.minute}:${values.second}`;
}
