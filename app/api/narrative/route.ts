import OpenAI from "openai";
import { NextResponse } from "next/server";
import { buildNarrativePrompt, NARRATIVE_SYSTEM_PROMPT } from "../../../src/narrative/prompt";
import type { NarrativeRequest } from "../../../src/narrative/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY가 설정되지 않아 AI 상담을 사용할 수 없습니다." }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "요청 JSON이 올바르지 않습니다." }, { status: 400 }); }
  if (!isNarrativeRequest(body)) return NextResponse.json({ error: "상담 요청 형식이 올바르지 않습니다." }, { status: 400 });
  if (JSON.stringify(body).length > 50_000) return NextResponse.json({ error: "상담 요청이 너무 큽니다." }, { status: 413 });

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-5.6-luna";
  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model,
      store: false,
      instructions: NARRATIVE_SYSTEM_PROMPT,
      input: buildNarrativePrompt(body),
      reasoning: { effort: "none" },
      text: { verbosity: "high" },
      max_output_tokens: 2_200,
    });
    const narrative = response.output_text.trim();
    if (narrative === "") throw new Error("empty model response");
    return NextResponse.json({ narrative, model });
  } catch (error: unknown) {
    console.error("Narrative generation failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "AI 상담 생성에 실패했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }
}

function isNarrativeRequest(value: unknown): value is NarrativeRequest {
  if (typeof value !== "object" || value === null || !("reading" in value)) return false;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.reading !== "object" || candidate.reading === null) return false;
  const questionIsValid = candidate.question === undefined || (typeof candidate.question === "string" && candidate.question.length <= 500);
  const profileIsValid = candidate.profile === undefined || (
    typeof candidate.profile === "object" && candidate.profile !== null
    && typeof (candidate.profile as Record<string, unknown>).name === "string"
    && ((candidate.profile as Record<string, unknown>).name as string).length <= 40
    && ((candidate.profile as Record<string, unknown>).hanjaName === undefined
      || (typeof (candidate.profile as Record<string, unknown>).hanjaName === "string"
        && ((candidate.profile as Record<string, unknown>).hanjaName as string).length <= 40))
  );
  return questionIsValid && profileIsValid;
}
