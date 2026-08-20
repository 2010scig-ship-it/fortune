import { interpretCareer } from "./career";
import { interpretFortune } from "./fortune";
import { interpretHealth } from "./health";
import { interpretPersonality } from "./personality";
import { interpretRelationship } from "./relationship";
import type { SajuInterpretation, SajuInterpretationInput } from "./types";
import { interpretWealth } from "./wealth";

const BASE_LIMITATIONS = [
  "이 결과는 엔터테인먼트와 자기성찰을 위한 규칙 기반 해석입니다.",
  "오행 숫자는 계산된 글자의 단순한 개수이며, 사주 전체의 균형이나 건강 상태를 판단하지 않습니다.",
  "전체 기운의 강약, 자신에게 도움이 되는 오행, 10년 단위의 흐름 등은 방법론을 정하지 않아 제공하지 않습니다.",
  "의료·법률·투자 등 중요한 결정은 이 결과만으로 판단하지 않아야 합니다.",
] as const;

export function interpretSaju(input: SajuInterpretationInput): SajuInterpretation {
  return {
    methodology: "phase-3-rule-based-v1",
    categories: {
      personality: interpretPersonality(input),
      career: interpretCareer(input),
      wealth: interpretWealth(input),
      relationship: interpretRelationship(input),
      health: interpretHealth(input),
      fortune: interpretFortune(input),
    },
    limitations: input.sewoon === undefined
      ? [...BASE_LIMITATIONS, "올해의 흐름을 계산할 자료가 없어 현재 시기 해석은 제공하지 않습니다."]
      : BASE_LIMITATIONS,
  };
}

export * from "./career";
export * from "./fortune";
export * from "./health";
export * from "./personality";
export * from "./relationship";
export * from "./rules";
export * from "./types";
export * from "./wealth";
