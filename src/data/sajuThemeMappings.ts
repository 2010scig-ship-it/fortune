import type { Element, YinYang } from "../engine/saju/types";
import type { Theme } from "../interpretation/themes";

export const DAY_MASTER_ELEMENT_THEMES: Readonly<Record<Element, readonly Theme[]>> = {
  wood: ["EXPANSION"],
  fire: ["EXPANSION", "RELATIONSHIP"],
  earth: ["STABILITY"],
  metal: ["STABILITY", "INDEPENDENCE"],
  water: ["LEARNING", "CHANGE"],
};

export const DAY_MASTER_YIN_YANG_THEMES: Readonly<Record<YinYang, readonly Theme[]>> = {
  yin: ["REST", "LEARNING"],
  yang: ["LEADERSHIP", "INDEPENDENCE"],
};

export const CAREER_ELEMENT_THEMES: Readonly<Record<Element, readonly Theme[]>> = {
  wood: ["CAREER", "EXPANSION", "LEARNING"],
  fire: ["CAREER", "RELATIONSHIP", "LEADERSHIP"],
  earth: ["CAREER", "STABILITY"],
  metal: ["CAREER", "STABILITY", "LEADERSHIP"],
  water: ["CAREER", "LEARNING", "CHANGE"],
};

export const SAJU_RULE_THEMES: Readonly<Record<string, readonly Theme[]>> = {
  "career.visible-ten-god-peer": ["RELATIONSHIP", "INDEPENDENCE"],
  "career.visible-ten-god-output": ["CAREER", "EXPANSION"],
  "career.visible-ten-god-wealth": ["CAREER", "MONEY"],
  "career.visible-ten-god-authority": ["CAREER", "STABILITY"],
  "career.visible-ten-god-resource": ["CAREER", "LEARNING"],
  "wealth.visible-wealth-none": ["MONEY", "CAUTION"],
  "wealth.visible-wealth-single": ["MONEY", "STABILITY"],
  "wealth.visible-wealth-multiple": ["MONEY", "OPPORTUNITY", "CAUTION"],
  "relationship.visible-yin-dominant": ["RELATIONSHIP", "REST"],
  "relationship.visible-balanced": ["RELATIONSHIP", "STABILITY"],
  "relationship.visible-yang-dominant": ["RELATIONSHIP", "LEADERSHIP"],
  "health.raw-most-represented": ["REST"],
  "health.raw-least-represented": ["REST", "CAUTION"],
  "fortune.sewoon-stem-비견": ["INDEPENDENCE", "LEADERSHIP"],
  "fortune.sewoon-stem-겁재": ["CONFLICT", "CAUTION"],
  "fortune.sewoon-stem-식신": ["EXPANSION", "REST"],
  "fortune.sewoon-stem-상관": ["CHANGE", "CONFLICT"],
  "fortune.sewoon-stem-편재": ["MONEY", "OPPORTUNITY"],
  "fortune.sewoon-stem-정재": ["MONEY", "STABILITY"],
  "fortune.sewoon-stem-편관": ["CAREER", "CAUTION"],
  "fortune.sewoon-stem-정관": ["CAREER", "STABILITY"],
  "fortune.sewoon-stem-편인": ["LEARNING", "CHANGE"],
  "fortune.sewoon-stem-정인": ["LEARNING", "REST"],
};
