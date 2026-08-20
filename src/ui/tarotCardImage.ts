const SUIT_CODE = {
  wands: "wa",
  cups: "cu",
  swords: "sw",
  pentacles: "pe",
} as const;

const RANK_NUMBER = {
  ace: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  page: 11,
  knight: 12,
  queen: 13,
  king: 14,
} as const;

export function tarotCardImagePath(cardId: string): string {
  const major = /^major-(\d{2})-[a-z-]+$/.exec(cardId);
  if (major !== null) return `/tarot-cards/ar${major[1]}.jpg`;

  const minor = /^minor-(wands|cups|swords|pentacles)-(ace|two|three|four|five|six|seven|eight|nine|ten|page|knight|queen|king)$/.exec(cardId);
  if (minor === null) throw new RangeError(`Unknown tarot card ID: ${cardId}`);
  const suit = minor[1] as keyof typeof SUIT_CODE;
  const rank = minor[2] as keyof typeof RANK_NUMBER;
  return `/tarot-cards/${SUIT_CODE[suit]}${String(RANK_NUMBER[rank]).padStart(2, "0")}.jpg`;
}
