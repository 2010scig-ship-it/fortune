import type { SajuReading } from "./reading";
import type { NarrativeRequest, NarrativeResponse } from "../narrative/types";

export async function requestNarrative(reading: SajuReading, question: string): Promise<NarrativeResponse> {
  const payload: NarrativeRequest = { reading, ...(question.trim() === "" ? {} : { question: question.trim() }) };
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
