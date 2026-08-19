import { describe, expect, it } from "vitest";
import { ganzhiAt, ganzhiName } from "../../src/engine/saju/ganzhi";

describe("sexagenary cycle", () => {
  it("wraps all 60 combinations", () => {
    expect(ganzhiName(ganzhiAt(0))).toBe("甲子");
    expect(ganzhiName(ganzhiAt(59))).toBe("癸亥");
    expect(ganzhiName(ganzhiAt(60))).toBe("甲子");
    expect(new Set(Array.from({ length: 60 }, (_, index) => ganzhiName(ganzhiAt(index)))).size).toBe(60);
  });
});

