import type { FullReading, SajuReading } from "../application/reading";

export interface NarrativeRequest {
  readonly reading: SajuReading | FullReading;
  readonly question?: string;
}

export interface NarrativeResponse {
  readonly narrative: string;
  readonly model: string;
}
