import { CAREER_ELEMENT_TEXT, CAREER_TEN_GOD_GROUP_TEXT, type TenGodGroup } from "../../data/interpretations";
import { dominantVisibleTenGodGroups, visibleTenGodsExcludingDay } from "./helpers";
import { evaluateRules } from "./rules";
import type { InterpretationRule, SajuInterpretationInput } from "./types";

const GROUPS = ["peer", "output", "wealth", "authority", "resource"] as const satisfies readonly TenGodGroup[];

const CAREER_RULES: readonly InterpretationRule[] = [
  {
    id: "career.day-master-work-style",
    category: "career",
    condition: "always: select work-style prompt by day-master element",
    weight: 1,
    evaluate: ({ core }) => ({
      text: CAREER_ELEMENT_TEXT[core.dayMaster.element],
      evidence: [{ key: "dayMasterElement", value: core.dayMaster.element }],
    }),
  },
  ...GROUPS.map((group): InterpretationRule => ({
    id: `career.visible-ten-god-${group}`,
    category: "career",
    condition: `visible non-day stems place ${group} among the highest-count ten-god families`,
    weight: 0.8,
    evaluate: ({ core }) => dominantVisibleTenGodGroups(core).includes(group) ? {
      text: CAREER_TEN_GOD_GROUP_TEXT[group],
      evidence: [{ key: "visibleTenGodsExcludingDay", value: visibleTenGodsExcludingDay(core).join("·") }],
    } : null,
  })),
];

export function interpretCareer(input: SajuInterpretationInput) {
  return evaluateRules(CAREER_RULES, input);
}
