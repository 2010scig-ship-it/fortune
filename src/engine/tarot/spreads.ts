import type { DrawnTarotCard, TarotSpreadDefinition, TarotSpreadDraw, TarotSpreadId } from "./types";

export const TAROT_SPREADS = [
  {
    id: "one-card",
    name: "한 장의 메시지",
    positions: [
      { id: "core-message", label: "핵심 메시지", prompt: "지금 가장 중요하게 바라볼 주제를 보여 주는 자리입니다." },
    ],
  },
  {
    id: "three-timeline",
    name: "과거·현재·앞으로의 흐름",
    positions: [
      { id: "past", label: "과거", prompt: "현재 상황에 영향을 준 배경을 돌아보는 자리입니다." },
      { id: "present", label: "현재", prompt: "지금 가장 크게 작용하는 마음과 조건을 살펴보는 자리입니다." },
      { id: "future", label: "앞으로의 흐름", prompt: "지금의 선택을 이어 갈 때 나타날 수 있는 방향을 비춰 보는 자리입니다." },
    ],
  },
  {
    id: "three-guidance",
    name: "상황·조언·방향",
    positions: [
      { id: "situation", label: "현재 상황", prompt: "질문과 관련해 지금 가장 크게 작용하는 흐름을 보여 주는 자리입니다." },
      { id: "advice", label: "도움이 될 태도", prompt: "지금 현실적으로 취할 수 있는 태도와 행동을 살펴보는 자리입니다." },
      { id: "outcome", label: "앞으로의 방향", prompt: "현재의 접근을 이어 갈 때 어떤 방향으로 흘러갈지 살펴보는 자리입니다." },
    ],
  },
  {
    id: "five-card",
    name: "다섯 장의 흐름",
    positions: [
      { id: "current-situation", label: "현재 상황", prompt: "질문의 중심에 있는 상황을 보여 주는 자리입니다." },
      { id: "obstacle", label: "걸림돌", prompt: "진행을 어렵게 만드는 조건을 살펴보는 자리입니다." },
      { id: "hidden-influence", label: "미처 보지 못한 점", prompt: "아직 충분히 알아차리지 못한 영향을 살펴보는 자리입니다." },
      { id: "advice", label: "도움이 될 태도", prompt: "지금 현실적으로 취할 수 있는 태도와 행동을 살펴보는 자리입니다." },
      { id: "likely-direction", label: "앞으로의 방향", prompt: "현재의 선택을 이어 갈 때 나타날 수 있는 방향을 비춰 보는 자리입니다." },
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
