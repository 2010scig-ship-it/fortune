export type Element = "wood" | "fire" | "earth" | "metal" | "water";
export type YinYang = "yin" | "yang";
export type HeavenlyStemName = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
export type EarthlyBranchName = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";

export interface HeavenlyStem { readonly name: HeavenlyStemName; readonly element: Element; readonly yinYang: YinYang }
export interface EarthlyBranch { readonly name: EarthlyBranchName; readonly element: Element; readonly yinYang: YinYang }
export interface Ganzhi { readonly stem: HeavenlyStem; readonly branch: EarthlyBranch }
export interface FourPillars { readonly year: Ganzhi; readonly month: Ganzhi; readonly day: Ganzhi; readonly hour?: Ganzhi }
export interface Location { readonly country: string; readonly city: string; readonly timezone: string }
export interface BirthData {
  readonly date: string;
  readonly time?: string;
  readonly calendarType: "solar" | "lunar";
  readonly lunarLeapMonth?: boolean;
  readonly gender: "male" | "female";
  readonly location?: Location;
  readonly unknownBirthTime?: boolean;
}
export type ElementCounts = Readonly<Record<Element, number>>;
export interface ElementDistribution { readonly raw: ElementCounts; readonly weighted?: ElementCounts }
export type TenGod = "비견" | "겁재" | "식신" | "상관" | "편재" | "정재" | "편관" | "정관" | "편인" | "정인";
export interface TenGodResult { readonly stems: { readonly year: TenGod; readonly month: TenGod; readonly day: TenGod; readonly hour?: TenGod } }
export interface SajuCoreResult { readonly fourPillars: FourPillars; readonly dayMaster: HeavenlyStem; readonly fiveElements: ElementDistribution; readonly tenGods: TenGodResult }
export interface Sewoon extends Ganzhi { readonly sajuYear: number; readonly startInstantMs: number; readonly endInstantMs: number; readonly methodology: "ipchun-year-boundary" }
