export const SOLAR_TERM_NAMES = ["소한","대한","입춘","우수","경칩","춘분","청명","곡우","입하","소만","망종","하지","소서","대서","입추","처서","백로","추분","한로","상강","입동","소설","대설","동지"] as const;
export type SolarTermName = typeof SOLAR_TERM_NAMES[number];
export const MONTH_BOUNDARY_TERMS = ["입춘","경칩","청명","입하","망종","소서","입추","백로","한로","입동","대설","소한"] as const satisfies readonly SolarTermName[];
const TERM_MINUTES = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758] as const;
const EPOCH = Date.UTC(1900, 0, 6, 2, 5);
const TROPICAL_YEAR_MS = 31_556_925_974.7;
const TARGET_LONGITUDES = [285,300,315,330,345,0,15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270] as const;
export interface SolarTerm { readonly name: SolarTermName; readonly year: number; readonly instantMs: number }
export function calculateSolarTerm(year: number, name: SolarTermName): SolarTerm {
  if (!Number.isInteger(year) || year < 1899 || year > 2101) throw new RangeError("solar term year outside supported range");
  const index = SOLAR_TERM_NAMES.indexOf(name);
  if (index < 0) throw new RangeError("unknown solar term");
  const estimate = EPOCH + (year - 1900) * TROPICAL_YEAR_MS + TERM_MINUTES[index]! * 60_000;
  const target = TARGET_LONGITUDES[index]!;
  let low = estimate - 2 * 86_400_000; let high = estimate + 2 * 86_400_000;
  for (let iteration = 0; iteration < 60; iteration += 1) {
    const middle = (low + high) / 2;
    if (signedAngle(apparentSolarLongitude(middle) - target) < 0) low = middle; else high = middle;
  }
  return { name, year, instantMs: (low + high) / 2 };
}

function signedAngle(degrees: number): number { return ((degrees + 540) % 360) - 180; }
function apparentSolarLongitude(instantMs: number): number {
  const julianDay = instantMs / 86_400_000 + 2_440_587.5;
  const centuries = (julianDay - 2_451_545) / 36_525;
  const meanLongitude = 280.46646 + centuries * (36_000.76983 + 0.0003032 * centuries);
  const meanAnomaly = toRadians(357.52911 + centuries * (35_999.05029 - 0.0001537 * centuries));
  const center = Math.sin(meanAnomaly) * (1.914602 - centuries * (0.004817 + 0.000014 * centuries))
    + Math.sin(2 * meanAnomaly) * (0.019993 - 0.000101 * centuries)
    + Math.sin(3 * meanAnomaly) * 0.000289;
  const omega = toRadians(125.04 - 1934.136 * centuries);
  return ((meanLongitude + center - 0.00569 - 0.00478 * Math.sin(omega)) % 360 + 360) % 360;
}
function toRadians(degrees: number): number { return degrees * Math.PI / 180; }
