import type { TarotCard, TarotRank, TarotSuit } from "../engine/tarot/types";
import type { Theme } from "../interpretation/themes";

export interface TarotThemeMapping {
  readonly upright: readonly Theme[];
  readonly reversed: readonly Theme[];
}

interface CardWithThemes {
  readonly card: TarotCard;
  readonly themes: TarotThemeMapping;
}

interface MajorDefinition {
  readonly slug: string;
  readonly number: number;
  readonly name: string;
  readonly upright: readonly string[];
  readonly reversed: readonly string[];
  readonly themes: readonly Theme[];
}

const MAJOR_DEFINITIONS = [
  { slug: "fool", number: 0, name: "The Fool", upright: ["새로운 출발", "열린 가능성"], reversed: ["준비 없는 도약", "방향 점검"], themes: ["OPPORTUNITY", "CHANGE", "INDEPENDENCE"] },
  { slug: "magician", number: 1, name: "The Magician", upright: ["의지의 집중", "도구의 활용"], reversed: ["분산된 역량", "의도와 실행의 불일치"], themes: ["OPPORTUNITY", "LEADERSHIP"] },
  { slug: "high-priestess", number: 2, name: "The High Priestess", upright: ["직관적 관찰", "드러나지 않은 정보"], reversed: ["내면 신호의 혼선", "성급한 공개"], themes: ["LEARNING", "REST", "CAUTION"] },
  { slug: "empress", number: 3, name: "The Empress", upright: ["돌봄과 풍요", "창조적 성장"], reversed: ["과도한 돌봄", "성장의 정체"], themes: ["EXPANSION", "RELATIONSHIP"] },
  { slug: "emperor", number: 4, name: "The Emperor", upright: ["구조와 책임", "명확한 경계"], reversed: ["경직된 통제", "책임 구조의 혼란"], themes: ["LEADERSHIP", "STABILITY"] },
  { slug: "hierophant", number: 5, name: "The Hierophant", upright: ["전통과 학습", "공유된 기준"], reversed: ["낡은 규칙의 재검토", "형식과 의미의 충돌"], themes: ["LEARNING", "STABILITY"] },
  { slug: "lovers", number: 6, name: "The Lovers", upright: ["가치에 따른 선택", "관계의 조화"], reversed: ["가치의 불일치", "선택 회피"], themes: ["RELATIONSHIP", "OPPORTUNITY"] },
  { slug: "chariot", number: 7, name: "The Chariot", upright: ["방향 있는 추진", "의지의 통합"], reversed: ["속도 조절 필요", "엇갈린 동기"], themes: ["CAREER", "LEADERSHIP", "CHANGE"] },
  { slug: "strength", number: 8, name: "Strength", upright: ["차분한 용기", "지속적인 자기조절"], reversed: ["자신감의 흔들림", "에너지 소진"], themes: ["STABILITY", "LEADERSHIP"] },
  { slug: "hermit", number: 9, name: "The Hermit", upright: ["성찰과 탐색", "혼자만의 정리"], reversed: ["고립의 장기화", "답을 피하는 후퇴"], themes: ["REST", "LEARNING", "INDEPENDENCE"] },
  { slug: "wheel-of-fortune", number: 10, name: "Wheel of Fortune", upright: ["흐름의 전환", "새로운 주기"], reversed: ["변화에 대한 저항", "반복되는 패턴"], themes: ["CHANGE", "OPPORTUNITY"] },
  { slug: "justice", number: 11, name: "Justice", upright: ["균형 있는 판단", "결과에 대한 책임"], reversed: ["불균형한 기준", "판단 자료의 부족"], themes: ["STABILITY", "CAUTION"] },
  { slug: "hanged-man", number: 12, name: "The Hanged Man", upright: ["관점의 전환", "의도적인 멈춤"], reversed: ["의미 없는 지연", "놓지 못하는 상태"], themes: ["REST", "CHANGE", "LEARNING"] },
  { slug: "death", number: 13, name: "Death", upright: ["단계의 마무리", "근본적인 전환"], reversed: ["끝맺음에 대한 저항", "변화의 지연"], themes: ["CHANGE"] },
  { slug: "temperance", number: 14, name: "Temperance", upright: ["조율과 통합", "지속 가능한 속도"], reversed: ["균형의 흔들림", "극단적인 접근"], themes: ["STABILITY", "REST"] },
  { slug: "devil", number: 15, name: "The Devil", upright: ["집착의 구조", "선택을 제한하는 습관"], reversed: ["구속의 인식", "패턴에서 벗어날 기회"], themes: ["CONFLICT", "CAUTION"] },
  { slug: "tower", number: 16, name: "The Tower", upright: ["갑작스러운 구조 변화", "숨겨진 문제의 노출"], reversed: ["변화의 충격 완화", "필요한 재정비의 지연"], themes: ["CHANGE", "CONFLICT", "CAUTION"] },
  { slug: "star", number: 17, name: "The Star", upright: ["회복의 방향", "조용한 희망"], reversed: ["기대의 약화", "회복 자원의 재점검"], themes: ["OPPORTUNITY", "REST"] },
  { slug: "moon", number: 18, name: "The Moon", upright: ["불확실한 신호", "감정과 직관의 움직임"], reversed: ["혼란의 일부 해소", "두려움의 실체 점검"], themes: ["CAUTION", "LEARNING"] },
  { slug: "sun", number: 19, name: "The Sun", upright: ["명료함과 활력", "성과의 공유"], reversed: ["기대 조정", "기쁨을 가리는 피로"], themes: ["EXPANSION", "OPPORTUNITY"] },
  { slug: "judgement", number: 20, name: "Judgement", upright: ["과거의 재평가", "새로운 결론"], reversed: ["결정의 연기", "자기평가의 왜곡"], themes: ["CHANGE", "LEARNING"] },
  { slug: "world", number: 21, name: "The World", upright: ["주기의 완성", "더 넓은 연결"], reversed: ["마무리 직전의 공백", "완결 조건의 재점검"], themes: ["EXPANSION", "STABILITY"] },
] as const satisfies readonly MajorDefinition[];

