# Tarot Engine and Interpretation Methodology (Phase 4)

## Scope and separation

Phase 4 implements a deterministic/testable Rider–Waite–Smith-style 78-card deck model, shuffle, orientation, draw, data-driven spreads, rule-based interpretation, and Theme mapping. It does not implement UI, persistence, combined Saju/Tarot comparison, or an LLM.

Card selection and orientation are engine operations under `src/engine/tarot`. Natural-language interpretation is under `src/interpretation/tarot`. Static card and Theme data is under `src/data`.

## Deck structure

- Major Arcana: 22 cards, numbered 0 through 21.
- Minor Arcana: 56 cards in Wands, Cups, Swords, and Pentacles.
- Each Minor suit has Ace through Ten plus Page, Knight, Queen, and King.
- Card IDs are stable lowercase identifiers such as `major-00-fool` and `minor-cups-ace`.

The keyword text is original project wording. It is a compact rule vocabulary, not a claim that one canonical tarot interpretation exists. Minor-card meanings combine a documented rank profile with a suit profile so all 56 cards remain structurally consistent. Major cards have individual keyword data.

## Randomness contract

Every operation requiring randomness receives an explicit `rng: () => number`. There is no hidden `Math.random` default.

- RNG values must be finite and satisfy `0 <= value < 1`; invalid values throw.
- `shuffleDeck` uses an immutable Fisher–Yates shuffle and does not mutate the source deck.
- `chooseOrientation` uses a configurable reversed probability in `[0, 1]`, defaulting to `0.5` only after an RNG is explicitly supplied.
- `drawForSpread` uses the same injected RNG first for shuffle and then for each orientation, making a test sequence fully reproducible.

The default contract is suitable for entertainment, reproducible tests, and user-driven selection flows. It does not claim cryptographic fairness. A UI may inject `crypto.getRandomValues` through an adapter later.

## Spreads

Spread definitions are static data:

- One Card: Core Message.
- Three Cards — Timeline: Past, Present, Future.
- Three Cards — Guidance: Situation, Advice, Outcome.
- Five Cards: Current Situation, Obstacle, Hidden Influence, Advice, Likely Direction.

The number of supplied cards must exactly match the selected spread.

## Orientation

Each drawn card is either `upright` or `reversed`. Reversed cards use their own keyword array and Theme mapping. Reversal does not automatically mean a harmful outcome; it is described as delay, internalization, imbalance, or a point requiring review according to the card data.

## Rule-based interpretation

`interpretCard` combines:

1. card;
2. orientation;
3. spread position;
4. optional question category (`general`, `love`, `career`, `wealth`, or `relationship`).

`interpretSpread` preserves position order and returns card interpretations plus a deduplicated Theme list. It does not redraw cards or change orientations.

## Theme mapping

The shared Theme vocabulary is defined in `src/interpretation/themes.ts` and includes CHANGE, EXPANSION, CAUTION, RELATIONSHIP, MONEY, CAREER, REST, CONFLICT, OPPORTUNITY, LEARNING, LEADERSHIP, INDEPENDENCE, and STABILITY.

Major cards map directly to individual themes. Minor cards combine suit themes and rank themes. Reversed mappings add CAUTION and may add CONFLICT or REST according to the rank profile. This Theme output is intended for the Phase 5 combined engine; Phase 4 does not compare it with Saju.

## Safety

Interpretations describe symbolic prompts and likely areas of attention. They do not guarantee success or failure, predict accidents or disease, or instruct users to make medical, legal, or investment decisions from tarot alone.

