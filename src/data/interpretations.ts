import type { Element, TenGod, YinYang } from "../engine/saju/types";

export type TenGodGroup = "peer" | "output" | "wealth" | "authority" | "resource";
export type WealthCountBand = "none" | "single" | "multiple";
export type YinYangBalance = "yin-dominant" | "balanced" | "yang-dominant";

export const ELEMENT_LABELS: Readonly<Record<Element, string>> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

export const PERSONALITY_ELEMENT_TEXT: Readonly<Record<Element, string>> = {
  wood: "성장과 확장을 중시하고, 방향이 보이면 꾸준히 발전시키려는 경향으로 해석할 수 있습니다.",
  fire: "표현과 교류에서 에너지가 드러나며, 의미 있는 일에 열의를 집중하는 경향으로 해석할 수 있습니다.",
  earth: "안정적인 기반과 지속 가능성을 살피고, 상황을 정리해 중심을 잡으려는 경향으로 해석할 수 있습니다.",
  metal: "기준과 완성도를 중요하게 여기고, 무엇을 남기고 덜어낼지 분명히 하려는 경향으로 해석할 수 있습니다.",
  water: "정보와 흐름을 관찰하고, 변화에 맞춰 사고의 경로를 유연하게 조정하는 경향으로 해석할 수 있습니다.",
};

export const PERSONALITY_YINYANG_TEXT: Readonly<Record<YinYang, string>> = {
  yin: "일간의 음적 성향은 세부를 살피고 내적으로 숙성한 뒤 반응하는 방식에 조금 더 무게를 둘 수 있습니다.",
  yang: "일간의 양적 성향은 외부와 직접 부딪치며 방향을 만들고 반응하는 방식에 조금 더 무게를 둘 수 있습니다.",
};

export const CAREER_ELEMENT_TEXT: Readonly<Record<Element, string>> = {
  wood: "업무에서는 성장 경로, 학습 기회, 장기적인 확장 가능성이 분명한 환경을 점검해보는 것이 도움이 될 수 있습니다.",
  fire: "업무에서는 아이디어를 표현하고 사람과 결과를 연결할 수 있는 역할이 동기를 유지하는 데 도움이 될 수 있습니다.",
  earth: "업무에서는 운영의 안정성, 책임 범위, 지속 가능한 절차가 갖춰졌는지 살펴보는 것이 도움이 될 수 있습니다.",
  metal: "업무에서는 명확한 기준, 품질 관리, 판단 권한이 있는 역할이 잘 맞는지 검토해볼 수 있습니다.",
  water: "업무에서는 정보 탐색, 전략, 변화 대응처럼 흐름을 읽고 선택지를 넓히는 역할을 검토해볼 수 있습니다.",
};

export const CAREER_TEN_GOD_GROUP_TEXT: Readonly<Record<TenGodGroup, string>> = {
  peer: "표면 천간에서는 동료성 십성이 상대적으로 두드러집니다. 협업 범위와 독립적으로 결정할 범위를 미리 나누는 방식이 도움이 될 수 있습니다.",
  output: "표면 천간에서는 표현·산출 십성이 상대적으로 두드러집니다. 아이디어를 실제 결과물로 보여줄 통로가 있는지 점검해볼 수 있습니다.",
  wealth: "표면 천간에서는 자원·성과 관리 십성이 상대적으로 두드러집니다. 목표와 자원 배분 기준이 구체적인 업무 환경을 살펴볼 수 있습니다.",
  authority: "표면 천간에서는 책임·규범 십성이 상대적으로 두드러집니다. 권한과 책임, 평가 기준이 서로 일치하는지 확인하는 것이 도움이 될 수 있습니다.",
  resource: "표면 천간에서는 학습·지원 십성이 상대적으로 두드러집니다. 전문성을 축적하고 검토할 시간이 보장되는 환경을 살펴볼 수 있습니다.",
};

export const WEALTH_COUNT_TEXT: Readonly<Record<WealthCountBand, string>> = {
  none: "표면 천간에서 재성은 확인되지 않습니다. 이는 재물의 유무를 뜻하지 않으며, 예산·기한·성과 기준을 의식적으로 가시화하는 습관을 점검해볼 수 있습니다.",
  single: "표면 천간에서 재성이 한 곳 확인됩니다. 자원 관리의 기준을 한두 가지 핵심 원칙으로 단순화해 꾸준히 적용하는 방식을 검토해볼 수 있습니다.",
  multiple: "표면 천간에서 재성이 여러 곳 확인됩니다. 기회와 책임이 함께 늘어날 수 있으므로 자원 배분 기준과 감당 가능한 범위를 먼저 정하는 것이 도움이 될 수 있습니다.",
};

export const RELATIONSHIP_BALANCE_TEXT: Readonly<Record<YinYangBalance, string>> = {
  "yin-dominant": "표면 글자에서는 음의 비중이 더 큽니다. 관계에서 생각을 충분히 정리하는 장점과 함께, 필요한 의사를 말로 확인하는 과정을 의식해볼 수 있습니다.",
  balanced: "표면 글자의 음양 수가 균형을 이룹니다. 상황에 따라 경청과 주도 사이를 전환하되, 상대가 기대하는 소통 방식을 확인하는 것이 도움이 될 수 있습니다.",
  "yang-dominant": "표면 글자에서는 양의 비중이 더 큽니다. 관계에서 먼저 움직이는 장점과 함께, 상대의 반응을 기다리고 조율하는 여백을 점검해볼 수 있습니다.",
};

