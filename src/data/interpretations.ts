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
  wood: "성장 가능성을 중요하게 여기며, 방향이 정해지면 꾸준히 확장해 나가는 편으로 읽힙니다.",
  fire: "생각과 감정을 밖으로 표현할 때 활력이 살아나며, 의미 있다고 느끼는 일에 열정을 집중하는 편입니다.",
  earth: "안정적인 기반과 지속 가능성을 중요하게 여기며, 복잡한 상황을 정리해 중심을 잡으려는 편입니다.",
  metal: "분명한 기준과 완성도를 중요하게 여기며, 무엇을 남기고 덜어낼지 명확히 판단하려는 편입니다.",
  water: "상황의 흐름과 정보를 세심하게 살피며, 변화에 맞춰 생각의 방향을 유연하게 바꾸는 편입니다.",
};

export const PERSONALITY_YINYANG_TEXT: Readonly<Record<YinYang, string>> = {
  yin: "태어난 날을 나타내는 중심 글자가 음의 성질을 가집니다. 세부를 충분히 살피고 생각을 가다듬은 뒤 반응하는 편으로 읽힙니다.",
  yang: "태어난 날을 나타내는 중심 글자가 양의 성질을 가집니다. 상황에 직접 부딪치며 스스로 방향을 만들어 가는 편으로 읽힙니다.",
};

export const CAREER_ELEMENT_TEXT: Readonly<Record<Element, string>> = {
  wood: "일에서는 배울 기회와 성장 경로가 분명하고, 장기적으로 역할을 넓혀 갈 수 있는 환경이 잘 맞을 수 있습니다.",
  fire: "아이디어를 직접 표현하고 사람과 결과를 연결하는 역할에서 일의 동력을 얻기 쉽습니다.",
  earth: "운영이 안정적이고 책임 범위와 절차가 분명한 환경에서 강점을 발휘하기 좋습니다.",
  metal: "판단 기준이 명확하고 품질을 관리하거나 완성도를 높이는 역할과 잘 맞을 수 있습니다.",
  water: "정보를 탐색하고 전략을 세우며, 변화하는 상황에서 새로운 선택지를 찾는 역할에 강점이 있습니다.",
};

export const CAREER_TEN_GOD_GROUP_TEXT: Readonly<Record<TenGodGroup, string>> = {
  peer: "함께 일할 때는 결정권과 책임 범위를 먼저 나누는 편이 좋습니다. 서로 맡을 일을 분명히 하면 경쟁보다 협업의 장점이 살아납니다.",
  output: "생각을 말과 결과물로 표현할 수 있는 역할에서 만족감을 얻기 쉽습니다. 아이디어를 실제 작업으로 이어 갈 통로가 있는지 살펴보세요.",
  wealth: "목표와 자원을 현실적으로 관리하는 역할에서 강점이 드러날 수 있습니다. 예산과 일정, 성과 기준이 분명한 환경이 잘 맞습니다.",
  authority: "책임과 기준이 분명한 환경에서 능력을 발휘하기 쉽습니다. 맡은 책임만큼 결정 권한과 지원도 주어지는지 확인하세요.",
  resource: "배우고 분석하며 전문성을 쌓을 시간이 충분한 환경이 잘 맞습니다. 빠른 결론보다 충분한 검토가 필요한 역할에서 강점을 보일 수 있습니다.",
};

export const WEALTH_COUNT_TEXT: Readonly<Record<WealthCountBand, string>> = {
  none: "현재 계산에서는 돈과 자원을 다루는 성향이 강하게 강조되지는 않습니다. 재물운이 없다는 뜻은 아닙니다. 수입·지출·마감 기준을 눈에 보이게 정리하면 관리가 한결 쉬워집니다.",
  single: "돈과 자원을 현실적으로 관리하려는 성향이 한 부분에서 드러납니다. 관리 원칙을 한두 가지로 단순하게 정하고 꾸준히 지키는 방식이 잘 맞습니다.",
  multiple: "돈과 자원, 성과를 챙기려는 성향이 여러 부분에서 드러납니다. 기회가 많아질수록 어디까지 맡고 쓸지 한도를 먼저 정하는 편이 좋습니다.",
};

export const HEALTH_ELEMENT_TEXT: Readonly<Record<Element, string>> = {
  wood: "목은 성장과 움직임을 상징합니다. 무리하지 않고 몸을 움직이는 시간과 충분한 휴식이 번갈아 이어지는지 살펴보세요.",
  fire: "화는 활력과 표현을 상징합니다. 깊이 몰입한 뒤에는 반드시 회복할 시간을 남겨 두는 편이 좋습니다.",
  earth: "토는 안정과 생활의 기반을 상징합니다. 식사와 수면, 업무의 기본 리듬을 일정하게 유지하는 것이 중요합니다.",
  metal: "금은 경계와 정돈을 상징합니다. 긴장을 내려놓을 시간과 주변을 정리하는 습관을 함께 마련해 보세요.",
  water: "수는 회복과 유연한 흐름을 상징합니다. 충분히 쉬면서 상황에 맞게 속도를 조절할 여유를 남겨 두세요.",
};

