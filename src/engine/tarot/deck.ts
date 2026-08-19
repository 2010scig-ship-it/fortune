import { TAROT_CARDS } from "../../data/tarotCards";
import type { TarotCard } from "./types";

export const RWS_DECK: readonly TarotCard[] = TAROT_CARDS;

export function getTarotCard(cardId: string, deck: readonly TarotCard[] = RWS_DECK): TarotCard {
  const card = deck.find(({ id }) => id === cardId);
  if (card === undefined) throw new RangeError(`Unknown tarot card ID: ${cardId}`);
  return card;
}
