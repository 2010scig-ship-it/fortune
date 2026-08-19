# Rule-Based Saju Interpretation Methodology (Phase 3)

## Scope and separation

Phase 3 converts already calculated `SajuCoreResult` data and an optional calculated `Sewoon` into structured, rule-based Korean text. It does not calculate pillars, solar terms, elements, ten gods, strength, daewoon, or yongshin. It does not call an LLM.

Static wording lives in `src/data/interpretations.ts`. Rule selection lives in `src/interpretation/saju`. Calculation remains in `src/engine/saju`.

## Output contract

Each selected point contains:

- a stable rule ID;
- one category: personality, career, wealth, relationship, health, or fortune;
- cautious interpretation text;
- a relative rule weight used only for ordering;
- explicit evidence naming the calculated input that selected the rule.

Weights are not probabilities, strength scores, or fortune scores. Rules are ordered by descending weight and then stable rule ID so identical input always produces identical output.

## Rules used

### Personality

- Day-master element selects one five-element tendency text.
- Day-master yin/yang selects one interaction-style text.
- Raw visible-element maxima and minima are described as chart composition only.

### Career

- Day-master element selects a work-style prompt.
- Visible year/month/hour stems are grouped into peer, output, wealth, authority, and resource ten-god families. Every family tied for the highest nonzero count selects a rule. The day stem is excluded because it is always 비견 and would bias the result.

### Wealth

- Visible year/month/hour stems classified as 편재 or 정재 are counted.
- Zero, one, and two-or-more cases select different attitude/checklist wording.
- This count does not predict income, investment return, or financial success.

### Relationship

- The raw visible yin/yang count selects yin-dominant, balanced, or yang-dominant communication guidance.
- Gender is not used to assign spouse roles or deterministic relationship outcomes.

### Health

- Raw visible-element maxima and minima select lifestyle and self-care prompts.
- Element counts are symbolic composition, not medical measurements. No disease, diagnosis, accident, or treatment claim is generated.

### Fortune

- Fortune rules require a supplied, deterministically calculated `Sewoon`.
- The sewoon stem's ten-god relation to the natal day master selects one annual-theme prompt.
- The stated period is the sewoon's Ipchun-to-next-Ipchun interval.
- If sewoon is absent, fortune points remain empty and a limitation is returned; the interpreter never reads the current clock itself.

## Explicit exclusions

Strength, daewoon, yongshin/heeshin, weighted elements, combinations, clashes, transformations, and medical claims are excluded because their Phase 2 methodologies are unresolved or unsupported. The interpretation engine must not infer those missing calculations from raw counts.

## Safety language

All wording describes tendencies, prompts, or areas to review. It must not promise success or failure, predict accidents or disease, or direct medical, legal, or investment decisions. The result is for entertainment and self-reflection.

