import type { NameResult } from "../../engine/name/types";
import type { PalmResult } from "../../engine/palm/types";
import type { SajuCoreResult, Sewoon } from "../../engine/saju/types";
import type { SajuInterpretation } from "../saju/types";
import type { TarotSpreadInterpretation } from "../tarot/types";
import type { Theme } from "../themes";

export type IntegratedSourceStatus =
  | "rule-based"
  | "personalization-only"
  | "mock-unobserved"
  | "vision-observed"
  | "not-provided";

export interface IntegratedSection {
  readonly summary: string;
  readonly details: readonly string[];
  readonly limitations: readonly string[];
}

export interface IntegratedReadingInput {
  readonly profile: {
    readonly name: string;
    readonly hanjaName?: string;
  };
  readonly question: {
    readonly category: string;
    readonly text: string;
  };
  readonly saju: {
    readonly core: SajuCoreResult;
    readonly sewoon: Sewoon;
    readonly interpretation: SajuInterpretation;
  };
  readonly name: NameResult;
  readonly tarot: TarotSpreadInterpretation;
  readonly palm?: PalmResult;
}

export interface IntegratedReading {
  readonly methodology: "phase-5-integrated-reading-v1";
  readonly headline: string;
  readonly overview: string;
  readonly sajuSection: IntegratedSection;
  readonly nameSection: IntegratedSection;
  readonly tarotSection: IntegratedSection;
  readonly palmSection: IntegratedSection;
  readonly convergence: readonly string[];
  readonly divergence: readonly string[];
  readonly currentFocus: string;
  readonly actionGuide: readonly string[];
  readonly journalPrompt: string;
  readonly disclaimer: string;
  readonly sourceStatus: {
    readonly saju: IntegratedSourceStatus;
    readonly name: IntegratedSourceStatus;
    readonly tarot: IntegratedSourceStatus;
    readonly palm: IntegratedSourceStatus;
  };
  readonly evidence: {
    readonly sajuThemes: readonly Theme[];
    readonly tarotThemes: readonly Theme[];
    readonly agreementThemes: readonly Theme[];
  };
}
