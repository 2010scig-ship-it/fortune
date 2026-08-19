import { describe, expect, it } from "vitest";
import { ganzhiName } from "../../src/engine/saju/ganzhi";
import { getCurrentSewoon, getSewoon, getSewoonAt } from "../../src/engine/saju/sewoon";
import { calculateSolarTerm } from "../../src/engine/saju/solarTerms";

describe("sewoon", () => {
  it("maps annual labels onto the sexagenary cycle", () => {
    expect(ganzhiName(getSewoon(1900))).toBe("庚子");
    expect(ganzhiName(getSewoon(1960))).toBe("庚子");
    expect(ganzhiName(getSewoon(2026))).toBe("丙午");
  });

  it("returns an Ipchun-inclusive, next-Ipchun-exclusive interval", () => {
    const result = getSewoon(2026);
    expect(result.startInstantMs).toBe(calculateSolarTerm(2026, "입춘").instantMs);
    expect(result.endInstantMs).toBe(calculateSolarTerm(2027, "입춘").instantMs);
    expect(result.methodology).toBe("ipchun-year-boundary");
  });

  it("changes exactly at Ipchun", () => {
    const ipchun = calculateSolarTerm(2026, "입춘").instantMs;
    expect(getSewoonAt(ipchun - 1).sajuYear).toBe(2025);
    expect(getSewoonAt(ipchun).sajuYear).toBe(2026);
    expect(getSewoonAt(ipchun + 1).sajuYear).toBe(2026);
  });

  it("uses an injected clock for the current sewoon", () => {
    const instant = Date.parse("2026-01-15T12:00:00+09:00");
    const result = getCurrentSewoon({ clock: () => instant, timezone: "Asia/Seoul" });
    expect(result.sajuYear).toBe(2025);
    expect(ganzhiName(result)).toBe("乙巳");
  });

  it("supports the documented civil range, including pre-Ipchun 1900", () => {
    expect(getSewoonAt(Date.parse("1900-01-01T00:00:00+08:27")).sajuYear).toBe(1899);
    expect(() => getSewoon(2100)).not.toThrow();
  });

  it("rejects invalid ranges, instants, and timezones", () => {
    expect(() => getSewoon(1898)).toThrow(RangeError);
    expect(() => getSewoon(2026.5)).toThrow(RangeError);
    expect(() => getSewoonAt(Number.NaN)).toThrow(RangeError);
    expect(() => getSewoonAt(Date.now(), "Not/A_Timezone")).toThrow(RangeError);
  });
});
