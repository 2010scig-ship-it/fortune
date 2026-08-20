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
  { id: "complement-opportunity-caution", kind: "complement", left: "OPPORTUNITY", right: "CAUTION", explanation: "기회가 보여도 바로 결정하기보다, 필요한 조건과 감당할 위험을 먼저 확인해 보세요." },
  { id: "complement-expansion-stability", kind: "complement", left: "EXPANSION", right: "STABILITY", explanation: "새 일을 늘리기 전에 지금 가진 시간과 체력이 버틸 수 있는지 먼저 살펴보세요." },
  { id: "complement-independence-relationship", kind: "complement", left: "INDEPENDENCE", right: "RELATIONSHIP", explanation: "내 기준을 지키되, 함께하는 사람과 기대와 역할을 미리 맞춰 보세요." },
  { id: "complement-change-learning", kind: "complement", left: "CHANGE", right: "LEARNING", explanation: "바꾸고 싶은 것이 있다면 작게 시험하고 배운 뒤 다음 단계로 넘어가세요." },
  { id: "complement-career-learning", kind: "complement", left: "CAREER", right: "LEARNING", explanation: "진로를 고를 때 당장의 조건뿐 아니라, 그 일을 통해 어떤 능력을 쌓을 수 있는지도 살펴보세요." },
  { id: "complement-money-caution", kind: "complement", left: "MONEY", right: "CAUTION", explanation: "수익 가능성만 보지 말고, 잃어도 감당할 수 있는 범위와 중단 기준을 먼저 정하세요." },
  { id: "complement-leadership-relationship", kind: "complement", left: "LEADERSHIP", right: "RELATIONSHIP", explanation: "혼자 방향을 정하기보다, 영향을 받는 사람과 충분히 상의한 뒤 결정하세요." },
  { id: "tension-change-stability", kind: "tension", left: "CHANGE", right: "STABILITY", explanation: "변화를 서두르면 기존의 안정이 흔들릴 수 있습니다. 한 번에 바꾸기보다 지켜야 할 것을 먼저 정하세요." },
  { id: "tension-expansion-rest", kind: "tension", left: "EXPANSION", right: "REST", explanation: "더 많은 일을 하고 싶은 마음과 쉬어야 할 필요가 함께 보입니다. 새 일을 늘리기 전에 회복 시간을 확보하세요." },
  { id: "tension-conflict-stability", kind: "tension", left: "CONFLICT", right: "STABILITY", explanation: "문제를 바로 꺼내는 것과 관계의 안정을 지키는 것 사이에 균형이 필요합니다. 먼저 대화의 순서와 표현을 정하세요." },
  { id: "tension-career-rest", kind: "tension", left: "CAREER", right: "REST", explanation: "일을 밀어붙이는 힘과 쉬어야 할 필요가 함께 보입니다. 업무 시간과 회복 시간의 경계를 분명히 하세요." },
  { id: "tension-leadership-rest", kind: "tension", left: "LEADERSHIP", right: "REST", explanation: "책임을 맡을수록 에너지가 빠르게 소모될 수 있습니다. 혼자 감당하지 말고 나눌 일을 정하세요." },
  { id: "tension-independence-stability", kind: "tension", left: "INDEPENDENCE", right: "STABILITY", explanation: "내 방식대로 바꾸고 싶은 마음과 현재 기반을 지켜야 할 필요가 함께 있습니다. 되돌릴 수 있는 작은 선택부터 시작하세요." },
] as const satisfies readonly ThemeRelationDefinition[];
