import { describe, expect, it } from "vitest";
import { MethodologyDecisionRequiredError } from "../../src/engine/saju/advancedMethodology";
import { calculateDaewoon } from "../../src/engine/saju/daewoon";
import { ganzhiAt } from "../../src/engine/saju/ganzhi";
import { analyzeStrength } from "../../src/engine/saju/strength";
import { analyzeYongshin } from "../../src/engine/saju/yongsin";

const pillars = {
  year: ganzhiAt(0),
  month: ganzhiAt(1),
  day: ganzhiAt(2),
  hour: ganzhiAt(3),
};

const birthData = {
  date: "2000-01-07",
  time: "12:00",
  calendarType: "solar",
  gender: "male",
} as const;

describe("unselected advanced methodologies", () => {
  it.each([
    ["strength", () => analyzeStrength(pillars)],
    ["daewoon", () => calculateDaewoon(birthData, pillars)],
    ["yongshin", () => analyzeYongshin(pillars)],
  ] as const)("rejects %s instead of inventing a result", (feature, calculate) => {
    try {
      calculate();
      throw new Error("Expected methodology error");
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(MethodologyDecisionRequiredError);
      expect((error as MethodologyDecisionRequiredError).feature).toBe(feature);
      expect((error as Error).message).toContain("unsupported until methodology is selected");
    }
  });
});
