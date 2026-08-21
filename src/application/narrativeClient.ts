import type { FullReading, SajuReading } from "./reading";
import type { UserProfile } from "./readingFlow";
import type { NameResult } from "../engine/name/types";
import type { PalmResult } from "../engine/palm/types";
import type { IntegratedReading } from "../interpretation/integrated/types";
import type { NarrativeRequest, NarrativeResponse } from "../narrative/types";

export interface NarrativeSourceBundle {
  readonly integratedReading?: IntegratedReading;
  readonly nameResult?: NameResult;
  readonly palmResult?: PalmResult;
}

export async function requestNarrative(
  reading: SajuReading | FullReading,
  question: string,
  profile?: UserProfile,
  sources: NarrativeSourceBundle = {},
): Promise<NarrativeResponse> {
  const payload: NarrativeRequest = {
    reading,
    ...(question.trim() === "" ? {} : { question: question.trim() }),
    ...(profile ? { profile: { name: profile.name, ...(profile.hanjaName ? { hanjaName: profile.hanjaName } : {}) } } : {}),
    ...(sources.integratedReading ? { integratedReading: sources.integratedReading } : {}),
    ...(sources.nameResult ? { nameResult: sources.nameResult } : {}),
    ...(sources.palmResult ? { palmResult: sources.palmResult } : {}),
  };
  const response = await fetch("/api/narrative", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body: unknown = await response.json();
  if (!response.ok) {
    const message = isRecord(body) && typeof body.error === "string" ? body.error : "상담문을 생성하지 못했습니다.";
    throw new Error(message);
  }
  if (!isRecord(body) || typeof body.narrative !== "string" || typeof body.model !== "string") throw new Error("상담 응답 형식이 올바르지 않습니다.");
  return { narrative: body.narrative, model: body.model };
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
