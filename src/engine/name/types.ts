export type NameAnalysisMode = "personalization-only" | "mock-hanja-structure";

export interface NameAnalysisInput {
  readonly name: string;
  readonly hanjaName?: string;
}

export interface NameResult {
  readonly displayName: string;
  readonly hanjaName?: string;
  readonly mode: NameAnalysisMode;
  readonly summary: string;
  readonly observations: readonly string[];
  readonly limitations: readonly string[];
}

export interface NameAnalyzer {
  analyze(input: NameAnalysisInput): NameResult;
}
