import { parseDate, parseTime, zonedDateTimeToInstant } from "./calendar";
import { floorMod, ganzhiAt } from "./ganzhi";
import { calculateSolarTerm, MONTH_BOUNDARY_TERMS } from "./solarTerms";
import type { BirthData, FourPillars, Ganzhi } from "./types";

export class UnsupportedCalendarError extends Error { constructor() { super("Only proleptic Gregorian solar input is supported"); this.name = "UnsupportedCalendarError"; } }
export class AmbiguousSolarTermBoundaryError extends Error { constructor() { super("Unknown birth time crosses a solar-term boundary"); this.name = "AmbiguousSolarTermBoundaryError"; } }

function jdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12); const y = year + 4800 - a; const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}
export function calculateDayPillar(year: number, month: number, day: number): Ganzhi { return ganzhiAt(jdn(year, month, day) + 49); }

function sajuYearAt(instantMs: number, civilYear: number): number { return instantMs < calculateSolarTerm(civilYear, "입춘").instantMs ? civilYear - 1 : civilYear; }
function yearPillarFor(sajuYear: number): Ganzhi { return ganzhiAt(sajuYear - 4); }

export function calculateMonthPillar(instantMs: number): Ganzhi {
  if (!Number.isFinite(instantMs)) throw new RangeError("invalid instant");
  const utcYear = new Date(instantMs).getUTCFullYear();
  const boundaries = [] as { instant: number; monthIndex: number; sajuYear: number }[];
  for (let year = Math.max(1899, utcYear - 1); year <= Math.min(2101, utcYear + 1); year += 1) {
    MONTH_BOUNDARY_TERMS.forEach((term, index) => {
      const termYear = term === "소한" ? year + 1 : year;
      if (termYear <= 2101) boundaries.push({ instant: calculateSolarTerm(termYear, term).instantMs, monthIndex: index, sajuYear: year });
    });
  }
  boundaries.sort((a, b) => a.instant - b.instant);
  const boundary = boundaries.filter((item) => item.instant <= instantMs).at(-1);
  if (!boundary) throw new RangeError("instant outside supported range");
  const yearStemIndex = floorMod(boundary.sajuYear - 4, 10);
  const tigerStem = floorMod((yearStemIndex % 5) * 2 + 2, 10);
  const stemIndex = floorMod(tigerStem + boundary.monthIndex, 10);
  const branchIndex = floorMod(2 + boundary.monthIndex, 12);
  return ganzhiAt(Array.from({ length: 60 }, (_, index) => index).find((index) => index % 10 === stemIndex && index % 12 === branchIndex)!);
}

export function calculateHourPillar(day: Ganzhi, hour: number): Ganzhi {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new RangeError("invalid hour");
  const branchIndex = Math.floor(((hour + 1) % 24) / 2);
  const dayStemIndex = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"].indexOf(day.stem.name);
  const ratStem = (dayStemIndex % 5) * 2;
  const stemIndex = floorMod(ratStem + branchIndex, 10);
  return ganzhiAt(Array.from({ length: 60 }, (_, index) => index).find((index) => index % 10 === stemIndex && index % 12 === branchIndex)!);
}

export function calculateFourPillars(birth: BirthData): FourPillars {
  if (birth.calendarType !== "solar" || birth.lunarLeapMonth !== undefined) throw new UnsupportedCalendarError();
  const date = parseDate(birth.date);
  if (date.year < 1900 || date.year > 2100) throw new RangeError("birth date outside supported range");
  const timezone = birth.location?.timezone ?? "Asia/Seoul";
  const unknown = birth.unknownBirthTime === true || birth.time === undefined;
  const start = zonedDateTimeToInstant({ ...date, hour: 0, minute: 0, second: 0 }, timezone);
  const end = zonedDateTimeToInstant({ ...date, hour: 23, minute: 59, second: 59 }, timezone);
  if (unknown) {
    const startYear = sajuYearAt(start, date.year); const endYear = sajuYearAt(end, date.year);
    if (startYear !== endYear || calculateMonthPillar(start).branch.name !== calculateMonthPillar(end).branch.name) throw new AmbiguousSolarTermBoundaryError();
    return { year: yearPillarFor(startYear), month: calculateMonthPillar(start), day: calculateDayPillar(date.year, date.month, date.day) };
  }
  const time = parseTime(birth.time!);
  const instant = zonedDateTimeToInstant({ ...date, ...time }, timezone);
  const day = calculateDayPillar(date.year, date.month, date.day);
  return { year: yearPillarFor(sajuYearAt(instant, date.year)), month: calculateMonthPillar(instant), day, hour: calculateHourPillar(day, time.hour) };
}
