import { getTarotSpread, type TarotSpreadId } from "../engine/tarot";

export type ReadingTarotSpreadId = Extract<TarotSpreadId, "one-card" | "three-guidance">;

export interface ReadingTarotSpreadOption {
  readonly id: ReadingTarotSpreadId;
  readonly countLabel: string;
  readonly title: string;
  readonly description: string;
  readonly positionLabels: readonly string[];
}

const READING_TAROT_SPREAD_COPY = {
  "one-card": {
    countLabel: "1 CARD",
    title: "한 장으로 보기",
    description: "질문에서 지금 가장 중요하게 볼 한 가지 관점을 살펴봅니다.",
  },
  "three-guidance": {
    countLabel: "3 CARDS",
    title: "세 장으로 살펴보기",
    description: "현재 상황, 도움이 될 태도, 앞으로의 방향을 차례로 살펴봅니다.",
  },
} as const satisfies Readonly<Record<ReadingTarotSpreadId, Omit<ReadingTarotSpreadOption, "id" | "positionLabels">>>;

export const READING_TAROT_SPREADS: readonly ReadingTarotSpreadOption[] = (
  ["one-card", "three-guidance"] as const satisfies readonly ReadingTarotSpreadId[]
).map((id) => {
  const spread = getTarotSpread(id);
  return {
    id,
    ...READING_TAROT_SPREAD_COPY[id],
    positionLabels: spread.positions.map(({ label }) => label),
  };
});

export function getReadingTarotSpreadOption(id: ReadingTarotSpreadId): ReadingTarotSpreadOption {
  const option = READING_TAROT_SPREADS.find((candidate) => candidate.id === id);
  if (option === undefined) throw new RangeError(`Unsupported reading tarot spread: ${id}`);
  return option;
}
