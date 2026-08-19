import { describe, expect, it } from "vitest";
import { calculateSajuCore, countYinYang, ganzhiName } from "../../src/engine/saju/index";

describe("Saju Core integration", () => {
  it("returns structured pillars, day master, raw elements, and ten gods", () => {
    const result = calculateSajuCore({
      date: "2026-02-17",
      time: "14:30",
      calendarType: "solar",
      gender: "male",
      location: { country: "KR", city: "Seoul", timezone: "Asia/Seoul" },
    });

    expect(ganzhiName(result.fourPillars.day)).toBe("壬戌");
    expect(result.dayMaster.name).toBe("壬");
    expect(Object.values(result.fiveElements.raw).reduce((sum, count) => sum + count, 0)).toBe(8);
    expect(result.tenGods.stems.day).toBe("비견");
    expect(countYinYang(result.fourPillars).yin + countYinYang(result.fourPillars).yang).toBe(8);
  });
});
