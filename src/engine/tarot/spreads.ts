import type { DrawnTarotCard, TarotSpreadDefinition, TarotSpreadDraw, TarotSpreadId } from "./types";

export const TAROT_SPREADS = [
  {
    id: "one-card",
    name: "One Card",
    positions: [
      { id: "core-message", label: "Core Message", prompt: "질문에서 가장 중요하게 살펴볼 핵심" },
    ],
  },
  {
    id: "three-timeline",
    name: "Three Cards — Timeline",
    positions: [
      { id: "past", label: "Past", prompt: "현재 상황에 이어진 배경" },
      { id: "present", label: "Present", prompt: "지금 가장 두드러진 조건" },
      { id: "future", label: "Future", prompt: "현재 선택이 이어질 가능성 있는 방향" },
    ],
  },
  {
    id: "three-guidance",
    name: "Three Cards — Guidance",
    positions: [
      { id: "situation", label: "Situation", prompt: "질문의 현재 상황" },
      { id: "advice", label: "Advice", prompt: "현실적으로 점검할 행동과 태도" },
      { id: "outcome", label: "Outcome", prompt: "현재 접근이 이어질 경우의 가능성 있는 방향" },
    ],
  },
  {
    id: "five-card",
    name: "Five Cards",
    positions: [
      { id: "current-situation", label: "Current Situation", prompt: "현재 상황의 중심" },
      { id: "obstacle", label: "Obstacle", prompt: "진행을 어렵게 만드는 조건" },
      { id: "hidden-influence", label: "Hidden Influence", prompt: "아직 충분히 의식하지 못한 영향" },
      { id: "advice", label: "Advice", prompt: "현실적으로 점검할 행동과 태도" },
      { id: "likely-direction", label: "Likely Direction", prompt: "현재 흐름이 이어질 가능성 있는 방향" },
    ],
  },
] as const satisfies readonly TarotSpreadDefinition[];

export function getTarotSpread(spreadId: TarotSpreadId): TarotSpreadDefinition {
  const spread = TAROT_SPREADS.find(({ id }) => id === spreadId);
  if (spread === undefined) throw new RangeError(`Unknown tarot spread ID: ${spreadId}`);
  return spread;
}

export function placeCardsInSpread(
  spread: TarotSpreadDefinition,
  cards: readonly DrawnTarotCard[],
): TarotSpreadDraw {
  if (cards.length !== spread.positions.length) {
    throw new RangeError(`${spread.id} requires exactly ${spread.positions.length} cards; received ${cards.length}`);
  }
  return {
    spread,
    cards: spread.positions.map((position, index) => ({ position, drawn: cards[index]! })),
  };
}
