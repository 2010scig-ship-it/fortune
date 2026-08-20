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
  { id: "wands", name: "Wands", upright: "새로운 일을 시작하고 움직이려는 힘", reversed: "의욕은 있지만 속도나 방향이 맞지 않는 상태", themes: ["CAREER", "EXPANSION"] },
  { id: "cups", name: "Cups", upright: "감정과 관계에서 서로의 마음을 이해하는 일", reversed: "감정이 막히거나 한쪽으로 치우친 상태", themes: ["RELATIONSHIP"] },
  { id: "swords", name: "Swords", upright: "생각을 정리하고 결정하며 갈등을 풀어 가는 일", reversed: "생각이 복잡해 결정을 내리기 어려운 상태", themes: ["LEARNING", "CONFLICT"] },
  { id: "pentacles", name: "Pentacles", upright: "돈과 일, 생활 기반을 현실적으로 돌보는 일", reversed: "돈이나 시간, 생활 리듬을 안정적으로 관리하기 어려운 상태", themes: ["MONEY", "STABILITY"] },
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
  { id: "ace", name: "Ace", number: 1, upright: "새롭게 시작할 가능성이 열리는 단계", reversed: "시작하기 전에 조건을 더 갖춰야 하는 상태", themes: ["OPPORTUNITY"] },
  { id: "two", name: "Two", number: 2, upright: "두 선택지를 비교하고 균형을 잡는 단계", reversed: "결정을 미루거나 균형을 잃기 쉬운 상태", themes: ["CAUTION"] },
  { id: "three", name: "Three", number: 3, upright: "다른 사람과 힘을 모아 가능성을 넓히는 단계", reversed: "협력이 어긋나거나 성장이 늦어지는 상태", themes: ["EXPANSION", "RELATIONSHIP"] },
  { id: "four", name: "Four", number: 4, upright: "지금 가진 기반을 안정적으로 지키는 단계", reversed: "멈춰 있는 부분을 다시 정비해야 하는 상태", themes: ["STABILITY"], reversedThemes: ["REST"] },
  { id: "five", name: "Five", number: 5, upright: "갈등이나 변화의 압력이 커지는 단계", reversed: "갈등이 가라앉고 있지만 아직 긴장이 남은 상태", themes: ["CONFLICT", "CHANGE"] },
  { id: "six", name: "Six", number: 6, upright: "도움을 주고받으며 안정을 되찾는 단계", reversed: "한쪽만 주거나 받는 관계가 되기 쉬운 상태", themes: ["RELATIONSHIP", "STABILITY"] },
  { id: "seven", name: "Seven", number: 7, upright: "내 입장을 지키면서 다시 판단하는 단계", reversed: "버티느라 지치거나 판단이 흔들리는 상태", themes: ["CAUTION", "INDEPENDENCE"] },
  { id: "eight", name: "Eight", number: 8, upright: "익숙해진 일을 더 빠르게 추진하는 단계", reversed: "같은 일이 반복되거나 속도를 맞추기 어려운 상태", themes: ["CHANGE", "LEARNING"] },
  { id: "nine", name: "Nine", number: 9, upright: "쌓아 온 경험을 바탕으로 끝까지 이어 가는 단계", reversed: "피로가 쌓여 마무리를 불안하게 느끼는 상태", themes: ["STABILITY", "INDEPENDENCE"], reversedThemes: ["REST"] },
  { id: "ten", name: "Ten", number: 10, upright: "한 단계를 마무리하고 책임을 정리하는 시점", reversed: "할 일이 너무 많아 마무리가 늦어지는 상태", themes: ["STABILITY", "CHANGE"], reversedThemes: ["REST"] },
  { id: "page", name: "Page", upright: "호기심을 따라 배우고 새로운 소식을 받아들이는 단계", reversed: "생각이 흩어지거나 말을 충분히 다듬지 못한 상태", themes: ["LEARNING", "OPPORTUNITY"] },
  { id: "knight", name: "Knight", upright: "목표를 향해 적극적으로 움직이는 단계", reversed: "서두르거나 여러 방향으로 힘이 흩어지는 상태", themes: ["CHANGE", "CAREER"] },
  { id: "queen", name: "Queen", upright: "경험을 바탕으로 자신과 주변을 세심하게 돌보는 힘", reversed: "자신을 돌볼 여유가 부족해 영향력이 줄어든 상태", themes: ["LEADERSHIP", "RELATIONSHIP"] },
  { id: "king", name: "King", upright: "책임을 맡고 안정적으로 방향을 이끄는 힘", reversed: "자기 방식만 고집하거나 책임을 피하기 쉬운 상태", themes: ["LEADERSHIP", "STABILITY"] },
] as const satisfies readonly RankProfile[];

function uniqueThemes(themes: readonly Theme[]): readonly Theme[] {
  return [...new Set(themes)];
}

function categoryPrompts(): TarotCard["categories"] {
  return {
    love: ["사랑에 관한 질문이라면, 상대의 마음을 추측하기보다 원하는 관계와 지켜야 할 기준을 먼저 적어 보세요."],
    career: ["일과 진로에 관한 질문이라면, 지금 바꿀 수 있는 한 가지 행동과 더 알아봐야 할 조건을 나누어 보세요."],
    wealth: ["돈에 관한 질문이라면, 기대하는 이익과 감당할 수 있는 손실을 숫자로 확인한 뒤 결정하세요."],
    relationship: ["관계에 관한 질문이라면, 내 의도와 상대가 실제로 들은 말 사이에 차이가 없는지 확인해 보세요."],
  };
}

function makeMajor(definition: MajorDefinition): CardWithThemes {
  return {
    card: {
      id: `major-${String(definition.number).padStart(2, "0")}-${definition.slug}`,
      name: definition.name,
      arcana: "major",
      number: definition.number,
      meanings: { upright: definition.upright, reversed: definition.reversed },
      categories: categoryPrompts(),
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
      categories: categoryPrompts(),
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
