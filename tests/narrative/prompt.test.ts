import { describe, expect, it } from "vitest";
import { buildNarrativePrompt, NARRATIVE_SYSTEM_PROMPT } from "../../src/narrative/prompt";

describe("AI narrative prompt boundary", () => {
  it("forbids the model from calculating or inventing Saju values", () => {
    expect(NARRATIVE_SYSTEM_PROMPT).toContain("직접 계산·수정·추정하지 마세요");
    expect(NARRATIVE_SYSTEM_PROMPT).toContain("신강·신약, 용신·희신, 대운, 음력 변환을 만들어내지 마세요");
    expect(NARRATIVE_SYSTEM_PROMPT).toContain("관찰 confidence가 0인 특징을 실제 관찰처럼 설명하지 마세요");
    expect(NARRATIVE_SYSTEM_PROMPT).toContain("획수·음양·오행·길흉을 만들어내지 마세요");
  });

  it("delimits user questions from deterministic reading data", () => {
    const prompt = buildNarrativePrompt({
      profile: { name: "김결", hanjaName: "金結" },
      question: "관계에서 무엇을 점검할까요?",
      reading: { core: {} as never, sewoon: {} as never, interpretation: {} as never },
      integratedReading: { headline: "구조화된 통합 결과" } as never,
      nameResult: { mode: "personalization-only" } as never,
      palmResult: { mode: "mock" } as never,
    });
    expect(prompt).toContain('<user_profile>{"name":"김결","hanjaName":"金結"}</user_profile>');
    expect(prompt).toContain("<user_question>관계에서 무엇을 점검할까요?</user_question>");
    expect(prompt).toContain("<deterministic_reading>");
    expect(prompt).toContain('<integrated_reading>{"headline":"구조화된 통합 결과"}</integrated_reading>');
    expect(prompt).toContain('<structured_name_result>{"mode":"personalization-only"}</structured_name_result>');
    expect(prompt).toContain('<structured_palm_result>{"mode":"mock"}</structured_palm_result>');
  });
});
