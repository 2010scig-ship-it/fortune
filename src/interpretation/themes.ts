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
