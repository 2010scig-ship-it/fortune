"use client";

import { useEffect, useState } from "react";
import { createBrowserJournalRepository, JOURNAL_NOTE_MAX_LENGTH, type JournalEntry } from "../../src/journal";

export default function JournalPage() {
  const [entries, setEntries] = useState<readonly JournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string>();
  const [error, setError] = useState<string>();
  const selected = entries.find((entry) => entry.id === selectedId);

  useEffect(() => {
    const repository = createBrowserJournalRepository();
    const nextEntries = repository.list();
    const requestedId = new URLSearchParams(window.location.search).get("entry") ?? undefined;
    const nextSelected = requestedId && nextEntries.some((entry) => entry.id === requestedId)
      ? requestedId
      : nextEntries[0]?.id;
    setEntries(nextEntries);
    setSelectedId(nextSelected);
    setNote(nextEntries.find((entry) => entry.id === nextSelected)?.note ?? "");
  }, []);

  function selectEntry(entry: JournalEntry) {
    setSelectedId(entry.id);
    setNote(entry.note);
    setStatus(undefined);
    setError(undefined);
    window.history.replaceState(null, "", `/journal?entry=${encodeURIComponent(entry.id)}`);
  }

  function updateNote() {
    if (!selected) return;
    setError(undefined);
    try {
      const updated = createBrowserJournalRepository().updateNote(selected.id, note);
      const nextEntries = createBrowserJournalRepository().list();
      setEntries(nextEntries);
      setNote(updated.note);
      setStatus(`${formatDateTime(updated.updatedAt)} 수정되었습니다.`);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "메모를 수정하지 못했습니다.");
    }
  }

  return <main className="journal-page">
    <header className="journal-header">
      <nav><a className="brand" href="/"><span>結</span> 결</a><div className="nav-links"><a href="/">새 리딩</a><a href="#journal-list">Journal</a></div></nav>
      <div><p className="eyebrow">GYEOL · PERSONAL ARCHIVE</p><h1>Journal</h1><p>지나간 리딩과 그날의 생각을 다시 읽습니다. 기록은 현재 브라우저에만 저장됩니다.</p></div>
    </header>

    <section className="journal-layout" id="journal-list">
      <aside className="journal-list-panel">
        <div><p className="eyebrow">PAST READINGS</p><h2>지난 기록</h2><span>{entries.length}개의 기록</span></div>
        {entries.length === 0
          ? <div className="journal-empty"><p>아직 저장한 리딩이 없습니다.</p><a href="/">첫 리딩 시작하기 →</a></div>
          : <ol>{entries.map((entry) => <li key={entry.id}><button type="button" className={entry.id === selectedId ? "active" : ""} onClick={() => selectEntry(entry)}><time>{formatDate(entry.createdAt)}</time><strong>{entry.question.text}</strong><span>{entry.headline}</span><small>{entry.tarotCards.length} CARD · PALM {entry.palm.analyzed ? "YES" : "NO"}</small></button></li>)}</ol>}
      </aside>

      <section className="journal-detail">
        {selected ? <JournalDetail entry={selected} note={note} status={status} error={error} onNoteChange={setNote} onSave={updateNote}/> : <div className="journal-detail-empty"><span>結</span><h2>기록을 선택해 주세요</h2><p>저장한 통합 리딩의 핵심 메시지와 메모를 이곳에서 다시 볼 수 있습니다.</p></div>}
      </section>
    </section>
  </main>;
}

function JournalDetail({ entry, note, status, error, onNoteChange, onSave }: {
  readonly entry: JournalEntry;
  readonly note: string;
  readonly status: string | undefined;
  readonly error: string | undefined;
  readonly onNoteChange: (value: string) => void;
  readonly onSave: () => void;
}) {
  const reading = entry.integratedReading;
  return <article>
    <div className="journal-detail-head"><p className="eyebrow">{formatDateTime(entry.createdAt)}</p><h2>{entry.headline}</h2><blockquote>{entry.question.category} · {entry.question.text}</blockquote><p>{reading.overview}</p></div>

    <section className="journal-source-grid">
      <SourceSummary label="SAJU" summary={reading.sajuSection.summary} details={reading.sajuSection.details}/>
      <SourceSummary label="NAME" summary={reading.nameSection.summary} details={reading.nameSection.details}/>
      <SourceSummary label="TAROT" summary={reading.tarotSection.summary} details={entry.tarotCards.map((card) => `${card.position} · ${card.cardName} (${card.orientation === "upright" ? "정방향" : "역방향"})`)}/>
      <SourceSummary label="PALM" summary={reading.palmSection.summary} details={reading.palmSection.details}/>
    </section>

    <section className="journal-signals">
      <div><span>공통 메시지</span><ul>{reading.convergence.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div><span>다른 신호와 한계</span><ul>{reading.divergence.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div><span>현재의 초점</span><p>{reading.currentFocus}</p></div>
    </section>

    <section className="journal-actions"><span>오늘의 선택</span><ol>{reading.actionGuide.map((item) => <li key={item}>{item}</li>)}</ol></section>

    <section className="journal-note-editor">
      <div><span>JOURNAL NOTE</span><p>{reading.journalPrompt}</p></div>
      <label><b>나의 메모</b><textarea value={note} maxLength={JOURNAL_NOTE_MAX_LENGTH} onChange={(event) => onNoteChange(event.target.value)}/><small>{note.length.toLocaleString("ko-KR")} / {JOURNAL_NOTE_MAX_LENGTH.toLocaleString("ko-KR")}</small></label>
      <button type="button" onClick={onSave}>메모 수정 저장</button>
      {status && <p className="save-success" role="status">{status}</p>}
      {error && <p className="error" role="alert">{error}</p>}
    </section>

    <aside className="journal-privacy">{reading.disclaimer} 손바닥 원본 이미지는 Journal에 저장하지 않습니다.</aside>
  </article>;
}

function SourceSummary({ label, summary, details }: { readonly label: string; readonly summary: string; readonly details: readonly string[] }) {
  return <article><span>{label}</span><p>{summary}</p>{details.length > 0 && <ul>{details.map((item) => <li key={item}>{item}</li>)}</ul>}</article>;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "long", timeStyle: "short" }).format(new Date(value));
}
