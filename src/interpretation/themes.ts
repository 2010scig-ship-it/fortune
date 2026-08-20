export const THEMES = [
  "CHANGE",
  "EXPANSION",
  "CAUTION",
  "RELATIONSHIP",
  "MONEY",
  "CAREER",
  "REST",
  "CONFLICT",
  "OPPORTUNITY",
  "LEARNING",
  "LEADERSHIP",
  "INDEPENDENCE",
  "STABILITY",
] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_LABELS: Readonly<Record<Theme, string>> = {
  CHANGE: "변화",
  EXPANSION: "성장과 확장",
  CAUTION: "신중함",
  RELATIONSHIP: "관계",
  MONEY: "돈과 자원",
  CAREER: "일과 진로",
  REST: "휴식과 회복",
  CONFLICT: "갈등 조정",
  OPPORTUNITY: "새로운 기회",
  LEARNING: "배움",
  LEADERSHIP: "주도성",
  INDEPENDENCE: "독립성",
  STABILITY: "안정",
};
