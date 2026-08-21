import { describe, expect, it } from "vitest";
import { addTarotReading, createSajuReading } from "../../src/application/reading";
import { mockNameAnalyzer } from "../../src/engine/name";
import { createIntegratedReading } from "../../src/interpretation/integrated";
import {
  createLocalStorageJournalRepository,
  JOURNAL_STORAGE_KEY,
  type JournalKeyValueStore,
} from "../../src/journal/localStorageRepository";
import type { JournalEntryDraft } from "../../src/journal/types";

class MemoryStore implements JournalKeyValueStore {
  readonly values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

function createDraft(question: string): JournalEntryDraft {
  const saju = createSajuReading({
    date: "1995-05-15",
    time: "12:00",
    calendarType: "solar",
    gender: "female",
    location: { country: "KR", city: "Seoul", timezone: "Asia/Seoul" },
  }, () => Date.parse("2026-08-21T06:00:00.000Z"));
  const reading = addTarotReading(saju, "one-card", "general", () => 0.25);
  const name = mockNameAnalyzer.analyze({ name: "김결" });
  const integratedReading = createIntegratedReading({
    profile: { name: "김결" },
    question: { category: "자기이해", text: question },
    saju: reading,
    name,
    tarot: reading.tarot,
  });
  return {
    profile: { displayName: "김결" },
    question: { category: "자기이해", text: question },
    headline: integratedReading.headline,
    tarotCards: reading.tarot.cards.map((card) => ({
      cardId: card.cardId,
      cardName: card.cardName,
      orientation: card.orientation,
      position: card.position.label,
    })),
    palm: { analyzed: false },
    integratedReading,
    note: " 첫 메모 ",
  };
}

describe("local Journal repository", () => {
  it("persists structured readings, sorts newest first, and never stores image URLs", () => {
    const store = new MemoryStore();
    let now = Date.parse("2026-08-20T01:00:00.000Z");
    let id = 0;
    const repository = createLocalStorageJournalRepository(store, { clock: () => now, idFactory: () => `entry-${++id}` });

    const first = repository.create(createDraft("첫 질문"));
    now += 86_400_000;
    const second = repository.create(createDraft("둘째 질문"));

    expect(repository.list().map((entry) => entry.id)).toEqual([second.id, first.id]);
    expect(first.note).toBe("첫 메모");
    expect(repository.get(second.id)?.question.text).toBe("둘째 질문");
    expect(store.values.get(JOURNAL_STORAGE_KEY)).not.toContain("blob:");
    expect(store.values.get(JOURNAL_STORAGE_KEY)).not.toContain("data:image");
  });

  it("updates a note without replacing the structured reading", () => {
    const store = new MemoryStore();
    let now = Date.parse("2026-08-20T01:00:00.000Z");
    const repository = createLocalStorageJournalRepository(store, { clock: () => now, idFactory: () => "entry-1" });
    const created = repository.create(createDraft("질문"));
    now += 60_000;

    const updated = repository.updateNote(created.id, " 수정한 메모 ");

    expect(updated.note).toBe("수정한 메모");
    expect(updated.updatedAt).not.toBe(created.updatedAt);
    expect(updated.integratedReading).toEqual(created.integratedReading);
  });

  it("ignores malformed storage and rejects unknown entries", () => {
    const store = new MemoryStore();
    const repository = createLocalStorageJournalRepository(store, { clock: () => 0, idFactory: () => "entry" });
    store.setItem(JOURNAL_STORAGE_KEY, "not json");
    expect(repository.list()).toEqual([]);
    store.setItem(JOURNAL_STORAGE_KEY, JSON.stringify([{ id: "incomplete" }]));
    expect(repository.list()).toEqual([]);
    expect(() => repository.updateNote("missing", "note")).toThrow("저널 기록을 찾을 수 없습니다.");
  });
});
