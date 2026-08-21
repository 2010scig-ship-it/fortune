import { describe, expect, it } from "vitest";
import { addTarotReading, createSajuReading } from "../../src/application/reading";
import { mockNameAnalyzer } from "../../src/engine/name";
import { mockPalmAnalyzer } from "../../src/engine/palm";
import { createIntegratedReading } from "../../src/interpretation/integrated";

const birth = {
  date: "1995-05-15",
  time: "12:00",
  calendarType: "solar" as const,
  gender: "female" as const,
  location: { country: "KR", city: "Seoul", timezone: "Asia/Seoul" },
};

function makeReading() {
  const saju = createSajuReading(birth, () => Date.parse("2026-08-21T06:00:00.000Z"));
  return addTarotReading(saju, "three-guidance", "career", () => 0.314159);
}

describe("phase 5 integrated reading", () => {
  it("combines structured results without treating mock name or palm data as observed evidence", async () => {
    const reading = makeReading();
    const name = mockNameAnalyzer.analyze({ name: "김결", hanjaName: "金結" });
    const palm = await mockPalmAnalyzer.analyze({ leftPalmUrl: "blob:left" });

    const result = createIntegratedReading({
      profile: { name: "김결", hanjaName: "金結" },
      question: { category: "일과 진로", text: "지금 하는 일을 이어갈 때 무엇을 먼저 확인해야 할까요?" },
      saju: reading,
      name,
      tarot: reading.tarot,
      palm,
    });

    expect(result.methodology).toBe("phase-5-integrated-reading-v1");
    expect(result.headline).toContain("김결");
    expect(result.sajuSection.details.length).toBeGreaterThan(0);
    expect(result.tarotSection.details).toHaveLength(3);
    expect(result.nameSection.summary).toBe(name.summary);
    expect(result.sourceStatus).toEqual({
      saju: "rule-based",
      name: "mock-unobserved",
      tarot: "rule-based",
      palm: "mock-unobserved",
    });
    expect(result.palmSection.details.join(" ")).toContain("검증된 이미지 관찰이 없습니다");
    expect(result.divergence.join(" ")).toContain("Palm mock은 실제 이미지 특징을 관찰하지 않으므로");
    expect(result.actionGuide.length).toBeGreaterThan(0);
    expect(result.journalPrompt).toContain("이미 알고 있는 사실");
    expect(JSON.stringify(result.evidence)).not.toContain("MOCK:");
  });

  it("makes an omitted palm source explicit instead of inventing a result", () => {
    const reading = makeReading();
    const result = createIntegratedReading({
      profile: { name: "김결" },
      question: { category: "나 자신", text: "지금의 우선순위는 무엇일까요?" },
      saju: reading,
      name: mockNameAnalyzer.analyze({ name: "김결" }),
      tarot: reading.tarot,
    });

    expect(result.sourceStatus.palm).toBe("not-provided");
    expect(result.palmSection.summary).toContain("제공하지 않아");
    expect(result.divergence).toContain("Palm 입력이 없어 손금 신호는 비교하지 않았습니다.");
  });
});
