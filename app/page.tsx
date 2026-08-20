"use client";

import { useState, type FormEvent } from "react";
import { addTarotReading, createSajuReading, type FullReading, type SajuReading } from "../src/application/reading";
import { requestNarrative } from "../src/application/narrativeClient";
import { ganzhiName } from "../src/engine/saju/ganzhi";
import type { Element, FourPillars } from "../src/engine/saju/types";
import type { TarotQuestionCategory, TarotSpreadId } from "../src/engine/tarot/types";
import type { InterpretationCategory } from "../src/interpretation/saju/types";
import { THEME_LABELS } from "../src/interpretation/themes";
import { tarotCardImagePath } from "../src/ui/tarotCardImage";

const ELEMENTS = ["wood", "fire", "earth", "metal", "water"] as const satisfies readonly Element[];
const ELEMENT_LABEL: Readonly<Record<Element, string>> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
const CATEGORY_LABEL: Readonly<Record<InterpretationCategory, string>> = { personality: "성향", career: "일과 진로", wealth: "재물", relationship: "관계", health: "생활 균형", fortune: "올해의 흐름" };
const PILLAR_LABELS = [["year", "년주"], ["month", "월주"], ["day", "일주"], ["hour", "시주"]] as const;

export default function Home() {
  const [unknownTime, setUnknownTime] = useState(false);
  const [reading, setReading] = useState<SajuReading | FullReading>();
  const [error, setError] = useState<string>();
  const [spread, setSpread] = useState<TarotSpreadId>("three-guidance");
  const [category, setCategory] = useState<TarotQuestionCategory>("general");
  const [question, setQuestion] = useState("");
  const [narrative, setNarrative] = useState<string>();
  const [narrativeModel, setNarrativeModel] = useState<string>();
  const [narrativeError, setNarrativeError] = useState<string>();
  const [narrativeLoading, setNarrativeLoading] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(undefined);
    const values = new FormData(event.currentTarget);
    try {
      setReading(createSajuReading({
        date: String(values.get("date")), ...(unknownTime ? {} : { time: String(values.get("time")) }),
        unknownBirthTime: unknownTime, calendarType: "solar", gender: String(values.get("gender")) as "male" | "female",
        location: { country: "KR", city: "Seoul", timezone: "Asia/Seoul" },
      }, Date.now));
      setNarrative(undefined); setNarrativeModel(undefined); setNarrativeError(undefined);
    } catch (cause: unknown) { setError(cause instanceof Error ? cause.message : "입력값을 확인해 주세요."); }
  }

  function drawTarot() {
    if (!reading) return;
    const rng = () => crypto.getRandomValues(new Uint32Array(1))[0]! / 4_294_967_296;
    setReading(addTarotReading(reading, spread, category, rng));
    setNarrative(undefined); setNarrativeModel(undefined); setNarrativeError(undefined);
  }

  async function generateNarrative() {
    if (!reading || narrativeLoading) return;
    setNarrativeLoading(true); setNarrativeError(undefined);
    try {
      const result = await requestNarrative(reading, question);
      setNarrative(result.narrative); setNarrativeModel(result.model);
    } catch (cause: unknown) { setNarrativeError(cause instanceof Error ? cause.message : "상담문을 생성하지 못했습니다."); }
    finally { setNarrativeLoading(false); }
  }

  return <main>
    <header className="hero">
      <nav><a className="brand" href="#top"><span>結</span> 결</a><a href="#reading">리딩 시작</a></nav>
      <div className="hero-copy" id="top"><p className="eyebrow">SAJU × TAROT JOURNAL</p><h1>흐름을 읽고,<br/><em>선택을 기록하다.</em></h1><p className="lede">계산은 정확하게, 해석은 조심스럽게. 전통의 구조와 오늘의 질문을 한 화면에서 차분히 살펴보세요.</p><a className="primary-link" href="#reading">나의 결 알아보기 <span>↘</span></a></div>
      <div className="orb" aria-hidden="true"><span>木</span><span>火</span><span>土</span><span>金</span><span>水</span><i>結</i></div>
      <p className="hero-note">결과는 자기성찰을 위한 참고 자료이며 미래를 확정하지 않습니다.</p>
    </header>

    <section className="reading-shell" id="reading">
      <div className="section-heading"><p className="eyebrow">01 · BIRTH CHART</p><h2>당신이 태어난 순간</h2><p>양력과 한국 표준시를 기준으로 사주의 네 기둥을 계산합니다.</p></div>
      <form className="birth-form" onSubmit={submit}>
        <label><span>생년월일</span><input name="date" type="date" min="1900-01-01" max="2100-12-31" defaultValue="1995-05-15" required /></label>
        <label><span>태어난 시간</span><input name="time" type="time" defaultValue="12:00" disabled={unknownTime} required={!unknownTime}/><small>정확하지 않다면 모름을 선택하세요.</small></label>
        <fieldset><legend>성별</legend><label className="choice"><input type="radio" name="gender" value="female" defaultChecked/><span>여성</span></label><label className="choice"><input type="radio" name="gender" value="male"/><span>남성</span></label></fieldset>
        <label className="check"><input type="checkbox" checked={unknownTime} onChange={(event) => setUnknownTime(event.target.checked)}/><span>태어난 시간을 모릅니다</span></label>
        <div className="form-foot"><p>현재 지원: 양력 · Asia/Seoul · 1900–2100</p><button type="submit">사주 펼쳐보기 <span>→</span></button></div>
        {error && <p className="error" role="alert">{error}</p>}
      </form>
    </section>

    {reading && <>
      <section className="result-section">
        <div className="section-heading light"><p className="eyebrow">02 · FOUR PILLARS</p><h2>네 기둥에 담긴 구조</h2></div>
        <Pillars pillars={reading.core.fourPillars}/>
        <div className="element-panel"><div><p className="eyebrow">FIVE ELEMENTS</p><h3>오행의 분포</h3><p>생년월일시에서 계산된 글자를 목·화·토·금·수로 나누어 센 값입니다. 숫자가 많거나 적다고 해서 운의 좋고 나쁨이나 사주의 강약이 정해지는 것은 아닙니다.</p></div><div className="bars">{ELEMENTS.map((element) => { const count = reading.core.fiveElements.raw[element]; return <div className="bar-row" key={element}><b>{ELEMENT_LABEL[element]}</b><div><i style={{ width: `${count * 25}%` }}/></div><span>{count}</span></div>; })}</div></div>
      </section>
      <section className="interpretation">
        <div className="section-heading"><p className="eyebrow">03 · READING NOTES</p><h2>사주에서 읽어낸 이야기</h2><p>계산된 사주 구조에 미리 정해 둔 해석 규칙을 적용한 결과입니다.</p></div>
        <div className="note-grid">{Object.entries(reading.interpretation.categories).map(([key, points]) => <article key={key}><span>{CATEGORY_LABEL[key as InterpretationCategory]}</span>{points.length ? points.map((point) => <p key={point.ruleId}>{point.text}</p>) : <p>현재 제공할 수 있는 해석이 없습니다.</p>}</article>)}</div>
      </section>
      <section className="tarot-section">
        <div className="section-heading light"><p className="eyebrow">04 · TAROT REFLECTION</p><h2>오늘의 질문을 더해보세요</h2><p>카드는 예언이 아니라, 지금 다른 각도에서 볼 질문을 건넵니다.</p></div>
        <div className="tarot-controls"><label><span>펼침 방식</span><select value={spread} onChange={(event) => setSpread(event.target.value as TarotSpreadId)}><option value="one-card">한 장의 메시지</option><option value="three-guidance">상황 · 조언 · 방향</option><option value="three-timeline">과거 · 현재 · 미래</option><option value="five-card">다섯 장의 흐름</option></select></label><label><span>질문 주제</span><select value={category} onChange={(event) => setCategory(event.target.value as TarotQuestionCategory)}><option value="general">전체 흐름</option><option value="love">사랑</option><option value="career">진로</option><option value="wealth">재물</option><option value="relationship">관계</option></select></label><button onClick={drawTarot}>카드 펼치기 <span>✦</span></button></div>
        {"tarot" in reading && <div className="cards">{reading.tarot.cards.map((card, index) => <article className="tarot-card" key={`${card.cardId}-${index}`}><div className="card-face"><img className={card.orientation === "reversed" ? "reversed" : undefined} src={tarotCardImagePath(card.cardId)} alt={`${card.cardName} 타로 카드`}/><small>{String(index + 1).padStart(2, "0")}</small><em>{card.orientation === "reversed" ? "역방향" : "정방향"}</em></div><p className="position">{card.position.label}</p><h3>{card.cardName}</h3><p>{card.text}</p><div>{card.keywords.map((word) => <span key={word}>#{word}</span>)}</div></article>)}</div>}
      </section>
      {"combined" in reading && <section className="combined"><p className="eyebrow">05 · TWO LENSES</p><h2>사주와 타로를 함께 보면</h2><p className="combined-intro">두 리딩에서 반복된 주제와 함께 챙기면 좋은 점을 행동 중심으로 정리했습니다.</p><div className="signal-grid"><article><span>두 리딩에서 함께 보인 주제</span>{reading.combined.agreements.length ? <ul>{reading.combined.agreements.map((theme) => <li key={theme}>{THEME_LABELS[theme]}</li>)}</ul> : <p>이번 리딩에서는 뚜렷하게 겹치는 주제가 없습니다.</p>}</article><article><span>함께 챙기면 좋은 점</span>{reading.combined.complementarySignals.length ? <ul>{reading.combined.complementarySignals.map((item) => <li key={item.relationId}>{item.explanation}</li>)}</ul> : <p>별도로 덧붙일 조언은 없습니다.</p>}</article><article><span>서로 충돌할 수 있는 점</span>{reading.combined.tensions.length ? <ul>{reading.combined.tensions.map((item) => <li key={item.relationId}>{item.explanation}</li>)}</ul> : <p>서로 충돌하는 흐름은 두드러지지 않습니다.</p>}</article></div></section>}
      <section className="narrative-section">
        <div className="section-heading"><p className="eyebrow">06 · AI COUNSEL</p><h2>결과를 한 편의 상담문으로</h2><p>AI는 계산하지 않습니다. 위에서 확정된 계산값과 규칙 근거만 자연스러운 문장으로 연결합니다.</p></div>
        <div className="narrative-compose"><label><span>지금 가장 궁금한 점 <small>선택</small></span><textarea value={question} maxLength={500} onChange={(event) => setQuestion(event.target.value)} placeholder="예: 관계에서 지금 가장 먼저 점검할 부분은 무엇인가요?"/></label><button type="button" disabled={narrativeLoading} onClick={generateNarrative}>{narrativeLoading ? "상담문을 작성하고 있어요…" : "장문 상담 받아보기"}<span>✦</span></button>{narrativeError && <p className="error" role="alert">{narrativeError}</p>}</div>
        {narrative && <article className="narrative-result"><div><span>PERSONAL READING</span><small>{narrativeModel}</small></div><p>{narrative}</p></article>}
      </section>
      <aside className="limitations"><b>읽기 전에</b><p>{reading.interpretation.limitations.join(" ")}</p></aside>
    </>}
    <footer><a className="brand" href="#top"><span>結</span> 결</a><p>정확한 계산, 절제된 해석, 주체적인 선택.</p><small>© 2026 GYEOL · FOR REFLECTION ONLY</small></footer>
  </main>;
}

function Pillars({ pillars }: { readonly pillars: FourPillars }) {
  return <div className="pillars">{PILLAR_LABELS.map(([key, label]) => { const pillar = pillars[key]; return <article key={key}><span>{label}</span>{pillar ? <><strong>{pillar.stem.name}</strong><strong>{pillar.branch.name}</strong><small>{ganzhiName(pillar)}</small></> : <><strong className="empty">—</strong><strong className="empty">—</strong><small>시간 미상</small></>}</article>; })}</div>;
}
