import { FORTUNE_TEN_GOD_TEXT, fortunePeriodText } from "../../data/interpretations";
import { calculateTenGod } from "../../engine/saju/tenGods";
import type { TenGod } from "../../engine/saju/types";
import { evaluateRules } from "./rules";
import type { InterpretationRule, SajuInterpretationInput } from "./types";

const TEN_GODS = ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"] as const satisfies readonly TenGod[];

const FORTUNE_RULES = TEN_GODS.map((tenGod): InterpretationRule => ({
  id: `fortune.sewoon-stem-${tenGod}`,
  category: "fortune",
  condition: `sewoon is supplied and its stem has the ${tenGod} relation to the day master`,
  weight: 0.9,
  evaluate: ({ core, sewoon }) => {
    if (sewoon === undefined || calculateTenGod(core.dayMaster, sewoon.stem) !== tenGod) return null;
    return {
      text: fortunePeriodText(sewoon.sajuYear, FORTUNE_TEN_GOD_TEXT[tenGod]),
      evidence: [
        { key: "sewoon", value: `${sewoon.stem.name}${sewoon.branch.name}` },
        { key: "sewoonStemTenGod", value: tenGod },
        { key: "interval", value: `${new Date(sewoon.startInstantMs).toISOString()}/${new Date(sewoon.endInstantMs).toISOString()}` },
      ],
    };
  },
}));

export function interpretFortune(input: SajuInterpretationInput) {
  return evaluateRules(FORTUNE_RULES, input);
}
