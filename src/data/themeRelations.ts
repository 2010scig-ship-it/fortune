import type { Theme } from "../interpretation/themes";

export type ThemeRelationKind = "complement" | "tension";

export interface ThemeRelationDefinition {
  readonly id: string;
  readonly kind: ThemeRelationKind;
  readonly left: Theme;
  readonly right: Theme;
  readonly explanation: string;
}

export const THEME_RELATIONS = [
  { id: "complement-opportunity-caution", kind: "complement", left: "OPPORTUNITY", right: "CAUTION", explanation: "가능성을 살피되 조건과 위험을 함께 확인하라는 보완 신호입니다." },
  { id: "complement-expansion-stability", kind: "complement", left: "EXPANSION", right: "STABILITY", explanation: "확장 의지와 지속 가능한 기반을 함께 설계하라는 보완 신호입니다." },
  { id: "complement-independence-relationship", kind: "complement", left: "INDEPENDENCE", right: "RELATIONSHIP", explanation: "자기 기준과 관계의 조율을 함께 고려하라는 보완 신호입니다." },
  { id: "complement-change-learning", kind: "complement", left: "CHANGE", right: "LEARNING", explanation: "변화를 추진하기 전에 배우고 검증하는 과정이 도움 될 수 있다는 보완 신호입니다." },
  { id: "complement-career-learning", kind: "complement", left: "CAREER", right: "LEARNING", explanation: "업무 선택과 역량 축적을 연결해 살펴보라는 보완 신호입니다." },
  { id: "complement-money-caution", kind: "complement", left: "MONEY", right: "CAUTION", explanation: "자원 기회와 손실 한도·검토 기준을 함께 보라는 보완 신호입니다." },
  { id: "complement-leadership-relationship", kind: "complement", left: "LEADERSHIP", right: "RELATIONSHIP", explanation: "주도권과 협의 과정을 균형 있게 배치하라는 보완 신호입니다." },
  { id: "tension-change-stability", kind: "tension", left: "CHANGE", right: "STABILITY", explanation: "변화 속도와 기존 기반 유지 사이의 우선순위를 조정할 필요가 있다는 긴장 신호입니다." },
  { id: "tension-expansion-rest", kind: "tension", left: "EXPANSION", right: "REST", explanation: "더 넓히려는 흐름과 회복이 필요한 흐름이 함께 있어 속도 조절이 필요하다는 긴장 신호입니다." },
  { id: "tension-conflict-stability", kind: "tension", left: "CONFLICT", right: "STABILITY", explanation: "문제를 드러내는 과정과 안정 유지 사이에서 대응 순서를 정할 필요가 있다는 긴장 신호입니다." },
  { id: "tension-career-rest", kind: "tension", left: "CAREER", right: "REST", explanation: "업무 추진과 회복 시간 사이의 경계를 점검할 필요가 있다는 긴장 신호입니다." },
  { id: "tension-leadership-rest", kind: "tension", left: "LEADERSHIP", right: "REST", explanation: "책임을 맡는 흐름과 에너지를 보존하는 흐름 사이의 범위를 조정할 필요가 있다는 긴장 신호입니다." },
  { id: "tension-independence-stability", kind: "tension", left: "INDEPENDENCE", right: "STABILITY", explanation: "독립적인 선택과 기존 구조 유지 사이의 현실적인 절충점을 찾을 필요가 있다는 긴장 신호입니다." },
] as const satisfies readonly ThemeRelationDefinition[];
