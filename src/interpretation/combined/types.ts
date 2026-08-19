import type { SajuInterpretation } from "../saju/types";
import type { TarotSpreadInterpretation } from "../tarot/types";
import type { Theme } from "../themes";

export type ThemeSourceSystem = "saju" | "tarot";

export interface ThemeEvidence {
  readonly theme: Theme;
  readonly system: ThemeSourceSystem;
  readonly sourceId: string;
  readonly context: readonly {
    readonly key: string;
    readonly value: string;
  }[];
}

export interface ThemeRelationshipSignal {
  readonly relationId: string;
  readonly sajuTheme: Theme;
  readonly tarotTheme: Theme;
  readonly explanation: string;
}

export interface CombinedReadingInput {
  readonly saju: SajuInterpretation;
  readonly tarot: TarotSpreadInterpretation;
}

export interface CombinedReading {
  readonly methodology: "phase-5-theme-comparison-v1";
  readonly sajuThemes: readonly Theme[];
  readonly tarotThemes: readonly Theme[];
  readonly agreements: readonly Theme[];
  readonly complementarySignals: readonly ThemeRelationshipSignal[];
  readonly tensions: readonly ThemeRelationshipSignal[];
  readonly evidence: {
    readonly saju: readonly ThemeEvidence[];
    readonly tarot: readonly ThemeEvidence[];
  };
  readonly limitations: readonly string[];
}
