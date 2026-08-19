# Advanced Saju Methodology (Phase 2)

## Scope and invariant

Phase 2 covers strength (신강/신약), daewoon (대운), sewoon (세운), and yongshin/heeshin (용신/희신). Every returned value must be produced by deterministic TypeScript. This module does not interpret results and never calls an LLM.

The project constitution forbids choosing a school-specific formula implicitly. Accordingly, this phase distinguishes a fully specified calculation from APIs that are intentionally unavailable until a methodology is selected.

## Sewoon: implemented

### Annual pillar

`getSewoon(sajuYear)` maps an integer saju-year label to the sexagenary cycle with the same epoch as the Phase 1 year pillar:

`cycleIndex = floorMod(sajuYear - 4, 60)`

Thus 4 CE is 甲子 and 2026 is 丙午.

### Interval boundary

A sewoon interval begins at the calculated instant of Ipchun (立春, apparent solar longitude 315°) in `sajuYear` and ends at Ipchun in `sajuYear + 1`. The start is inclusive and the end is exclusive. This deliberately reuses the Phase 1 saju-year boundary instead of treating Gregorian New Year or lunar New Year as the boundary.

Supported public labels are 1900–2100. The internal 1899 label is also available so an instant from 1900 before Ipchun can be classified without inventing a special case. Term precision and authority have the same limitations documented in `docs/saju-methodology.md`.

### Current sewoon

`getCurrentSewoon` accepts an injected `clock` returning Unix milliseconds and an IANA timezone. The injected clock keeps tests deterministic. The timezone is used only to obtain the applicable civil year; the Ipchun comparison itself uses UTC instants.

## Strength: DECISION REQUIRED and unsupported

No score or `strong | balanced | weak` classification is returned yet. A methodology must specify at least:

1. seasonal command (득령) tables and month-boundary convention;
2. root (통근/득지) definition and hidden-stem weights;
3. visible-stem support (득세/생조) weights;
4. control and drain weights;
5. combinations, transformations, clashes, and whether transformed qi replaces natal elements;
6. score normalization and the exact strong/balanced/weak thresholds;
7. handling when birth time is unknown.

Raw element counts from Phase 1 are not a valid substitute for this methodology. `analyzeStrength` therefore throws `MethodologyDecisionRequiredError`.

## Daewoon: DECISION REQUIRED and unsupported

No daewoon list or start age is returned yet. A methodology must specify at least:

1. forward/reverse direction rule, including whether it uses year-stem yin/yang, day-stem yin/yang, gender, or another convention;
2. whether the distance is measured to a 節 boundary or to any of the 24 solar terms;
3. the start-age conversion rule and rounding/precision (for example, how days and hours become years and months);
4. nominal Korean age versus elapsed age and how start/end ages are represented;
5. true-solar-time and the unresolved 23:00 day-boundary policy;
6. behavior when birth time is unknown or the birth is exactly on a term boundary.

Although advancing or reversing a sexagenary sequence is mechanically simple, exposing that partial sequence as a complete daewoon result would be misleading without a start-age methodology. `calculateDaewoon` therefore throws `MethodologyDecisionRequiredError`.

## Yongshin/heeshin: DECISION REQUIRED and unsupported

No yongshin, heeshin, or unfavorable element is returned yet. A methodology must choose among and precisely define approaches such as 억부, 조후, 통관, 병약, or a documented priority/combination of them. It must also specify:

1. dependency on an approved strength result;
2. seasonal temperature/moisture tables if 조후 is used;
3. combination/transformation handling;
4. tie-breaking and cases where no single element is selected;
5. whether daewoon/sewoon may alter the natal selection.

`analyzeYongshin` therefore throws `MethodologyDecisionRequiredError`.

## Verification status

- Sewoon formula tests cover the 60-year cycle, Ipchun immediately before/at/after, supported ranges, and injected-clock behavior.
- Unsupported modules have focused tests proving that they fail explicitly rather than emitting invented values.
- No external expected daewoon, strength, or yongshin fixture has been fabricated.