export const FORTUNE_TEN_GOD_TEXT: Readonly<Record<TenGod, string>> = {
  비견: "이 시기에는 자기 기준과 주도성이 중요한 화두가 됩니다. 다른 사람과 협력할 일, 스스로 책임질 일을 분명히 나누면 방향을 잡기 쉽습니다.",
  겁재: "이 시기에는 경쟁과 자원 공유의 경계를 세심하게 살펴야 합니다. 즉흥적으로 약속하기보다 역할과 비용을 먼저 확인하세요.",
  식신: "이 시기에는 꾸준히 결과를 만들면서 생활의 여유도 지키는 일이 중요합니다. 작더라도 완성된 결과물을 계속 쌓아 가는 계획이 잘 맞습니다.",
  상관: "이 시기에는 익숙한 방식에 질문을 던지고 표현법을 바꿔 볼 수 있습니다. 문제를 말할 때 현실적인 대안도 함께 준비하면 설득력이 높아집니다.",
  편재: "이 시기에는 여러 기회와 자원의 이동이 눈에 들어올 수 있습니다. 선택지는 열어 두되, 쓸 수 있는 시간과 비용의 한도를 먼저 정하세요.",
  정재: "이 시기에는 예측 가능한 성과와 안정적인 자원 관리가 중요합니다. 예산과 일정을 반복해서 지킬 수 있는 기준으로 정리해 보세요.",
  편관: "이 시기에는 압박 속에서 실행력을 발휘할 일이 생길 수 있습니다. 부담을 떠안기 전에 책임에 맞는 권한과 지원이 있는지 확인하세요.",
  정관: "이 시기에는 역할과 규칙, 신뢰를 정돈하는 일이 중요합니다. 공식적인 기준과 실제로 맡은 책임이 서로 맞는지 살펴보세요.",
  편인: "이 시기에는 낯선 관점과 새로운 학습 방식에 관심이 갈 수 있습니다. 떠오른 아이디어를 시험하되 현실에 적용할 조건도 함께 확인하세요.",
  정인: "이 시기에는 배우고 지원받으며 기반을 단단히 다지는 일이 중요합니다. 오래 활용할 지식과 체계를 정리하는 데 시간을 써 보세요.",
};

export function rawElementCompositionText(most: string, least: string): string {
  return `계산된 글자를 목·화·토·금·수로 나누어 보면 가장 많은 오행은 ${most}, 가장 적은 오행은 ${least}입니다. 이 숫자만으로 사주 전체의 균형이나 자신에게 도움이 되는 기운을 정할 수는 없습니다.`;
}

export function healthMostRepresentedText(elements: readonly Element[]): string {
  const labels = elements.map((element) => ELEMENT_LABELS[element]).join("·");
  const prompts = elements.map((element) => HEALTH_ELEMENT_TEXT[element]).join(" ");
  return `계산된 글자에서 가장 많이 나타나는 오행은 ${labels}입니다. ${prompts}`;
}

export function healthLeastRepresentedText(elements: readonly Element[]): string {
  const labels = elements.map((element) => ELEMENT_LABELS[element]).join("·");
  return `가장 적게 나타나는 오행은 ${labels}입니다. 표에서 ${labels} 항목의 숫자가 가장 작지만, 이것이 몸에 문제가 있거나 특정 기능이 부족하다는 뜻은 아닙니다. 생활 습관을 한쪽에 치우치지 않게 살펴보는 참고로만 사용해 주세요.`;
}

export function relationshipBalanceText(balance: YinYangBalance, yin: number, yang: number): string {
  const counts = `계산된 글자를 음과 양으로 나누면 음은 ${yin}개, 양은 ${yang}개입니다.`;
  if (balance === "balanced") return `${counts} 두 성향이 균형을 이루므로 상황에 따라 경청과 주도 사이를 비교적 유연하게 오갈 수 있습니다. 다만 상대가 원하는 소통 방식을 말로 확인하는 과정은 필요합니다.`;
  if (balance === "yin-dominant") return `${counts} 음의 비중이 더 커서 생각을 충분히 정리한 뒤 관계에 반응하는 편입니다. 필요한 마음과 의사는 혼자 짐작하게 두지 말고 말로 전해 보세요.`;
  return `${counts} 양의 비중이 더 커서 관계에서 먼저 움직이고 방향을 제시하는 편입니다. 상대의 반응을 기다리고 함께 조율할 여백도 남겨 두는 것이 좋습니다.`;
}

export function fortunePeriodText(sajuYear: number, theme: string): string {
  return `사주에서 보는 ${sajuYear}년의 흐름은 입춘부터 이듬해 입춘 직전까지 이어집니다. ${theme}`;
}