interface SuitProfile {
  readonly id: TarotSuit;
  readonly name: string;
  readonly upright: string;
  readonly reversed: string;
  readonly themes: readonly Theme[];
}

const SUITS = [
  { id: "wands", name: "Wands", upright: "행동·동기·창조성", reversed: "행동 에너지의 지연 또는 과열", themes: ["CAREER", "EXPANSION"] },
  { id: "cups", name: "Cups", upright: "감정·관계·공감", reversed: "감정 흐름의 막힘 또는 과잉", themes: ["RELATIONSHIP"] },
  { id: "swords", name: "Swords", upright: "사고·결정·갈등 조정", reversed: "생각의 혼선 또는 해결되지 않은 긴장", themes: ["LEARNING", "CONFLICT"] },
  { id: "pentacles", name: "Pentacles", upright: "자원·현실성·지속성", reversed: "자원 관리의 불균형 또는 지연", themes: ["MONEY", "STABILITY"] },
] as const satisfies readonly SuitProfile[];

interface RankProfile {
  readonly id: TarotRank;
  readonly name: string;
  readonly number?: number;
  readonly upright: string;
  readonly reversed: string;
  readonly themes: readonly Theme[];
  readonly reversedThemes?: readonly Theme[];
}

const RANKS = [
  { id: "ace", name: "Ace", number: 1, upright: "새로운 씨앗과 시작 가능성", reversed: "시작 조건의 부족 또는 지연", themes: ["OPPORTUNITY"] },
  { id: "two", name: "Two", number: 2, upright: "두 선택지 사이의 조율", reversed: "선택 회피 또는 균형 상실", themes: ["CAUTION"] },
  { id: "three", name: "Three", number: 3, upright: "협력과 초기 확장", reversed: "협업의 어긋남 또는 성장 지연", themes: ["EXPANSION", "RELATIONSHIP"] },
  { id: "four", name: "Four", number: 4, upright: "기반을 고정하고 유지하는 단계", reversed: "정체 또는 기반 재정비", themes: ["STABILITY"], reversedThemes: ["REST"] },
  { id: "five", name: "Five", number: 5, upright: "긴장과 변화 압력", reversed: "갈등 회복 또는 남은 긴장", themes: ["CONFLICT", "CHANGE"] },
  { id: "six", name: "Six", number: 6, upright: "회복과 상호 지원", reversed: "주고받음의 불균형", themes: ["RELATIONSHIP", "STABILITY"] },
  { id: "seven", name: "Seven", number: 7, upright: "입장을 지키며 재평가하는 과정", reversed: "방어 피로 또는 판단 흔들림", themes: ["CAUTION", "INDEPENDENCE"] },
  { id: "eight", name: "Eight", number: 8, upright: "숙련과 움직임의 가속", reversed: "반복의 정체 또는 속도 혼선", themes: ["CHANGE", "LEARNING"] },
  { id: "nine", name: "Nine", number: 9, upright: "축적된 경험과 지속력", reversed: "피로 누적 또는 마무리 불안", themes: ["STABILITY", "INDEPENDENCE"], reversedThemes: ["REST"] },
  { id: "ten", name: "Ten", number: 10, upright: "한 주기의 완성과 책임", reversed: "과부하 또는 끝맺음 지연", themes: ["STABILITY", "CHANGE"], reversedThemes: ["REST"] },
  { id: "page", name: "Page", upright: "호기심과 새로운 학습", reversed: "미숙한 전달 또는 산만한 탐색", themes: ["LEARNING", "OPPORTUNITY"] },
  { id: "knight", name: "Knight", upright: "목표를 향한 적극적인 추구", reversed: "성급함 또는 추진력의 분산", themes: ["CHANGE", "CAREER"] },
  { id: "queen", name: "Queen", upright: "내적 숙련과 돌봄 있는 영향력", reversed: "자기 돌봄 부족 또는 영향력의 위축", themes: ["LEADERSHIP", "RELATIONSHIP"] },
  { id: "king", name: "King", upright: "외적 책임과 안정된 리더십", reversed: "권한의 경직 또는 책임 회피", themes: ["LEADERSHIP", "STABILITY"] },
] as const satisfies readonly RankProfile[];

