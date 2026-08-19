import { describe, expect, it } from "vitest";
import { parseDate, zonedDateTimeToInstant } from "../../src/engine/saju/calendar";
import { ganzhiName } from "../../src/engine/saju/ganzhi";
import { calculateFourPillars, UnsupportedCalendarError } from "../../src/engine/saju/pillars";

const seoul = { country: "KR", city: "Seoul", timezone: "Asia/Seoul" } as const;

describe("calendar boundaries and unsupported conventions", () => {
  it("rejects normalized invalid dates", () => {
    expect(() => parseDate("2025-02-29")).toThrow(RangeError);
    expect(parseDate("2024-02-29")).toEqual({ year: 2024, month: 2, day: 29 });
  });

  it("changes the civil-midnight day pillar at New Year midnight", () => {
    const before = calculateFourPillars({ date: "2025-12-31", time: "23:59", calendarType: "solar", gender: "female", location: seoul });
    const after = calculateFourPillars({ date: "2026-01-01", time: "00:00", calendarType: "solar", gender: "female", location: seoul });
    expect(ganzhiName(before.day)).not.toBe(ganzhiName(after.day));
    expect(before.year.stem.name).toBe(after.year.stem.name);
    expect(before.year.branch.name).toBe(after.year.branch.name);
  });

  it("resolves IANA timezones to the same instant", () => {
    const utc = zonedDateTimeToInstant({ year: 2026, month: 1, day: 1, hour: 0, minute: 0, second: 0 }, "UTC");
    const seoulSameInstant = zonedDateTimeToInstant({ year: 2026, month: 1, day: 1, hour: 9, minute: 0, second: 0 }, "Asia/Seoul");
    expect(seoulSameInstant).toBe(utc);
  });

  it("rejects a DST spring-forward gap rather than normalizing it", () => {
    expect(() => zonedDateTimeToInstant({ year: 2026, month: 3, day: 8, hour: 2, minute: 30, second: 0 }, "America/New_York"))
      .toThrow(RangeError);
  });

  it("rejects a half-hour DST overlap without assuming a one-hour transition", () => {
    expect(() => zonedDateTimeToInstant({ year: 2026, month: 4, day: 5, hour: 1, minute: 45, second: 0 }, "Australia/Lord_Howe"))
      .toThrow(/ambiguous/);
  });

  it("supports both documented Gregorian range endpoints", () => {
    expect(() => calculateFourPillars({ date: "1900-01-01", time: "00:00", calendarType: "solar", gender: "male", location: seoul }))
      .not.toThrow();
    expect(() => calculateFourPillars({ date: "2100-12-31", time: "23:59", calendarType: "solar", gender: "female", location: seoul }))
      .not.toThrow();
  });

  it("rejects lunar and leap-month input until a method is selected", () => {
    expect(() => calculateFourPillars({
      date: "2026-01-01", calendarType: "lunar", lunarLeapMonth: true,
      gender: "female", location: seoul,
    })).toThrow(UnsupportedCalendarError);
    expect(() => calculateFourPillars({
      date: "2026-01-01", calendarType: "solar", lunarLeapMonth: false,
      gender: "female", location: seoul,
    })).toThrow(UnsupportedCalendarError);
  });
});
