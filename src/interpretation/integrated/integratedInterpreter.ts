import { combineReadings } from "../combined";
import type { InterpretationPoint } from "../saju/types";
import { THEME_LABELS, type Theme } from "../themes";
import type { IntegratedReading, IntegratedReadingInput, IntegratedSection, IntegratedSourceStatus } from "./types";

const DISCLAIMER = "이 통합 리딩은 엔터테인먼트와 자기성찰을 위한 참고 자료입니다. 미래를 확정하거나 의료·법률·투자 판단을 대신하지 않습니다.";
const MAX_SECTION_DETAILS = 4;

export function createIntegratedReading(input: IntegratedReadingInput): IntegratedReading {
  const combined = combineReadings({ saju: input.saju.interpretation, tarot: input.tarot });
  const agreementLabels = combined.agreements.map(themeLabel);
  const palmStatus = getPalmStatus(input.palm);
  const nameStatus: IntegratedSourceStatus = input.name.mode === "personalization-only" ? "personalization-only" : "mock-unobserved";
  const sajuPoints = orderedSajuPoints(input.saju.interpretation.categories).slice(0, MAX_SECTION_DETAILS);
  const tarotDetails = input.tarot.cards.slice(0, MAX_SECTION_DETAILS).map((card) => `${card.position.label} · ${card.cardName} (${card.orientation === "upright" ? "정방향" : "역방향"}): ${card.text}`);

  const convergence = combined.agreements.length > 0
    ? combined.agreements.map((theme) => `사주와 타로에서 모두 '${themeLabel(theme)}' 주제가 확인됩니다.`)
    : ["사주와 타로에서 동일한 주제가 뚜렷하게 반복되지는 않았습니다. 서로 다른 관점을 함께 비교해 보세요."];

  const divergence = [
    ...combined.tensions.map((signal) => signal.explanation),
    ...sourceBoundaryNotes(nameStatus, palmStatus),
  ];

  const actionGuide = unique([
    ...combined.complementarySignals.map((signal) => signal.explanation),
    ...combined.tensions.map((signal) => `서두르기 전에 확인하세요: ${signal.explanation}`),
    `질문 '${input.question.text}'에서 오늘 직접 확인할 수 있는 사실 한 가지를 적어 보세요.`,
    "지금 결정할 일과 더 지켜볼 일을 나누고, 다음 행동은 작게 정해 보세요.",
  ]).slice(0, 4);

  const primaryThemes = uniqueThemes([...combined.agreements, ...combined.sajuThemes, ...combined.tarotThemes]).slice(0, 2);
  const focusLabel = primaryThemes.length > 0 ? primaryThemes.map(themeLabel).join(" · ") : input.question.category;

  return {
    methodology: "phase-5-integrated-reading-v1",
    headline: agreementLabels.length > 0
      ? `${input.profile.name}님의 리딩에서는 ${agreementLabels.slice(0, 2).join(" · ")} 주제가 함께 나타납니다.`
      : `${input.profile.name}님의 질문을 중심으로 서로 다른 신호의 조건을 차분히 살펴봅니다.`,
    overview: `현재 질문은 '${input.question.text}'입니다. 사주 계산과 규칙 해석, 타로 규칙 해석을 중심 근거로 삼고 이름과 Palm 결과는 각 모듈이 실제로 확인한 범위 안에서만 연결했습니다.`,
    sajuSection: {
      summary: `결정론적 엔진이 계산한 일간은 ${input.saju.core.dayMaster.name}이며, ${input.saju.sewoon.sajuYear}년 세운과 규칙 해석을 함께 확인했습니다.`,
      details: sajuPoints.length > 0 ? sajuPoints.map((point) => point.text) : ["현재 적용된 사주 해석 규칙이 없습니다."],
      limitations: input.saju.interpretation.limitations,
    },
    nameSection: createNameSection(input),
    tarotSection: {
      summary: `${input.tarot.spreadName}에서 ${input.tarot.cards.length}장의 카드를 질문 맥락에 따라 규칙으로 해석했습니다.`,
      details: tarotDetails,
      limitations: input.tarot.limitations,
    },
    palmSection: createPalmSection(input.palm, palmStatus),
    convergence,
    divergence,
    currentFocus: `지금 가장 중요한 초점은 '${focusLabel}'입니다. 이를 예언으로 받아들이기보다 현재 질문에서 확인 가능한 선택 조건으로 바꿔 보세요.`,
    actionGuide,
    journalPrompt: `오늘의 질문을 떠올려 보세요: '${input.question.text}' ${focusLabel}에 관해 이미 알고 있는 사실과 더 확인해야 할 사실을 각각 한 가지씩 적어 보세요.`,
    disclaimer: DISCLAIMER,
    sourceStatus: {
      saju: "rule-based",
      name: nameStatus,
      tarot: "rule-based",
      palm: palmStatus,
    },
    evidence: {
      sajuThemes: combined.sajuThemes,
      tarotThemes: combined.tarotThemes,
      agreementThemes: combined.agreements,
    },
  };
}

