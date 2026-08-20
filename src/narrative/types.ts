import type { FullReading, SajuReading } from "../application/reading";

export interface NarrativeProfile {
  readonly name: string;
  readonly hanjaName?: string;
}

export interface NarrativeRequest {
  readonly reading: SajuReading | FullReading;
  readonly question?: string;
  readonly profile?: NarrativeProfile;
}

export interface NarrativeResponse {
  readonly narrative: string;
  readonly model: string;
}
