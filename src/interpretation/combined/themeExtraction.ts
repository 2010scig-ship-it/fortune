import { CAREER_ELEMENT_THEMES, DAY_MASTER_ELEMENT_THEMES, DAY_MASTER_YIN_YANG_THEMES, SAJU_RULE_THEMES } from "../../data/sajuThemeMappings";
import type { Element, YinYang } from "../../engine/saju/types";
import type { InterpretationPoint, SajuInterpretation } from "../saju/types";
import type { TarotSpreadInterpretation } from "../tarot/types";
import { THEMES, type Theme } from "../themes";
import type { ThemeEvidence } from "./types";

const ELEMENTS = new Set<Element>(["wood", "fire", "earth", "metal", "water"]);
const YIN_YANG = new Set<YinYang>(["yin", "yang"]);

function evidenceValue(point: InterpretationPoint, key: string): string | undefined {
  return point.evidence.find((entry) => entry.key === key)?.value;
}

function isElement(value: string | undefined): value is Element {
  return value !== undefined && ELEMENTS.has(value as Element);
}

function isYinYang(value: string | undefined): value is YinYang {
  return value !== undefined && YIN_YANG.has(value as YinYang);
}

export function themesForSajuPoint(point: InterpretationPoint): readonly Theme[] {
  if (point.ruleId === "personality.day-master-element") {
    const compound = evidenceValue(point, "dayMaster");
    const element = compound?.split("/").at(-1);
    return isElement(element) ? DAY_MASTER_ELEMENT_THEMES[element] : [];
  }
  if (point.ruleId === "personality.day-master-yin-yang") {
    const yinYang = evidenceValue(point, "dayMasterYinYang");
    return isYinYang(yinYang) ? DAY_MASTER_YIN_YANG_THEMES[yinYang] : [];
  }
  if (point.ruleId === "career.day-master-work-style") {
    const element = evidenceValue(point, "dayMasterElement");
    return isElement(element) ? CAREER_ELEMENT_THEMES[element] : [];
  }
  return SAJU_RULE_THEMES[point.ruleId] ?? [];
}

export function extractSajuThemeEvidence(interpretation: SajuInterpretation): readonly ThemeEvidence[] {
  return Object.values(interpretation.categories).flatMap((points) => points.flatMap((point) =>
    themesForSajuPoint(point).map((theme): ThemeEvidence => ({
      theme,
      system: "saju",
      sourceId: point.ruleId,
      context: [
        { key: "category", value: point.category },
        ...point.evidence,
      ],
    })),
  ));
}

export function extractTarotThemeEvidence(interpretation: TarotSpreadInterpretation): readonly ThemeEvidence[] {
  return interpretation.cards.flatMap((card) => card.themes.map((theme): ThemeEvidence => ({
    theme,
    system: "tarot",
    sourceId: `${card.cardId}@${card.position.id}`,
    context: [
      { key: "card", value: card.cardName },
      { key: "orientation", value: card.orientation },
      { key: "position", value: card.position.id },
    ],
  })));
}

export function orderedThemesFromEvidence(evidence: readonly ThemeEvidence[]): readonly Theme[] {
  const present = new Set(evidence.map(({ theme }) => theme));
  return THEMES.filter((theme) => present.has(theme));
}
