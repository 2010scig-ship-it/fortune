import { describe, expect, it } from "vitest";
import { HEAVENLY_STEMS } from "../../src/data/heavenlyStems";
import { calculateTenGod } from "../../src/engine/saju/tenGods";

describe("ten gods", () => {
  const expectedByDayMaster = [
    ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"],
    ["겁재", "비견", "상관", "식신", "정재", "편재", "정관", "편관", "정인", "편인"],
    ["편인", "정인", "비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관"],
    ["정인", "편인", "겁재", "비견", "상관", "식신", "정재", "편재", "정관", "편관"],
    ["편관", "정관", "편인", "정인", "비견", "겁재", "식신", "상관", "편재", "정재"],
    ["정관", "편관", "정인", "편인", "겁재", "비견", "상관", "식신", "정재", "편재"],
    ["편재", "정재", "편관", "정관", "편인", "정인", "비견", "겁재", "식신", "상관"],
    ["정재", "편재", "정관", "편관", "정인", "편인", "겁재", "비견", "상관", "식신"],
    ["식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인", "비견", "겁재"],
    ["상관", "식신", "정재", "편재", "정관", "편관", "정인", "편인", "겁재", "비견"],
  ] as const;

  it.each(HEAVENLY_STEMS.map((stem, index) => [stem.name, index] as const))(
    "%s 일간의 천간 10개 관계를 명시적 기준표와 대조한다",
    (_name, dayMasterIndex) => {
      const actual = HEAVENLY_STEMS.map((target) => calculateTenGod(HEAVENLY_STEMS[dayMasterIndex]!, target));
      expect(actual).toEqual(expectedByDayMaster[dayMasterIndex]);
    },
  );

  it("therefore covers all 100 day-master/target pairs", () => {
    expect(expectedByDayMaster.flat()).toHaveLength(100);
  });
});
