import { WEALTH_COUNT_TEXT, type WealthCountBand } from "../../data/interpretations";
import { visibleWealthBand } from "./helpers";
import { evaluateRules } from "./rules";
import type { InterpretationRule, SajuInterpretationInput } from "./types";

const BANDS = ["none", "single", "multiple"] as const satisfies readonly WealthCountBand[];

const WEALTH_RULES = BANDS.map((band): InterpretationRule => ({
  id: `wealth.visible-wealth-${band}`,
  category: "wealth",
  condition: `visible non-day wealth-star count is in the ${band} band`,
  weight: 0.9,
  evaluate: ({ core }) => {
    const result = visibleWealthBand(core);
    return result.band === band ? {
      text: WEALTH_COUNT_TEXT[band],
      evidence: [{ key: "visibleWealthStarCount", value: String(result.count) }],
    } : null;
  },
}));

export function interpretWealth(input: SajuInterpretationInput) {
  return evaluateRules(WEALTH_RULES, input);
}
