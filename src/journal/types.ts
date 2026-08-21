import type { PalmResult } from "../engine/palm/types";
import type { TarotOrientation } from "../engine/tarot/types";
import type { IntegratedReading } from "../interpretation/integrated/types";

export interface JournalTarotCard {
  readonly cardId: string;
  readonly cardName: string;
  readonly orientation: TarotOrientation;
  readonly position: string;
}

export interface JournalEntryDraft {
  readonly profile: {
    readonly displayName: string;
  };
  readonly question: {
    readonly category: string;
    readonly text: string;
  };
  readonly headline: string;
  readonly tarotCards: readonly JournalTarotCard[];
  readonly palm: {
    readonly analyzed: boolean;
    readonly result?: PalmResult;
  };
  readonly integratedReading: IntegratedReading;
  readonly note: string;
}

export interface JournalEntry extends JournalEntryDraft {
  readonly schemaVersion: 1;
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface JournalRepository {
  list(): readonly JournalEntry[];
  get(id: string): JournalEntry | undefined;
  create(draft: JournalEntryDraft): JournalEntry;
  updateNote(id: string, note: string): JournalEntry;
}
