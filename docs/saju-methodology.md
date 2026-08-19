# Saju Core Methodology (Phase 1)

## Scope and invariants

This phase calculates only deterministic values for **proleptic Gregorian solar dates from 1900 through 2100**. Interpretation, strength, yongshin, daewoon, sewoon, lunar conversion, and UI are out of scope. The engine never calls an LLM.

The astronomical term implementation uses the standard low-precision apparent-solar-longitude equations described by Jean Meeus: mean longitude, mean anomaly, equation of center, nutation/aberration correction, then numerical solution of each 15-degree crossing. The implementation is intended for pillar-boundary selection, not publication of an astronomical almanac. Its boundary moments must be checked against the Korea Astronomy and Space Science Institute (KASI) almanac before production use.

## Confirmed rules implemented

### Year-pillar boundary

The saju year changes at the **instant of Ipchun (立春, apparent solar longitude 315°)**, not at Gregorian New Year and not at lunar New Year. Before that instant, the preceding sexagenary year is used. The conventional mapping `4 CE = 甲子` determines the cycle index.

### Month-pillar solar-term boundary

The month pillar uses the twelve **節入 (jie)** instants, not lunar months:

| Month branch | Boundary | Solar longitude |
| --- | --- | ---: |
| 寅 | 立春 | 315° |
| 卯 | 驚蟄 | 345° |
| 辰 | 清明 | 15° |
| 巳 | 立夏 | 45° |
| 午 | 芒種 | 75° |
| 未 | 小暑 | 105° |
| 申 | 立秋 | 135° |
| 酉 | 白露 | 165° |
| 戌 | 寒露 | 195° |
| 亥 | 立冬 | 225° |
| 子 | 大雪 | 255° |
| 丑 | 小寒 | 285° |

Month stems follow the 五虎遁 rule: 甲/己 year starts 丙寅; 乙/庚 starts 戊寅; 丙/辛 starts 庚寅; 丁/壬 starts 壬寅; 戊/癸 starts 甲寅.

### Day-pillar epoch

The day index uses the Gregorian Julian Day Number at local civil midnight:

`cycleIndex = floorMod(JDN + 49, 60)`

This makes Gregorian `2000-01-07` a 甲子 day and agrees with the KASI published daily ganzhi check used in tests (`2026-02-17` = 壬戌). Dates are validated rather than normalized by the JavaScript `Date` constructor.

### Hour pillar

For a known civil birth time, branches use conventional two-hour blocks: 子 begins at 23:00, 丑 at 01:00, ..., 亥 at 21:00. Hour stems use the 五鼠遁 rule based on the calculated day stem. If birth time is absent or marked unknown, no hour pillar is returned.

### Timezone and Korean standard time

Input `date` and `time` are interpreted as wall-clock values in the supplied IANA timezone. If location is omitted, `Asia/Seoul` is the explicit default. `Intl.DateTimeFormat` resolves the applicable historical UTC offset; no fixed `UTC+09:00` is assumed in code. Invalid or DST-nonexistent local times are rejected. Solar-term instants are compared in UTC.

Overlapping local times are also rejected because `BirthData` has no explicit UTC-offset or disambiguation field. Detection does not assume a one-hour DST shift; offsets around the requested wall time are enumerated so half-hour transitions are covered.

If time is unknown, the engine compares the entire local civil day. It calculates year/month pillars only if both endpoints fall in the same term interval; otherwise it throws `AmbiguousSolarTermBoundaryError` rather than inventing a birth time.

### True solar time

True/apparent local solar time is **not applied**. Longitude is not used to shift the hour pillar.

`lunarLeapMonth` is rejected for solar input rather than silently ignored.

### Hidden stems and element counts

The twelve branch hidden-stem lists are static data and contain no weights. Raw element distribution counts each visible stem and each branch's primary element once. A weighted distribution is deliberately absent because hidden-stem and seasonal weights depend on a chosen methodology.

### Ten gods

Ten gods are derived solely from the day master's element-generation/control relationship to a target stem plus matching/opposing yin-yang polarity. All 100 day-master/target-stem pairs are exhaustively tested.

## Precision and verification

- Supported birth-date range: Gregorian years 1900–2100. Solar terms are calculated for 1899–2101 internally so both endpoints can be classified.
- The low-precision solar longitude formula is expected to locate terms within minutes, but every production boundary fixture should come from an authoritative almanac.
- The calculation feeds UTC-based Julian dates directly to a formula conventionally expressed in dynamical time. The omitted UTC–TT correction is part of the stated low-precision limit and is one reason production boundaries require authoritative verification.
- Phase 1 includes a KASI 2026 24-term comparison with a 20-minute tolerance. This is a regression/precision check, not a claim that the implementation replaces the official almanac.

## DECISION REQUIRED

1. **23:00 day rollover:** Some schools change the day pillar at early 子 hour (23:00); others at civil midnight. Phase 1 implements only civil-midnight day rollover. A 23:00 rollover policy must not be added until the project chooses a school/method.
2. **True solar time:** Decide whether and how longitude, equation of time, and historical standard meridians should alter hour calculation. It is currently disabled.
3. **Lunar input:** Choose and license an authoritative solar/lunar conversion source, including Korean leap-month and historical-calendar coverage. `calendarType: "lunar"` is rejected in Phase 1.
4. **Historical Korean offsets:** `Intl` timezone data is used. Decide whether the product must override it with a project-owned, versioned historical Korean civil-time table.
5. **Solar-term authority:** Decide whether production should use KASI's year tables, a licensed ephemeris, or a higher-precision astronomical implementation. Current code is bounded and independently checked but intentionally low precision.
6. **Hidden-stem weights / weighted five elements:** Select and document a school-specific weighting model before implementation.
7. **Reference corpus:** At least 20 externally verified four-pillar cases are still required. No expected pillars are fabricated in this repository.

The 20 candidate inputs live in `tests/fixtures/saju-reference.json`; their reference test remains explicitly skipped until those external values and conventions are recorded.

## References and development dependencies

- Korea Astronomy and Space Science Institute, 월력요항 / 24절기: <https://astro.kasi.re.kr/life/post/calendardata>
- Jean Meeus, *Astronomical Algorithms*, 2nd edition, chapters 7 and 25 (Julian dates and low-precision solar coordinates).
- Vitest 3.2.7 is used only for development tests (MIT license).
- TypeScript 5.9.3 is used only for compilation/type checking (Apache-2.0 license).
- The calculation engine has no runtime third-party dependency.
