import type { InterpretationPoint, InterpretationRule, SajuInterpretationInput } from "./types";

export function evaluateRules(
  rules: readonly InterpretationRule[],
  input: SajuInterpretationInput,
): readonly InterpretationPoint[] {
  return rules
    .map((rule): InterpretationPoint | null => {
      const evaluation = rule.evaluate(input);
      return evaluation === null ? null : {
        ruleId: rule.id,
        category: rule.category,
        weight: rule.weight,
        ...evaluation,
      };
    })
    .filter((point): point is InterpretationPoint => point !== null)
    .sort((left, right) => right.weight - left.weight || left.ruleId.localeCompare(right.ruleId));
}
