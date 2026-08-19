import { interpretCareer } from "./career";
import { interpretFortune } from "./fortune";
import { interpretHealth } from "./health";
import { interpretPersonality } from "./personality";
import { interpretRelationship } from "./relationship";
import type { SajuInterpretation, SajuInterpretationInput } from "./types";
import { interpretWealth } from "./wealth";

const BASE_LIMITATIONS = [
  "이 결과는 엔터테인먼트와 자기성찰을 위한 규칙 기반 해석입니다.",
  "raw 오행 개수는 신강·신약, 용신·희신 또는 의학적 상태를 뜻하지 않습니다.",
  "신강·대운·용신과 합충·변형은 승인된 방법론이 없어 해석에 포함하지 않았습니다.",
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
      ? [...BASE_LIMITATIONS, "세운이 제공되지 않아 현재 시기 해석을 생성하지 않았습니다."]
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
