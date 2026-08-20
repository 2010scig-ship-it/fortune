import type { NameAnalyzer, NameResult } from "./types";

export const mockNameAnalyzer: NameAnalyzer = {
  analyze(input): NameResult {
    const displayName = input.name.trim();
    const hanjaName = input.hanjaName?.trim();
    if (!hanjaName) {
      return {
        displayName,
        mode: "personalization-only",
        summary: `${displayName}님이라는 이름을 리딩의 호칭과 질문 맥락에 반영했습니다.`,
        observations: ["한자 이름을 입력하지 않아 이름의 획수·음양·오행은 계산하지 않았습니다."],
        limitations: ["현재 결과는 이름을 활용한 개인화이며 정식 성명학 분석이 아닙니다."],
      };
    }

    return {
      displayName,
      hanjaName,
      mode: "mock-hanja-structure",
      summary: `${displayName}(${hanjaName})님이 입력한 한글 이름과 한자 이름을 함께 기록했습니다.`,
      observations: ["한자 이름의 존재를 확인했으며, 상세 분석을 연결할 수 있는 구조를 준비했습니다."],
      limitations: ["획수·음양·오행 계산은 아직 연결하지 않았습니다. 현재 내용은 정식 성명학 결과가 아닙니다."],
    };
  },
};
