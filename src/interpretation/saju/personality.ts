import { PERSONALITY_ELEMENT_TEXT, PERSONALITY_YINYANG_TEXT, rawElementCompositionText } from "../../data/interpretations";
import { elementLabels, elementNamesAtExtreme } from "./helpers";
import { evaluateRules } from "./rules";
import type { InterpretationRule, SajuInterpretationInput } from "./types";

const PERSONALITY_RULES = [
  {
    id: "personality.day-master-element",
    category: "personality",
    condition: "always: select by calculated day-master element",
    weight: 1,
    evaluate: ({ core }) => ({
      text: PERSONALITY_ELEMENT_TEXT[core.dayMaster.element],
      evidence: [{ key: "dayMaster", value: `${core.dayMaster.name}/${core.dayMaster.element}` }],
    }),
  },
  {
    id: "personality.day-master-yin-yang",
    category: "personality",
    condition: "always: select by calculated day-master yin/yang",
    weight: 0.9,
    evaluate: ({ core }) => ({
      text: PERSONALITY_YINYANG_TEXT[core.dayMaster.yinYang],
      evidence: [{ key: "dayMasterYinYang", value: core.dayMaster.yinYang }],
    }),
  },
  {
    id: "personality.raw-element-composition",
    category: "personality",
    condition: "always: describe tied maxima and minima in raw visible-element counts",
    weight: 0.6,
    evaluate: ({ core }) => {
      const most = elementNamesAtExtreme(core.fiveElements.raw, "max");
      const least = elementNamesAtExtreme(core.fiveElements.raw, "min");
      return {
        text: rawElementCompositionText(elementLabels(most), elementLabels(least)),
        evidence: [
          { key: "rawMost", value: elementLabels(most) },
          { key: "rawLeast", value: elementLabels(least) },
        ],
      };
    },
  },
] as const satisfies readonly InterpretationRule[];

export function interpretPersonality(input: SajuInterpretationInput) {
  return evaluateRules(PERSONALITY_RULES, input);
}