function uniqueThemes(themes: readonly Theme[]): readonly Theme[] {
  return [...new Set(themes)];
}

function categoryPrompts(focus: string, stage: string): TarotCard["categories"] {
  return {
    love: [`관계에서는 ${focus}의 관점에서 ${stage}을(를) 점검해볼 수 있습니다.`],
    career: [`일에서는 ${focus}의 관점에서 ${stage}을(를) 점검해볼 수 있습니다.`],
    wealth: [`자원 관리에서는 ${focus}의 관점에서 ${stage}을(를) 점검해볼 수 있습니다.`],
    relationship: [`대인관계에서는 ${focus}의 관점에서 ${stage}을(를) 점검해볼 수 있습니다.`],
  };
}

function makeMajor(definition: MajorDefinition): CardWithThemes {
  const primary = definition.upright[0]!;
  return {
    card: {
      id: `major-${String(definition.number).padStart(2, "0")}-${definition.slug}`,
      name: definition.name,
      arcana: "major",
      number: definition.number,
      meanings: { upright: definition.upright, reversed: definition.reversed },
      categories: categoryPrompts(primary, "현재 선택의 기준"),
    },
    themes: {
      upright: definition.themes,
      reversed: uniqueThemes([...definition.themes, "CAUTION"]),
    },
  };
}

function makeMinor(suit: SuitProfile, rank: RankProfile): CardWithThemes {
  const numberPart = rank.number === undefined ? {} : { number: rank.number };
  return {
    card: {
      id: `minor-${suit.id}-${rank.id}`,
      name: `${rank.name} of ${suit.name}`,
      arcana: "minor",
      suit: suit.id,
      rank: rank.id,
      ...numberPart,
      meanings: {
        upright: [suit.upright, rank.upright],
        reversed: [suit.reversed, rank.reversed],
      },
      categories: categoryPrompts(suit.upright, rank.upright),
    },
    themes: {
      upright: uniqueThemes([...suit.themes, ...rank.themes]),
      reversed: uniqueThemes([...suit.themes, ...rank.themes, ...(rank.reversedThemes ?? []), "CAUTION"]),
    },
  };
}

const CARDS_WITH_THEMES: readonly CardWithThemes[] = [
  ...MAJOR_DEFINITIONS.map(makeMajor),
  ...SUITS.flatMap((suit) => RANKS.map((rank) => makeMinor(suit, rank))),
];

export const TAROT_CARDS: readonly TarotCard[] = CARDS_WITH_THEMES.map(({ card }) => card);

export const TAROT_CARD_THEMES: Readonly<Record<string, TarotThemeMapping>> = Object.fromEntries(
  CARDS_WITH_THEMES.map(({ card, themes }) => [card.id, themes]),
);
