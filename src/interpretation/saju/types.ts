import type { SajuCoreResult, Sewoon } from "../../engine/saju/types";

export type InterpretationCategory = "personality" | "career" | "wealth" | "relationship" | "health" | "fortune";

export interface SajuInterpretationInput {
  readonly core: SajuCoreResult;
  readonly sewoon?: Sewoon;
}

export interface RuleEvidence {
  readonly key: string;
  readonly value: string;
}

export interface RuleEvaluation {
  readonly text: string;
  readonly evidence: readonly RuleEvidence[];
}

export interface InterpretationRule {
  readonly id: string;
  readonly category: InterpretationCategory;
  readonly condition: string;
  readonly weight: number;
  readonly evaluate: (input: SajuInterpretationInput) => RuleEvaluation | null;
}

export interface InterpretationPoint extends RuleEvaluation {
  readonly ruleId: string;
  readonly category: InterpretationCategory;
  readonly weight: number;
}

export interface SajuInterpretation {
  readonly methodology: "phase-3-rule-based-v1";
  readonly categories: Readonly<Record<InterpretationCategory, readonly InterpretationPoint[]>>;
  readonly limitations: readonly string[];
}
