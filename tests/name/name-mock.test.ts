import { describe, expect, it } from "vitest";
import { mockNameAnalyzer } from "../../src/engine/name";

describe("mock name analyzer", () => {
  it("uses a Hangul-only name for personalization without claiming formal analysis", () => {
    const result = mockNameAnalyzer.analyze({ name: "김결" });
    expect(result.mode).toBe("personalization-only");
    expect(result.summary).toContain("김결님");
    expect(result.observations.join(" ")).toContain("계산하지 않았습니다");
    expect(result.limitations.join(" ")).toContain("정식 성명학 분석이 아닙니다");
  });

  it("records a Hanja name but leaves stroke and element calculations unsupported", () => {
    const result = mockNameAnalyzer.analyze({ name: "김결", hanjaName: "金結" });
    expect(result.mode).toBe("mock-hanja-structure");
    expect(result.hanjaName).toBe("金結");
    expect(result.limitations.join(" ")).toContain("획수·음양·오행 계산은 아직 연결하지 않았습니다");
    expect(result.limitations.join(" ")).not.toMatch(/완료|정식 성명학 결과입니다/);
  });
});
