import { relationshipBalanceText, type YinYangBalance } from "../../data/interpretations";
import { yinYangBalance } from "./helpers";
import { evaluateRules } from "./rules";
import type { InterpretationRule, SajuInterpretationInput } from "./types";

const BALANCES = ["yin-dominant", "balanced", "yang-dominant"] as const satisfies readonly YinYangBalance[];

const RELATIONSHIP_RULES = BALANCES.map((balance): InterpretationRule => ({
  id: `relationship.visible-${balance}`,
  category: "relationship",
  condition: `raw visible yin/yang distribution is ${balance}`,
  weight: 0.8,
  evaluate: ({ core }) => {
    const result = yinYangBalance(core);
    return result.balance === balance ? {
      text: relationshipBalanceText(balance, result.yin, result.yang),
      evidence: [
        { key: "visibleYin", value: String(result.yin) },
        { key: "visibleYang", value: String(result.yang) },
      ],
    } : null;
  },
}));

export function interpretRelationship(input: SajuInterpretationInput) {
  return evaluateRules(RELATIONSHIP_RULES, input);
}
