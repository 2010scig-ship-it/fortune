"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { JournalComposer, type JournalSaveResult } from "../components/journal/JournalComposer";
import { PalmStep } from "../components/palm/PalmStep";
import { ReadingProgress } from "../components/reading/ReadingProgress";
import { TarotCards } from "../components/tarot/TarotCards";
import { TarotSpreadSelector } from "../components/tarot/TarotSpreadSelector";
import { requestNarrative } from "../src/application/narrativeClient";
import { analyzePalmStep } from "../src/application/palmAnalysis";
import {
  createEmptyPalmStepState,
  clearPalmImage,
  palmInputSummary,
  releasePalmPreviewUrls,
  selectPalmSide,
  setPalmImage,
  type PalmImageDraft,
  type PalmSide,
} from "../src/application/palmFlow";
import { addTarotReading, createSajuReading, type FullReading, type SajuReading } from "../src/application/reading";
import {
  QUESTION_CATEGORY_LABELS,
  birthDataFromProfile,
  createUserProfile,
  questionCategoryToTarot,
  type ReadingFlowStep,
  type ReadingQuestionCategory,
  type UserProfile,
} from "../src/application/readingFlow";
import { getReadingTarotSpreadOption, type ReadingTarotSpreadId } from "../src/application/tarotFlow";
import { mockNameAnalyzer, type NameResult } from "../src/engine/name";
import { createLocalPalmImageUploader, mockPalmAnalyzer, type PalmHandResult, type PalmResult } from "../src/engine/palm";
import { ganzhiName } from "../src/engine/saju/ganzhi";
import type { Element, FourPillars } from "../src/engine/saju/types";
import type { TarotQuestionCategory } from "../src/engine/tarot/types";
import type { InterpretationCategory } from "../src/interpretation/saju/types";
import { createIntegratedReading, type IntegratedReading } from "../src/interpretation/integrated";
import { createBrowserJournalRepository, type JournalEntryDraft } from "../src/journal";

const ELEMENTS = ["wood", "fire", "earth", "metal", "water"] as const satisfies readonly Element[];
const ELEMENT_LABEL: Readonly<Record<Element, string>> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
const CATEGORY_LABEL: Readonly<Record<InterpretationCategory, string>> = { personality: "성향", career: "일과 진로", wealth: "재물", relationship: "관계", health: "생활 균형", fortune: "올해의 흐름" };
const PILLAR_LABELS = [["year", "년주"], ["month", "월주"], ["day", "일주"], ["hour", "시주"]] as const;
const QUESTION_CATEGORIES = Object.keys(QUESTION_CATEGORY_LABELS) as readonly ReadingQuestionCategory[];
const PALM_LINE_LABELS = [
  ["heartLine", "감정선"],
  ["headLine", "두뇌선"],
  ["lifeLine", "생명선"],
  ["fateLine", "운명선"],
] as const satisfies readonly (readonly [keyof PalmHandResult, string])[];

