"use client";

import { useState } from "react";
import { JOURNAL_NOTE_MAX_LENGTH } from "../../src/journal";

export interface JournalSaveResult {
  readonly id: string;
  readonly updatedAt: string;
}

export interface JournalComposerProps {
  readonly prompt: string;
  readonly onSave: (note: string, existingId?: string) => JournalSaveResult;
}

export function JournalComposer({ prompt, onSave }: JournalComposerProps) {
  const [note, setNote] = useState("");
  const [entryId, setEntryId] = useState<string>();
  const [savedAt, setSavedAt] = useState<string>();
  const [error, setError] = useState<string>();

  function save() {
    setError(undefined);
    try {
      const result = onSave(note, entryId);
      setEntryId(result.id);
      setSavedAt(result.updatedAt);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "저널을 저장하지 못했습니다.");
    }
  }

  return <div className="journal-composer">
    <span>오늘의 기록 질문</span>
    <p>{prompt}</p>
    <label>
      <b>나의 메모</b>
      <textarea
        value={note}
        maxLength={JOURNAL_NOTE_MAX_LENGTH}
        onChange={(event) => setNote(event.target.value)}
        placeholder="지금 떠오르는 생각, 확인할 사실, 다음 행동을 자유롭게 적어 보세요."
      />
      <small>{note.length.toLocaleString("ko-KR")} / {JOURNAL_NOTE_MAX_LENGTH.toLocaleString("ko-KR")}</small>
    </label>
    <div>
      <button type="button" onClick={save}>{entryId ? "메모 수정 저장" : "리딩과 메모 저장"}</button>
      {entryId && <a href={`/journal?entry=${encodeURIComponent(entryId)}`}>저장한 기록 보기 →</a>}
    </div>
    {savedAt && <p className="save-success" role="status">{formatSavedAt(savedAt)} 저장되었습니다. 이 브라우저의 Journal에서 다시 볼 수 있습니다.</p>}
    {error && <p className="error" role="alert">{error}</p>}
    <aside>브라우저 로컬 저장소에 통합 결과와 메모를 저장합니다. 손바닥 원본 이미지는 저장하지 않습니다.</aside>
  </div>;
}

function formatSavedAt(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
