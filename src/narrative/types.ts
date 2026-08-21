import type { FullReading, SajuReading } from "../application/reading";
import type { NameResult } from "../engine/name/types";
import type { PalmResult } from "../engine/palm/types";
import type { IntegratedReading } from "../interpretation/integrated/types";

export interface NarrativeProfile {
  readonly name: string;
  readonly hanjaName?: string;
}

export interface NarrativeRequest {
  readonly reading: SajuReading | FullReading;
  readonly question?: string;
  readonly profile?: NarrativeProfile;
  readonly integratedReading?: IntegratedReading;
  readonly nameResult?: NameResult;
  readonly palmResult?: PalmResult;
}

export interface NarrativeResponse {
  readonly narrative: string;
  readonly model: string;
}
