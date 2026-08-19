# Project Constitution

These rules apply to every change in this repository.

1. Never ask an LLM to calculate saju values. Calendar, solar-term, ganzhi, pillar, five-element, ten-god, daewoon, and sewoon values must come from deterministic TypeScript.
2. Keep calculation, rule-based interpretation, AI narrative, and UI in separate modules.
3. Do not place saju formulae in React components.
4. Do not simplify or invent a formula when sources, conventions, or school-specific rules disagree. Record it as `DECISION REQUIRED` and leave that behavior unsupported.
5. Every calculation-rule change requires focused unit tests. Existing reference cases must not be rewritten merely to make a failing implementation pass.
6. Never fabricate expected values for reference fixtures. Unverified cases remain skipped/TODO and are documented as needing an external reference.
7. Prefer pure functions. Inject clocks and random-number generators wherever nondeterminism exists.
8. TypeScript strict mode is mandatory. Avoid `any`.
9. Document supported date ranges, timezone behavior, precision limits, and methodology next to the engine.
10. Engine correctness and traceability take priority over UI delivery.
11. Stop after each requested phase and wait for explicit user approval before starting the next phase.