export const HEALTH_ELEMENT_TEXT: Readonly<Record<Element, string>> = {
  wood: "목은 상징적으로 성장과 활동 리듬을 나타냅니다. 일상에서는 무리 없는 움직임과 휴식의 주기를 점검해볼 수 있습니다.",
  fire: "화는 상징적으로 활력과 표현 리듬을 나타냅니다. 일상에서는 과도한 몰입 뒤의 회복 시간을 확보하는지 점검해볼 수 있습니다.",
  earth: "토는 상징적으로 안정과 생활 기반을 나타냅니다. 일상에서는 식사·수면·업무의 기본 리듬을 일정하게 유지하는지 살펴볼 수 있습니다.",
  metal: "금은 상징적으로 경계와 정돈을 나타냅니다. 일상에서는 긴장을 풀 시간과 환경을 정리하는 습관을 함께 살펴볼 수 있습니다.",
  water: "수는 상징적으로 회복과 유연한 흐름을 나타냅니다. 일상에서는 충분히 쉬고 속도를 조절할 여유를 확보하는지 점검해볼 수 있습니다.",
};

export const FORTUNE_TEN_GOD_TEXT: Readonly<Record<TenGod, string>> = {
  비견: "이 세운은 자기 기준과 주도성을 점검하는 테마로 해석할 수 있습니다. 협력할 일과 직접 책임질 일을 구분해보는 것이 도움이 될 수 있습니다.",
  겁재: "이 세운은 경쟁과 자원 공유의 경계를 점검하는 테마로 해석할 수 있습니다. 충동적인 약속보다 역할과 비용을 먼저 확인해볼 수 있습니다.",
  식신: "이 세운은 꾸준한 산출과 생활의 여유를 만드는 테마로 해석할 수 있습니다. 작은 결과물을 지속적으로 쌓는 계획이 도움이 될 수 있습니다.",
  상관: "이 세운은 기존 방식을 질문하고 표현을 바꾸는 테마로 해석할 수 있습니다. 문제 제기와 대안을 함께 준비하는 접근을 검토해볼 수 있습니다.",
  편재: "이 세운은 다양한 기회와 자원 이동을 살피는 테마로 해석할 수 있습니다. 선택지를 넓히되 시간과 비용의 상한을 먼저 정하는 것이 도움이 될 수 있습니다.",
  정재: "이 세운은 예측 가능한 성과와 자원 관리를 점검하는 테마로 해석할 수 있습니다. 예산과 일정의 반복 가능한 기준을 만드는 데 초점을 둘 수 있습니다.",
  편관: "이 세운은 압박 속의 실행력과 책임 범위를 점검하는 테마로 해석할 수 있습니다. 무리한 부담을 떠안기 전에 권한과 지원 조건을 확인해볼 수 있습니다.",
  정관: "이 세운은 역할, 규칙, 신뢰를 정돈하는 테마로 해석할 수 있습니다. 공식적인 기준과 실제 책임이 일치하는지 살펴보는 것이 도움이 될 수 있습니다.",
  편인: "이 세운은 새로운 관점과 비정형 학습을 탐색하는 테마로 해석할 수 있습니다. 아이디어를 시험하되 현실 적용 조건을 함께 확인해볼 수 있습니다.",
  정인: "이 세운은 학습, 지원, 기반 강화를 점검하는 테마로 해석할 수 있습니다. 장기적으로 남을 지식과 체계를 정리하는 데 시간을 배분해볼 수 있습니다.",
};

export function rawElementCompositionText(most: string, least: string): string {
  return `표면 글자의 단순 오행 집계에서는 ${most}이(가) 가장 많이, ${least}이(가) 가장 적게 나타납니다. 이는 구성의 관찰값이며 신강·신약이나 용신 판단을 뜻하지 않습니다.`;
}

export function healthMostRepresentedText(elements: readonly Element[]): string {
  const labels = elements.map((element) => ELEMENT_LABELS[element]).join("·");
  const prompts = elements.map((element) => HEALTH_ELEMENT_TEXT[element]).join(" ");
  return `표면 글자에서 ${labels}이(가) 상대적으로 많이 나타납니다. ${prompts}`;
}

export function healthLeastRepresentedText(elements: readonly Element[]): string {
  const labels = elements.map((element) => ELEMENT_LABELS[element]).join("·");
  return `표면 글자에서 ${labels}이(가) 상대적으로 적게 나타납니다. 이것은 의학적 결핍을 뜻하지 않으며, 생활 리듬을 여러 방향에서 균형 있게 점검해보라는 상징적 참고로만 사용할 수 있습니다.`;
}

export function fortunePeriodText(sajuYear: number, theme: string): string {
  return `${sajuYear} 세운의 입춘부터 다음 입춘 전까지 ${theme}`;
}
