import type { PalmAnalysisInput, PalmAnalyzer, PalmHandResult, PalmLineResult, PalmResult } from "./types";

const MOCK_OBSERVATION = "MOCK: 사진 입력은 확인했지만 실제 영상 판독은 수행하지 않았습니다.";

const LINE_COPY = {
  heartLine: {
    traditionalMeaning: "전통 손금 해석에서는 감정선의 형태를 감정 표현과 관계 태도를 살펴보는 상징으로 사용하기도 합니다.",
    interpretation: "실제 선의 특징이 관찰된 뒤, 관계에서 중요하게 여기는 기준을 돌아보는 참고 관점으로 활용할 수 있습니다.",
  },
  headLine: {
    traditionalMeaning: "전통 손금 해석에서는 두뇌선의 형태를 사고 방식과 판단 습관을 살펴보는 상징으로 사용하기도 합니다.",
    interpretation: "실제 선의 특징이 관찰된 뒤, 결정을 내릴 때 사용하는 정보와 기준을 점검해볼 수 있습니다.",
  },
  lifeLine: {
    traditionalMeaning: "전통 손금 해석에서는 생명선을 수명 예측이 아니라 생활 리듬과 활력의 상징으로 읽기도 합니다.",
    interpretation: "실제 선의 특징이 관찰된 뒤, 현재의 휴식과 활동 균형을 돌아보는 참고 관점으로 활용할 수 있습니다.",
  },
  fateLine: {
    traditionalMeaning: "전통 손금 해석에서는 운명선의 형태를 사회적 역할과 일의 방향을 살펴보는 상징으로 사용하기도 합니다.",
    interpretation: "실제 선의 특징이 관찰된 뒤, 지금 선택할 수 있는 역할과 우선순위를 생각해볼 수 있습니다.",
  },
} as const;

export const mockPalmAnalyzer: PalmAnalyzer = {
  async analyze(input: PalmAnalysisInput): Promise<PalmResult> {
    const hasLeft = input.leftPalmUrl !== undefined;
    const hasRight = input.rightPalmUrl !== undefined;
    const inputSummary = hasLeft && hasRight ? "왼손과 오른손" : hasLeft ? "왼손" : hasRight ? "오른손" : "손바닥 사진 없음";

    return {
      mode: "mock",
      ...(hasLeft ? { leftHand: mockHandResult() } : {}),
      ...(hasRight ? { rightHand: mockHandResult() } : {}),
      summary: `${inputSummary} 이미지를 분석 입력으로 전달했습니다. 현재 mock은 실제 손금 특징을 판독하지 않습니다.`,
      limitations: [
        "현재 결과는 Palm Analyzer 연결 구조를 검증하기 위한 mock입니다.",
        "관찰 confidence 0은 해석의 정확도가 아니라 실제 이미지 관찰이 아직 수행되지 않았음을 뜻합니다.",
      ],
    };
  },
};

function mockHandResult(): PalmHandResult {
  return {
    heartLine: mockLineResult("heartLine"),
    headLine: mockLineResult("headLine"),
    lifeLine: mockLineResult("lifeLine"),
    fateLine: mockLineResult("fateLine"),
  };
}

function mockLineResult(line: keyof typeof LINE_COPY): PalmLineResult {
  return {
    observedFeatures: MOCK_OBSERVATION,
    traditionalMeaning: LINE_COPY[line].traditionalMeaning,
    interpretation: LINE_COPY[line].interpretation,
    confidence: 0,
  };
}
