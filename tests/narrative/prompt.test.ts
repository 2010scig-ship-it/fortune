import { describe, expect, it } from "vitest";
import { buildNarrativePrompt, NARRATIVE_SYSTEM_PROMPT } from "../../src/narrative/prompt";

describe("AI narrative prompt boundary", () => {
  it("forbids the model from calculating or inventing Saju values", () => {
    expect(NARRATIVE_SYSTEM_PROMPT).toContain("직접 계산·수정·추정하지 마세요");
    expect(NARRATIVE_SYSTEM_PROMPT).toContain("신강·신약, 용신·희신, 대운, 음력 변환을 만들어내지 마세요");
  });

  it("delimits user questions from deterministic reading data", () => {
    const prompt = buildNarrativePrompt({
      question: "관계에서 무엇을 점검할까요?",
      reading: { core: {} as never, sewoon: {} as never, interpretation: {} as never },
    });
    expect(prompt).toContain("<user_question>관계에서 무엇을 점검할까요?</user_question>");
    expect(prompt).toContain("<deterministic_reading>");
  });
});