function createNameSection(input: IntegratedReadingInput): IntegratedSection {
  return {
    summary: input.name.summary,
    details: input.name.observations,
    limitations: input.name.limitations,
  };
}

function createPalmSection(palm: IntegratedReadingInput["palm"], status: IntegratedSourceStatus): IntegratedSection {
  if (palm === undefined) {
    return {
      summary: "손바닥 사진을 제공하지 않아 Palm 분석을 통합하지 않았습니다.",
      details: [],
      limitations: ["Palm 신호는 이번 통합 리딩의 근거에 포함되지 않습니다."],
    };
  }

  const observed = status === "vision-observed" ? verifiedPalmObservations(palm) : [];
  return {
    summary: palm.summary,
    details: observed.length > 0 ? observed : ["현재 Palm 결과에는 통합 근거로 사용할 수 있는 검증된 이미지 관찰이 없습니다."],
    limitations: palm.limitations,
  };
}

function getPalmStatus(palm: IntegratedReadingInput["palm"]): IntegratedSourceStatus {
  if (palm === undefined) return "not-provided";
  return palm.mode === "vision" && verifiedPalmObservations(palm).length > 0 ? "vision-observed" : "mock-unobserved";
}

function verifiedPalmObservations(palm: NonNullable<IntegratedReadingInput["palm"]>): readonly string[] {
  const results: string[] = [];
  for (const [handKey, handLabel] of [["leftHand", "왼손"], ["rightHand", "오른손"]] as const) {
    const hand = palm[handKey];
    if (hand === undefined) continue;
    for (const [lineKey, lineLabel] of [["heartLine", "감정선"], ["headLine", "두뇌선"], ["lifeLine", "생명선"], ["fateLine", "운명선"]] as const) {
      const line = hand[lineKey];
      if (line === undefined || (line.confidence ?? 0) <= 0 || line.observedFeatures.startsWith("MOCK:")) continue;
      results.push(`${handLabel} ${lineLabel}: ${line.observedFeatures}${line.interpretation ? ` — ${line.interpretation}` : ""}`);
    }
  }
  return results.slice(0, MAX_SECTION_DETAILS);
}

function orderedSajuPoints(categories: IntegratedReadingInput["saju"]["interpretation"]["categories"]): readonly InterpretationPoint[] {
  return Object.values(categories).flat().sort((left, right) => right.weight - left.weight || left.ruleId.localeCompare(right.ruleId));
}

function sourceBoundaryNotes(nameStatus: IntegratedSourceStatus, palmStatus: IntegratedSourceStatus): readonly string[] {
  const notes: string[] = [];
  if (nameStatus !== "rule-based") notes.push("이름 결과는 현재 개인화 또는 mock 구조이므로 사주·타로와 같은 주제 근거로 합산하지 않았습니다.");
  if (palmStatus === "not-provided") notes.push("Palm 입력이 없어 손금 신호는 비교하지 않았습니다.");
  if (palmStatus === "mock-unobserved") notes.push("Palm mock은 실제 이미지 특징을 관찰하지 않으므로 통합 주제의 근거로 합산하지 않았습니다.");
  return notes;
}

function themeLabel(theme: Theme): string {
  return THEME_LABELS[theme];
}

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

function uniqueThemes(values: readonly Theme[]): readonly Theme[] {
  return [...new Set(values)];
}
