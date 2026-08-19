# Combined Saju and Tarot Methodology (Phase 5)

## Scope and separation

Phase 5 combines a completed Phase 3 `SajuInterpretation` with a completed Phase 4 `TarotSpreadInterpretation`. It does not recalculate Saju, redraw Tarot cards, change orientations, generate UI, or call an LLM.

The engine never compares Korean interpretation sentences. Both systems are first mapped into the closed `Theme` vocabulary defined in `src/interpretation/themes.ts`. Comparison operates only on those typed themes.

## Saju Theme extraction

Stable Phase 3 rule IDs and their structured evidence map to themes. Examples:

- day-master wood → EXPANSION;
- day-master water → LEARNING and CHANGE;
- visible wealth-star rules → MONEY;
- relationship rules → RELATIONSHIP;
- health self-care prompts → REST;
- sewoon 편재/정재 → MONEY plus OPPORTUNITY/STABILITY;
- sewoon 상관 → CHANGE and CONFLICT.

The raw-element-composition observation is deliberately not mapped. It exists to describe visible counts and must not become a strength, yongshin, or predictive signal.

Every mapped theme retains evidence with the originating rule ID and category.

## Tarot Theme extraction

Phase 4 card themes are reused without reinterpretation. Evidence retains card ID, orientation, and spread-position ID. Duplicate themes are collapsed in the public theme list while all source evidence remains available.

## Agreement

An Agreement is a typed Theme present in both systems. Agreement is set intersection, ordered by the canonical `THEMES` array. It does not increase confidence or prove an outcome; it only records that both rule systems surfaced the same theme.

## Complement and Tension relation table

Different themes are related only when an explicit, versioned relation exists in `src/data/themeRelations.ts`.

Complement pairs currently supported:

- OPPORTUNITY ↔ CAUTION
- EXPANSION ↔ STABILITY
- INDEPENDENCE ↔ RELATIONSHIP
- CHANGE ↔ LEARNING
- CAREER ↔ LEARNING
- MONEY ↔ CAUTION
- LEADERSHIP ↔ RELATIONSHIP

Tension pairs currently supported:

- CHANGE ↔ STABILITY
- EXPANSION ↔ REST
- CONFLICT ↔ STABILITY
- CAREER ↔ REST
- LEADERSHIP ↔ REST
- INDEPENDENCE ↔ STABILITY

Relations are symmetric: either system may provide either side. The output always records which Theme came from Saju and which came from Tarot. If both sides of a relation are already Agreements, the extra Complement/Tension entry is suppressed to avoid redundant noise.

These relations are product interpretation rules, not mathematical or traditional Saju formulae. Adding or changing a relation requires focused tests.

## Determinism and evidence

Given identical structured Saju and Tarot interpretations, the combined result is identical. Output contains:

- `sajuThemes`
- `tarotThemes`
- `agreements`
- `complementarySignals`
- `tensions`
- per-system Theme evidence
- safety limitations

No score, probability, confidence, or future certainty is generated.

## Safety

Combined signals are prompts for reflection. Agreement does not mean “more likely to happen,” and Tension does not predict failure, conflict, accident, or illness. Medical, legal, and investment decisions must not rely on this result alone.

