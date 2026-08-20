import type { BirthData } from "../engine/saju/types";
import type { TarotQuestionCategory, TarotSpreadId } from "../engine/tarot/types";

export const READING_FLOW_STEPS = [
  { id: "birth", number: 1, label: "Birth", description: "프로필과 사주" },
  { id: "question", number: 2, label: "Question", description: "지금의 질문" },
  { id: "tarot", number: 3, label: "Tarot", description: "카드 선택" },
  { id: "palm", number: 4, label: "Palm", description: "손바닥 관찰" },
  { id: "review", number: 5, label: "Review", description: "확인과 생성" },
] as const;

export type ReadingFlowStep = (typeof READING_FLOW_STEPS)[number]["id"];
export type ReadingQuestionCategory = "love" | "career" | "relationship" | "wealth" | "self" | "free";

export interface UserProfile {
  readonly id: string;
  readonly name: string;
  readonly hanjaName?: string;
  readonly birthDate: string;
  readonly birthTime?: string;
  readonly unknownBirthTime: boolean;
  readonly gender: "female" | "male";
}

export interface UserProfileDraft {
  readonly name: string;
  readonly hanjaName?: string;
  readonly birthDate: string;
  readonly birthTime?: string;
  readonly unknownBirthTime: boolean;
  readonly gender: "female" | "male";
}

export interface ReadingQuestion {
  readonly category: ReadingQuestionCategory;
  readonly text: string;
}

export interface ReadingRequest {
  readonly profile: UserProfile;
  readonly question: ReadingQuestion;
  readonly tarotSpread: TarotSpreadId;
  readonly palm: {
    readonly hasLeftImage: boolean;
    readonly hasRightImage: boolean;
  };
}

export const QUESTION_CATEGORY_LABELS: Readonly<Record<ReadingQuestionCategory, string>> = {
  love: "사랑",
  career: "일 / 진로",
  relationship: "인간관계",
  wealth: "재정",
  self: "자기이해",
  free: "자유질문",
};

export function createUserProfile(draft: UserProfileDraft, idFactory: () => string): UserProfile {
  const name = draft.name.trim();
  const birthDate = draft.birthDate.trim();
  const birthTime = draft.birthTime?.trim();
  const hanjaName = draft.hanjaName?.trim();

  if (name === "") throw new RangeError("이름을 입력해 주세요.");
  if (birthDate === "") throw new RangeError("생년월일을 입력해 주세요.");
  if (!draft.unknownBirthTime && !birthTime) throw new RangeError("태어난 시간을 입력하거나 '모름'을 선택해 주세요.");
  const knownBirthTime = draft.unknownBirthTime ? undefined : birthTime;

  return {
    id: idFactory(),
    name,
    ...(hanjaName ? { hanjaName } : {}),
    birthDate,
    ...(knownBirthTime === undefined ? {} : { birthTime: knownBirthTime }),
    unknownBirthTime: draft.unknownBirthTime,
    gender: draft.gender,
  };
}

export function birthDataFromProfile(profile: UserProfile): BirthData {
  return {
    date: profile.birthDate,
    ...(profile.unknownBirthTime ? {} : { time: profile.birthTime }),
    unknownBirthTime: profile.unknownBirthTime,
    calendarType: "solar",
    gender: profile.gender,
    location: { country: "KR", city: "Seoul", timezone: "Asia/Seoul" },
  };
}

export function questionCategoryToTarot(category: ReadingQuestionCategory): TarotQuestionCategory {
  if (category === "self" || category === "free") return "general";
  return category;
}
