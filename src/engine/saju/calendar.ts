export interface CivilDate { readonly year: number; readonly month: number; readonly day: number }
export interface CivilDateTime extends CivilDate { readonly hour: number; readonly minute: number; readonly second: number }

export function parseDate(value: string): CivilDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError("date must use YYYY-MM-DD");
  const result = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  const check = new Date(Date.UTC(result.year, result.month - 1, result.day));
  if (check.getUTCFullYear() !== result.year || check.getUTCMonth() + 1 !== result.month || check.getUTCDate() !== result.day) throw new RangeError("invalid Gregorian date");
  return result;
}

export function parseTime(value: string): { readonly hour: number; readonly minute: number; readonly second: number } {
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) throw new RangeError("time must use HH:mm or HH:mm:ss");
  const result = { hour: Number(match[1]), minute: Number(match[2]), second: Number(match[3] ?? 0) };
  if (result.hour > 23 || result.minute > 59 || result.second > 59) throw new RangeError("invalid civil time");
  return result;
}

function partsAt(instantMs: number, timezone: string): CivilDateTime {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(instantMs);
  } catch { throw new RangeError(`invalid IANA timezone: ${timezone}`); }
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return { year: Number(values.year), month: Number(values.month), day: Number(values.day), hour: Number(values.hour), minute: Number(values.minute), second: Number(values.second) };
}

export function zonedDateTimeToInstant(local: CivilDateTime, timezone: string): number {
  const naive = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second);
  const offsets = new Set<number>();
  for (let deltaHours = -48; deltaHours <= 48; deltaHours += 6) {
    const probe = naive + deltaHours * 3_600_000;
    const parts = partsAt(probe, timezone);
    const representedAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    offsets.add(representedAsUtc - probe);
  }
  const matches: number[] = [];
  for (const offset of offsets) {
    const candidate = naive - offset;
    const actual = partsAt(candidate, timezone);
    if (Object.keys(local).every((key) => actual[key as keyof CivilDateTime] === local[key as keyof CivilDateTime])) matches.push(candidate);
  }
  if (matches.length === 0) throw new RangeError("nonexistent civil time");
  if (matches.length > 1) throw new RangeError("ambiguous civil time");
  return matches[0]!;
}

export function civilPartsAt(instantMs: number, timezone: string): CivilDateTime { return partsAt(instantMs, timezone); }