export default function Home() {
  const [step, setStep] = useState<ReadingFlowStep>("birth");
  const [unknownTime, setUnknownTime] = useState(false);
  const [profile, setProfile] = useState<UserProfile>();
  const [nameResult, setNameResult] = useState<NameResult>();
  const [reading, setReading] = useState<SajuReading | FullReading>();
  const [flowError, setFlowError] = useState<string>();
  const [spread, setSpread] = useState<ReadingTarotSpreadId>("three-guidance");
  const [palmState, setPalmState] = useState(createEmptyPalmStepState);
  const [palmResult, setPalmResult] = useState<PalmResult>();
  const [palmAnalyzing, setPalmAnalyzing] = useState(false);
  const [palmAnalysisError, setPalmAnalysisError] = useState<string>();
  const [questionCategory, setQuestionCategory] = useState<ReadingQuestionCategory>("self");
  const [tarotCategory, setTarotCategory] = useState<TarotQuestionCategory>("general");
  const [question, setQuestion] = useState("");
  const [reviewUnlocked, setReviewUnlocked] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  const [integratedReading, setIntegratedReading] = useState<IntegratedReading>();
  const [narrative, setNarrative] = useState<string>();
  const [narrativeModel, setNarrativeModel] = useState<string>();
  const [narrativeError, setNarrativeError] = useState<string>();
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const palmStateRef = useRef(palmState);

  useEffect(() => {
    palmStateRef.current = palmState;
  }, [palmState]);

  useEffect(() => () => {
    releasePalmPreviewUrls(palmStateRef.current, URL.revokeObjectURL);
  }, []);

  const fullReading = reading && hasTarot(reading) ? reading : undefined;
  const unlockedThrough = profile === undefined ? 0 : question.trim() === "" ? 1 : fullReading === undefined ? 2 : reviewUnlocked ? 4 : 3;
  function changeStep(nextStep: ReadingFlowStep) {
    setFlowError(undefined);
    setStep(nextStep);
  }

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFlowError(undefined);
    const values = new FormData(event.currentTarget);
    try {
      const nextProfile = createUserProfile({
        name: String(values.get("name")),
        hanjaName: String(values.get("hanjaName")),
        birthDate: String(values.get("date")),
        birthTime: String(values.get("time")),
        unknownBirthTime: unknownTime,
        gender: String(values.get("gender")) as "female" | "male",
      }, () => crypto.randomUUID());
      setProfile(nextProfile);
      setNameResult(mockNameAnalyzer.analyze({ name: nextProfile.name, ...(nextProfile.hanjaName ? { hanjaName: nextProfile.hanjaName } : {}) }));
      setReading(createSajuReading(birthDataFromProfile(nextProfile), Date.now));
      releasePalmPreviewUrls(palmStateRef.current, URL.revokeObjectURL);
      const emptyPalmState = createEmptyPalmStepState();
      palmStateRef.current = emptyPalmState;
      setPalmState(emptyPalmState);
      setPalmResult(undefined);
      setPalmAnalysisError(undefined);
      setReviewUnlocked(false);
      setResultReady(false);
      setIntegratedReading(undefined);
      clearNarrative();
      setStep("question");
    } catch (cause: unknown) {
      setFlowError(cause instanceof Error ? cause.message : "입력값을 확인해 주세요.");
    }
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (trimmedQuestion === "") {
      setFlowError("지금 가장 궁금한 점을 한 문장으로 적어 주세요.");
      return;
    }
    setQuestion(trimmedQuestion);
    setTarotCategory(questionCategoryToTarot(questionCategory));
    if (reading) setReading(toSajuReading(reading));
    setReviewUnlocked(false);
    setResultReady(false);
    setIntegratedReading(undefined);
    clearNarrative();
    setFlowError(undefined);
    setStep("tarot");
  }

  function drawTarot() {
    if (!reading) return;
    const rng = () => crypto.getRandomValues(new Uint32Array(1))[0]! / 4_294_967_296;
    setReading(addTarotReading(toSajuReading(reading), spread, tarotCategory, rng));
    setReviewUnlocked(false);
    setResultReady(false);
    setIntegratedReading(undefined);
    clearNarrative();
    setFlowError(undefined);
  }

  function changeTarotSpread(nextSpread: ReadingTarotSpreadId) {
    if (nextSpread === spread) return;
    setSpread(nextSpread);
    if (reading) setReading(toSajuReading(reading));
    setReviewUnlocked(false);
    setResultReady(false);
    setIntegratedReading(undefined);
    clearNarrative();
    setFlowError(undefined);
  }

  function continueFromTarot() {
    if (!fullReading) {
      setFlowError("검토로 넘어가기 전에 카드를 펼쳐 주세요.");
      return;
    }
    setFlowError(undefined);
    setStep("palm");
  }

  function changePalmSide(side: PalmSide) {
    const next = selectPalmSide(palmStateRef.current, side);
    palmStateRef.current = next;
    setPalmState(next);
  }

  function acceptPalmImage(side: PalmSide, image: PalmImageDraft) {
    const previous = palmStateRef.current.hands[side];
    if (previous.status === "ready") URL.revokeObjectURL(previous.image.previewUrl);
    const next = setPalmImage(palmStateRef.current, side, image);
    palmStateRef.current = next;
    setPalmState(next);
    setPalmResult(undefined);
    setIntegratedReading(undefined);
    setPalmAnalysisError(undefined);
  }

  function removePalmImage(side: PalmSide) {
    const previous = palmStateRef.current.hands[side];
    if (previous.status === "ready") URL.revokeObjectURL(previous.image.previewUrl);
    const next = clearPalmImage(palmStateRef.current, side);
    palmStateRef.current = next;
    setPalmState(next);
    setPalmResult(undefined);
    setIntegratedReading(undefined);
    setPalmAnalysisError(undefined);
  }

  async function continueFromPalm() {
    if (palmAnalyzing) return;
    setPalmAnalyzing(true);
    setPalmAnalysisError(undefined);
    try {
      const result = await analyzePalmStep(palmStateRef.current, createLocalPalmImageUploader(), mockPalmAnalyzer);
      setPalmResult(result);
      setIntegratedReading(undefined);
      setReviewUnlocked(true);
      setStep("review");
    } catch (cause: unknown) {
      setPalmAnalysisError(cause instanceof Error ? cause.message : "PalmResult를 생성하지 못했습니다.");
    } finally {
      setPalmAnalyzing(false);
    }
  }

  function generateReading() {
    if (!fullReading || !profile || !nameResult) return;
    setIntegratedReading(createIntegratedReading({
      profile: { name: profile.name, ...(profile.hanjaName ? { hanjaName: profile.hanjaName } : {}) },
      question: { category: QUESTION_CATEGORY_LABELS[questionCategory], text: question },
      saju: fullReading,
      name: nameResult,
      tarot: fullReading.tarot,
      ...(palmResult ? { palm: palmResult } : {}),
    }));
    setResultReady(true);
    requestAnimationFrame(() => document.getElementById("integrated-reading")?.scrollIntoView({ behavior: "smooth" }));
  }

  async function generateNarrative() {
    if (!fullReading || !integratedReading || narrativeLoading) return;
    setNarrativeLoading(true);
    setNarrativeError(undefined);
    try {
      const result = await requestNarrative(fullReading, question, profile, {
        integratedReading,
        ...(nameResult ? { nameResult } : {}),
        ...(palmResult ? { palmResult } : {}),
      });
      setNarrative(result.narrative);
      setNarrativeModel(result.model);
    } catch (cause: unknown) {
      setNarrativeError(cause instanceof Error ? cause.message : "상담문을 생성하지 못했습니다.");
    } finally {
      setNarrativeLoading(false);
    }
  }

  function clearNarrative() {
    setNarrative(undefined);
    setNarrativeModel(undefined);
    setNarrativeError(undefined);
  }

  function saveJournal(note: string, existingId?: string): JournalSaveResult {
    if (!fullReading || !profile || !integratedReading) throw new Error("저장할 통합 리딩이 없습니다.");
    const repository = createBrowserJournalRepository();
    const entry = existingId
      ? repository.updateNote(existingId, note)
      : repository.create(createJournalDraft(fullReading, profile, integratedReading, questionCategory, question, palmResult, note));
    return { id: entry.id, updatedAt: entry.updatedAt };
  }

  return <main>
    <header className="hero">
      <nav><a className="brand" href="#top"><span>結</span> 결</a><div className="nav-links"><a href="/journal">Journal</a><a href="#reading">리딩 시작</a></div></nav>
      <div className="hero-copy" id="top">
        <p className="eyebrow">SAJU · NAME · TAROT · PALM</p>
        <h1>나를 읽는,<br/><em>네 가지 시선.</em></h1>
        <p className="lede">타고난 구조, 이름의 상징, 오늘의 질문, 손에 남은 특징을 한 흐름으로 잇습니다. 계산은 정확하게, 해석은 조심스럽게.</p>
        <a className="primary-link" href="#reading">나의 결 시작하기 <span>↘</span></a>
      </div>
      <div className="orb" aria-hidden="true"><span>生</span><span>名</span><span>問</span><span>手</span><i>結</i></div>
      <p className="hero-note">결과는 자기성찰을 위한 참고 자료이며 미래를 확정하지 않습니다.</p>
    </header>

    <section className="flow-nav" id="reading">
      <div><p className="eyebrow">READING FLOW</p><h2>한 단계씩, 천천히</h2></div>
      <ReadingProgress activeStep={step} unlockedThrough={unlockedThrough} onStepChange={changeStep}/>
    </section>

    {step === "birth" && <section className="reading-shell flow-stage">
      <div className="section-heading"><p className="eyebrow">STEP 01 · BIRTH</p><h2>당신을 부를 이름과 태어난 순간</h2><p>이름은 리딩의 개인화에 사용됩니다. 한자 이름을 입력하면 이름의 구조도 함께 살펴볼 준비를 합니다.</p></div>
      <form className="birth-form" onSubmit={submitProfile}>
        <label><span>이름 <b>필수</b></span><input name="name" type="text" maxLength={40} defaultValue={profile?.name} placeholder="예: 김결" required/><small>리딩 전반에서 사용할 이름입니다.</small></label>
        <label><span>한자 이름 <b>선택</b></span><input name="hanjaName" type="text" maxLength={40} defaultValue={profile?.hanjaName} placeholder="예: 金結"/><small>없으면 정식 성명학 계산을 하지 않습니다.</small></label>
        <label><span>생년월일</span><input name="date" type="date" min="1900-01-01" max="2100-12-31" defaultValue={profile?.birthDate ?? "1995-05-15"} required/></label>
        <label><span>태어난 시간</span><input name="time" type="time" defaultValue={profile?.birthTime ?? "12:00"} disabled={unknownTime} required={!unknownTime}/><small>정확하지 않다면 모름을 선택하세요.</small></label>
        <fieldset><legend>성별</legend><label className="choice"><input type="radio" name="gender" value="female" defaultChecked={profile?.gender !== "male"}/><span>여성</span></label><label className="choice"><input type="radio" name="gender" value="male" defaultChecked={profile?.gender === "male"}/><span>남성</span></label></fieldset>
        <label className="check"><input type="checkbox" checked={unknownTime} onChange={(event) => setUnknownTime(event.target.checked)}/><span>태어난 시간을 모릅니다</span></label>
        <div className="form-foot"><p>현재 지원: 양력 · Asia/Seoul · 1900–2100</p><button type="submit">사주 계산하고 계속 <span>→</span></button></div>
        {flowError && <p className="error" role="alert">{flowError}</p>}
      </form>
    </section>}

    {step === "question" && <section className="reading-shell flow-stage question-stage">
      <div className="section-heading"><p className="eyebrow">STEP 02 · QUESTION</p><h2>지금 마음에 머무는 질문</h2><p>이 질문은 타로와 최종 통합 리딩이 바라볼 중심 문맥이 됩니다.</p></div>
      <form className="question-form" onSubmit={submitQuestion}>
        <fieldset><legend>질문 주제</legend><div className="question-categories">{QUESTION_CATEGORIES.map((item) => <label className="category-choice" key={item}><input type="radio" name="questionCategory" value={item} checked={questionCategory === item} onChange={() => setQuestionCategory(item)}/><span>{QUESTION_CATEGORY_LABELS[item]}</span></label>)}</div></fieldset>
        <label><span>현재 질문</span><textarea value={question} maxLength={500} onChange={(event) => setQuestion(event.target.value)} placeholder="예: 지금의 일을 계속 이어 갈 때 무엇을 먼저 확인해야 할까요?" required/></label>
        {flowError && <p className="error" role="alert">{flowError}</p>}
        <div className="step-actions"><button type="button" className="secondary-button" onClick={() => changeStep("birth")}>이전</button><button type="submit" className="primary-button">질문 저장하고 계속 <span>→</span></button></div>
      </form>
    </section>}

    {step === "tarot" && <section className="tarot-section flow-stage">
      <div className="section-heading light"><p className="eyebrow">STEP 03 · TAROT</p><h2>질문을 다른 각도에서 보기</h2><p>카드는 예언이 아니라, 지금 놓치고 있는 관점과 선택의 조건을 살펴보는 도구입니다.</p></div>
      <div className="question-context"><span>{QUESTION_CATEGORY_LABELS[questionCategory]}</span><p>{question}</p></div>
      <TarotSpreadSelector value={spread} onChange={changeTarotSpread}/>
      <div className="tarot-draw-bar"><div><span>선택한 방식</span><b>{getReadingTarotSpreadOption(spread).title}</b></div><button type="button" onClick={drawTarot}>{fullReading ? "카드 다시 펼치기" : "카드 펼치기"} <span>✦</span></button></div>
      {fullReading && <TarotCards cards={fullReading.tarot.cards}/>}
      {flowError && <p className="error" role="alert">{flowError}</p>}
      <div className="step-actions dark-actions"><button type="button" className="secondary-button" onClick={() => changeStep("question")}>이전</button><button type="button" className="primary-button" onClick={continueFromTarot}>Palm 단계로 <span>→</span></button></div>
    </section>}

    {step === "palm" && <PalmStep
      state={palmState}
      onSelectSide={changePalmSide}
      onAcceptImage={acceptPalmImage}
      onClearImage={removePalmImage}
      onBack={() => changeStep("tarot")}
      onContinue={continueFromPalm}
      analyzing={palmAnalyzing}
      analysisError={palmAnalysisError}
    />}

    {step === "review" && profile && <section className="review-section flow-stage">
      <div className="section-heading"><p className="eyebrow">STEP 05 · REVIEW & GENERATE</p><h2>리딩을 만들기 전, 마지막 확인</h2><p>수정이 필요한 항목은 해당 단계로 돌아가 바꿀 수 있습니다.</p></div>
      <div className="review-grid">
        <ReviewItem label="이름" value={`${profile.name}${profile.hanjaName ? ` · ${profile.hanjaName}` : " · 한자 이름 없음"}`} onEdit={() => changeStep("birth")}/>
        <ReviewItem label="생년월일" value={profile.birthDate} onEdit={() => changeStep("birth")}/>
        <ReviewItem label="출생시간" value={profile.unknownBirthTime ? "모름" : profile.birthTime ?? "모름"} onEdit={() => changeStep("birth")}/>
        <ReviewItem label="질문" value={`${QUESTION_CATEGORY_LABELS[questionCategory]} · ${question}`} onEdit={() => changeStep("question")}/>
        <ReviewItem label="Tarot" value={`${getReadingTarotSpreadOption(spread).title} · ${getReadingTarotSpreadOption(spread).positionLabels.join(" / ")}`} onEdit={() => changeStep("tarot")}/>
        <ReviewItem label="Palm" value={`${palmInputSummary(palmState)} · ${palmResult ? "mock PalmResult 생성됨" : "분석 없음"}`} onEdit={() => changeStep("palm")}/>
      </div>
      <div className="generate-panel"><p>구조화된 사주·이름·타로·Palm 결과를 각 출처의 확인 범위 안에서 하나의 리딩으로 연결합니다.</p><button type="button" onClick={generateReading}>통합 리딩 생성하기 <span>✦</span></button></div>
    </section>}

    {resultReady && fullReading && profile && nameResult && integratedReading && <>
      <section className="integrated-hero" id="integrated-reading">
        <p className="eyebrow">TODAY&apos;S GYEOL</p><h2>오늘의 結</h2>
        <p className="integrated-headline">{integratedReading.headline}</p>
        <p className="integrated-overview">{integratedReading.overview}</p>
        <blockquote>{question}</blockquote>
      </section>

      <section className="result-section">
        <div className="section-heading light"><p className="eyebrow">01 · SAJU</p><h2>나의 기본 흐름</h2><p>생년월일시를 결정론적 TypeScript 엔진으로 계산한 결과입니다.</p></div>
        <Pillars pillars={fullReading.core.fourPillars}/>
        <div className="element-panel"><div><p className="eyebrow">FIVE ELEMENTS</p><h3>오행의 분포</h3><p>생년월일시에서 계산된 글자를 목·화·토·금·수로 나누어 센 값입니다. 숫자가 많거나 적다고 해서 운의 좋고 나쁨이나 사주의 강약이 정해지는 것은 아닙니다.</p></div><div className="bars">{ELEMENTS.map((element) => { const count = fullReading.core.fiveElements.raw[element]; return <div className="bar-row" key={element}><b>{ELEMENT_LABEL[element]}</b><div><i style={{ width: `${count * 25}%` }}/></div><span>{count}</span></div>; })}</div></div>
      </section>

      <section className="interpretation">
        <div className="section-heading"><p className="eyebrow">SAJU READING NOTES</p><h2>사주에서 읽어낸 이야기</h2><p>계산된 사주 구조에 미리 정해 둔 해석 규칙을 적용한 결과입니다.</p></div>
        <div className="note-grid">{Object.entries(fullReading.interpretation.categories).map(([key, points]) => <article key={key}><span>{CATEGORY_LABEL[key as InterpretationCategory]}</span>{points.length ? points.map((point) => <p key={point.ruleId}>{point.text}</p>) : <p>현재 제공할 수 있는 해석이 없습니다.</p>}</article>)}</div>
      </section>

      <section className="name-result-section">
        <div className="section-heading"><p className="eyebrow">02 · NAME</p><h2>이름의 결</h2><p>이름을 리딩의 개인화에 사용하되, 계산하지 않은 성명학 결과를 가장하지 않습니다.</p></div>
        <article className="name-result-card"><span>{nameResult.mode === "personalization-only" ? "이름 개인화" : "한자 구조 · MOCK"}</span><h3>{nameResult.displayName}{nameResult.hanjaName ? <small>{nameResult.hanjaName}</small> : null}</h3><p>{nameResult.summary}</p><ul>{nameResult.observations.map((item) => <li key={item}>{item}</li>)}</ul><aside>{nameResult.limitations.join(" ")}</aside></article>
      </section>

      <section className="question-result-section">
        <div className="section-heading"><p className="eyebrow">03 · QUESTION</p><h2>지금의 질문</h2></div>
        <div className="question-result"><span>{QUESTION_CATEGORY_LABELS[questionCategory]}</span><blockquote>{question}</blockquote></div>
      </section>

      <section className="tarot-section">
        <div className="section-heading light"><p className="eyebrow">04 · TAROT</p><h2>카드가 보여주는 것</h2><p>선택된 카드의 기본 의미를 현재 질문과 연결한 규칙 기반 해석입니다.</p></div>
        <TarotCards cards={fullReading.tarot.cards}/>
      </section>

      <section className="palm-result-placeholder">
        <div className="section-heading"><p className="eyebrow">05 · PALM</p><h2>손에 남은 결</h2><p>최적화된 사진을 교체 가능한 uploader와 Palm Analyzer에 전달한 구조화 결과입니다.</p></div>
        <PalmResultView result={palmResult}/>
      </section>

      <section className="combined"><p className="eyebrow">06 · INTEGRATED READING</p><h2>네 가지 해석이 만나는 자리</h2><p className="combined-intro">{integratedReading.overview}</p><div className="source-summary-grid"><p><b>SAJU</b>{integratedReading.sajuSection.summary}</p><p><b>NAME</b>{integratedReading.nameSection.summary}</p><p><b>TAROT</b>{integratedReading.tarotSection.summary}</p><p><b>PALM</b>{integratedReading.palmSection.summary}</p></div><div className="signal-grid"><article><span>공통적으로 나타나는 메시지</span><ul>{integratedReading.convergence.map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>서로 다르거나 아직 확인할 수 없는 점</span><ul>{integratedReading.divergence.map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>지금 가장 중요한 초점</span><p>{integratedReading.currentFocus}</p></article></div></section>

      <section className="action-guide-section">
        <div className="section-heading"><p className="eyebrow">07 · TODAY&apos;S CHOICE</p><h2>오늘의 선택</h2><p>미래를 단정하는 대신 지금 확인하거나 직접 선택할 수 있는 행동으로 바꿨습니다.</p></div>
        <ol>{integratedReading.actionGuide.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol>
      </section>

      <section className="journal-placeholder">
        <div className="section-heading"><p className="eyebrow">08 · JOURNAL NOTE</p><h2>생각을 남길 자리</h2><p>현재 통합 결과와 메모를 이 브라우저의 Journal에 저장하고 이후 수정할 수 있습니다.</p></div>
        <JournalComposer prompt={integratedReading.journalPrompt} onSave={saveJournal}/>
      </section>

      <section className="narrative-section">
        <div className="section-heading"><p className="eyebrow">AI COUNSEL</p><h2>결과를 한 편의 상담문으로</h2><p>AI는 계산하거나 사진을 판독하지 않습니다. 위에서 확정된 구조화 결과와 질문만 자연스러운 문장으로 연결합니다.</p></div>
        <div className="narrative-compose"><button type="button" disabled={narrativeLoading} onClick={generateNarrative}>{narrativeLoading ? "상담문을 작성하고 있어요…" : "장문 상담 받아보기"}<span>✦</span></button>{narrativeError && <p className="error" role="alert">{narrativeError}</p>}</div>
        {narrative && <article className="narrative-result"><div><span>PERSONAL READING</span><small>{narrativeModel}</small></div><p>{narrative}</p></article>}
      </section>
      <aside className="limitations"><b>읽기 전에</b><p>{integratedReading.disclaimer}</p></aside>
    </>}

    <footer><a className="brand" href="#top"><span>結</span> 결</a><p>정확한 계산, 절제된 해석, 주체적인 선택. · <a href="/journal">Journal 보기</a></p><small>© 2026 GYEOL · FOR REFLECTION ONLY</small></footer>
  </main>;
}

function hasTarot(reading: SajuReading | FullReading): reading is FullReading {
  return "tarot" in reading;
}

function toSajuReading(reading: SajuReading | FullReading): SajuReading {
  return { core: reading.core, sewoon: reading.sewoon, interpretation: reading.interpretation };
}

function ReviewItem({ label, value, onEdit }: { readonly label: string; readonly value: string; readonly onEdit: () => void }) {
  return <article><span>{label}</span><p>{value}</p><button type="button" onClick={onEdit}>수정</button></article>;
}

function Pillars({ pillars }: { readonly pillars: FourPillars }) {
  return <div className="pillars">{PILLAR_LABELS.map(([key, label]) => { const pillar = pillars[key]; return <article key={key}><span>{label}</span>{pillar ? <><strong>{pillar.stem.name}</strong><strong>{pillar.branch.name}</strong><small>{ganzhiName(pillar)}</small></> : <><strong className="empty">—</strong><strong className="empty">—</strong><small>시간 미상</small></>}</article>; })}</div>;
}

function createJournalDraft(
  reading: FullReading,
  profile: UserProfile,
  integratedReading: IntegratedReading,
  questionCategory: ReadingQuestionCategory,
  question: string,
  palmResult: PalmResult | undefined,
  note: string,
): JournalEntryDraft {
  return {
    profile: { displayName: profile.name },
    question: { category: QUESTION_CATEGORY_LABELS[questionCategory], text: question },
    headline: integratedReading.headline,
    tarotCards: reading.tarot.cards.map((card) => ({
      cardId: card.cardId,
      cardName: card.cardName,
      orientation: card.orientation,
      position: card.position.label,
    })),
    palm: palmResult ? { analyzed: true, result: palmResult } : { analyzed: false },
    integratedReading,
    note,
  };
}

function PalmResultView({ result }: { readonly result: PalmResult | undefined }) {
  if (result === undefined) {
    return <div className="empty-result"><span>NOT ANALYZED</span><p>손바닥 사진을 선택하지 않아 Palm Analyzer를 실행하지 않았습니다.</p></div>;
  }

  const hands = [["leftHand", "왼손"], ["rightHand", "오른손"]] as const;
  return <div className="palm-result-data">
    <div className="palm-result-summary"><span>PALM ANALYZER · {result.mode.toUpperCase()}</span><p>{result.summary}</p></div>
    {hands.map(([key, label]) => {
      const hand = result[key];
      if (hand === undefined) return null;
      return <article className="palm-hand-result" key={key}>
        <h3>{label}</h3>
        <div>{PALM_LINE_LABELS.map(([lineKey, lineLabel]) => {
          const line = hand[lineKey];
          if (line === undefined) return null;
          return <section key={lineKey}>
            <span>{lineLabel} · 관찰 confidence {Math.round((line.confidence ?? 0) * 100)}%</span>
            <dl><dt>관찰</dt><dd>{line.observedFeatures}</dd><dt>전통적 의미</dt><dd>{line.traditionalMeaning}</dd><dt>해석</dt><dd>{line.interpretation ?? "현재 제공할 수 있는 해석이 없습니다."}</dd></dl>
          </section>;
        })}</div>
      </article>;
    })}
    <aside>{result.limitations.join(" ")}</aside>
  </div>;
}
