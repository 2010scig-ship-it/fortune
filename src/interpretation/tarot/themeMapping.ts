import { TAROT_CARD_THEMES } from "../../data/tarotCards";
import type { DrawnTarotCard } from "../../engine/tarot/types";
import type { Theme } from "../themes";

export function themesForDrawnCard(drawn: DrawnTarotCard): readonly Theme[] {
  const mapping = TAROT_CARD_THEMES[drawn.card.id];
  if (mapping === undefined) throw new RangeError(`No Theme mapping for tarot card: ${drawn.card.id}`);
  return mapping[drawn.orientation];
}

export function mergeThemes(themeLists: readonly (readonly Theme[])[]): readonly Theme[] {
  return [...new Set(themeLists.flat())];
}
