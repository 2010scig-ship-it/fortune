import { healthLeastRepresentedText, healthMostRepresentedText } from "../../data/interpretations";
import { elementLabels, elementNamesAtExtreme } from "./helpers";
import { evaluateRules } from "./rules";
import type { InterpretationRule, SajuInterpretationInput } from "./types";

const HEALTH_RULES = [
  {
    id: "health.raw-most-represented",
    category: "health",
    condition: "always: use raw visible-element maxima as a symbolic self-care prompt",
    weight: 0.7,
    evaluate: ({ core }) => {
      const elements = elementNamesAtExtreme(core.fiveElements.raw, "max");
      return {
        text: healthMostRepresentedText(elements),
        evidence: [{ key: "rawMost", value: elementLabels(elements) }],
      };
    },
  },
  {
    id: "health.raw-least-represented",
    category: "health",
    condition: "always: use raw visible-element minima without treating them as medical deficiency",
    weight: 0.6,
    evaluate: ({ core }) => {
      const elements = elementNamesAtExtreme(core.fiveElements.raw, "min");
      return {
        text: healthLeastRepresentedText(elements),
        evidence: [{ key: "rawLeast", value: elementLabels(elements) }],
      };
    },
  },
] as const satisfies readonly InterpretationRule[];

export function interpretHealth(input: SajuInterpretationInput) {
  return evaluateRules(HEALTH_RULES, input);
}
