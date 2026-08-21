import type { PalmResult } from "../engine/palm/types";
import type { IntegratedReading } from "../interpretation/integrated/types";
import type { JournalEntry, JournalEntryDraft, JournalRepository, JournalTarotCard } from "./types";

export const JOURNAL_STORAGE_KEY = "gyeol.journal.v1";
export const JOURNAL_NOTE_MAX_LENGTH = 3_000;

export interface JournalKeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface JournalRepositoryOptions {
  readonly clock: () => number;
  readonly idFactory: () => string;
}

export function createLocalStorageJournalRepository(
  storage: JournalKeyValueStore,
  options: JournalRepositoryOptions,
): JournalRepository {
  function readEntries(): readonly JournalEntry[] {
    const serialized = storage.getItem(JOURNAL_STORAGE_KEY);
    if (serialized === null) return [];
    try {
      const parsed: unknown = JSON.parse(serialized);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isJournalEntry).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    } catch {
      return [];
    }
  }

  function writeEntries(entries: readonly JournalEntry[]): void {
    storage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
  }

  return {
    list: readEntries,
    get(id) {
      return readEntries().find((entry) => entry.id === id);
    },
    create(draft) {
      const timestamp = new Date(options.clock()).toISOString();
      const entry: JournalEntry = {
        ...draft,
        note: normalizeNote(draft.note),
        schemaVersion: 1,
        id: options.idFactory(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      writeEntries([entry, ...readEntries().filter((current) => current.id !== entry.id)]);
      return entry;
    },
    updateNote(id, note) {
      const entries = readEntries();
      const current = entries.find((entry) => entry.id === id);
      if (current === undefined) throw new RangeError("저널 기록을 찾을 수 없습니다.");
      const updated: JournalEntry = {
        ...current,
        note: normalizeNote(note),
        updatedAt: new Date(options.clock()).toISOString(),
      };
      writeEntries(entries.map((entry) => entry.id === id ? updated : entry));
      return updated;
    },
  };
}

export function createBrowserJournalRepository(): JournalRepository {
  return createLocalStorageJournalRepository(window.localStorage, {
    clock: Date.now,
    idFactory: () => crypto.randomUUID(),
  });
}

function normalizeNote(note: string): string {
  const normalized = note.trim();
  if (normalized.length > JOURNAL_NOTE_MAX_LENGTH) throw new RangeError(`메모는 ${JOURNAL_NOTE_MAX_LENGTH.toLocaleString("ko-KR")}자 이내로 작성해 주세요.`);
  return normalized;
}

function isJournalEntry(value: unknown): value is JournalEntry {
  if (!isRecord(value)) return false;
  return value.schemaVersion === 1
    && typeof value.id === "string"
    && isIsoDate(value.createdAt)
    && isIsoDate(value.updatedAt)
    && isProfile(value.profile)
    && isQuestion(value.question)
    && typeof value.headline === "string"
    && Array.isArray(value.tarotCards)
    && value.tarotCards.every(isTarotCard)
    && isPalmSnapshot(value.palm)
    && isIntegratedReading(value.integratedReading)
    && typeof value.note === "string"
    && value.note.length <= JOURNAL_NOTE_MAX_LENGTH;
}

function isProfile(value: unknown): value is JournalEntry["profile"] {
  return isRecord(value) && typeof value.displayName === "string";
}

function isQuestion(value: unknown): value is JournalEntry["question"] {
  return isRecord(value) && typeof value.category === "string" && typeof value.text === "string";
}

function isTarotCard(value: unknown): value is JournalTarotCard {
  return isRecord(value)
    && typeof value.cardId === "string"
    && typeof value.cardName === "string"
    && (value.orientation === "upright" || value.orientation === "reversed")
    && typeof value.position === "string";
}

function isPalmSnapshot(value: unknown): value is JournalEntry["palm"] {
  if (!isRecord(value) || typeof value.analyzed !== "boolean") return false;
  return value.result === undefined || isPalmResult(value.result);
}

function isPalmResult(value: unknown): value is PalmResult {
  return isRecord(value)
    && (value.mode === "mock" || value.mode === "vision")
    && typeof value.summary === "string"
    && isStringArray(value.limitations);
}

function isIntegratedReading(value: unknown): value is IntegratedReading {
  if (!isRecord(value) || value.methodology !== "phase-5-integrated-reading-v1") return false;
  return typeof value.headline === "string"
    && typeof value.overview === "string"
    && isIntegratedSection(value.sajuSection)
    && isIntegratedSection(value.nameSection)
    && isIntegratedSection(value.tarotSection)
    && isIntegratedSection(value.palmSection)
    && isStringArray(value.convergence)
    && isStringArray(value.divergence)
    && typeof value.currentFocus === "string"
    && isStringArray(value.actionGuide)
    && typeof value.journalPrompt === "string"
    && typeof value.disclaimer === "string"
    && isRecord(value.sourceStatus)
    && isRecord(value.evidence);
}

function isIntegratedSection(value: unknown): boolean {
  return isRecord(value)
    && typeof value.summary === "string"
    && isStringArray(value.details)
    && isStringArray(value.limitations);
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
