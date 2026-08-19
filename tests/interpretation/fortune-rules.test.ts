import { describe, expect, it } from "vitest";
import { HEAVENLY_STEMS } from "../../src/data/heavenlyStems";
import { calculateSajuCore } from "../../src/engine/saju/index";
import { calculateTenGod } from "../../src/engine/saju/tenGods";
import type { Sewoon } from "../../src/engine/saju/types";
import { interpretFortune } from "../../src/interpretation/saju/fortune";

const core = calculateSajuCore({
  date: "2000-01-07",
  time: "12:00",
  calendarType: "solar",
  gender: "female",
  location: { country: "KR", city: "Seoul", timezone: "Asia/Seoul" },
});

describe("fortune rules", () => {
  it.each(HEAVENLY_STEMS)("selects exactly one annual rule for $name", (stem) => {
    const sewoon: Sewoon = {
      sajuYear: 2026,
      stem,
      branch: core.fourPillars.year.branch,
      startInstantMs: Date.parse("2026-02-03T20:00:00Z"),
      endInstantMs: Date.parse("2027-02-04T02:00:00Z"),
      methodology: "ipchun-year-boundary",
    };
    const result = interpretFortune({ core, sewoon });
    expect(result).toHaveLength(1);
    expect(result[0]?.evidence.find(({ key }) => key === "sewoonStemTenGod")?.value)
      .toBe(calculateTenGod(core.dayMaster, stem));
  });
});
