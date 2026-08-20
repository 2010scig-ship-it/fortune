import { THEME_RELATIONS, type ThemeRelationKind } from "../../data/themeRelations";
import { THEMES, type Theme } from "../themes";
import { extractSajuThemeEvidence, extractTarotThemeEvidence, orderedThemesFromEvidence } from "./themeExtraction";
import type { CombinedReading, CombinedReadingInput, ThemeRelationshipSignal } from "./types";

const LIMITATIONS = [
  "이 결과는 엔터테인먼트와 자기성찰을 위한 규칙 기반 통합 해석입니다.",
  "두 리딩에 같은 주제가 나와도 실제로 그 일이 일어날 가능성이 높아졌다는 뜻은 아닙니다.",
  "함께 챙길 점과 충돌할 수 있는 점은 정해진 주제 비교 규칙으로 만든 참고용 조언이며, 미래의 성공이나 실패를 예측하지 않습니다.",
  "의료·법률·투자 등 중요한 결정은 이 결과만으로 판단하지 않아야 합니다.",
] as const;

export function findThemeRelationships(
  sajuThemes: readonly Theme[],
  tarotThemes: readonly Theme[],
  kind: ThemeRelationKind,
): readonly ThemeRelationshipSignal[] {
  const saju = new Set(sajuThemes);
  const tarot = new Set(tarotThemes);
  const agreements = new Set(THEMES.filter((theme) => saju.has(theme) && tarot.has(theme)));

  return THEME_RELATIONS
    .filter((relation) => relation.kind === kind)
    .flatMap((relation): readonly ThemeRelationshipSignal[] => {
      if (agreements.has(relation.left) && agreements.has(relation.right)) return [];
      const forward = saju.has(relation.left) && tarot.has(relation.right);
      const reverse = saju.has(relation.right) && tarot.has(relation.left);
      if (!forward && !reverse) return [];
      return [{
        relationId: relation.id,
        sajuTheme: forward ? relation.left : relation.right,
        tarotTheme: forward ? relation.right : relation.left,
        explanation: relation.explanation,
      }];
    });
}

export function combineReadings(input: CombinedReadingInput): CombinedReading {
  const sajuEvidence = extractSajuThemeEvidence(input.saju);
  const tarotEvidence = extractTarotThemeEvidence(input.tarot);
  const sajuThemes = orderedThemesFromEvidence(sajuEvidence);
  const tarotThemes = orderedThemesFromEvidence(tarotEvidence);
  const tarotSet = new Set(tarotThemes);
  const agreements = sajuThemes.filter((theme) => tarotSet.has(theme));

  return {
    methodology: "phase-5-theme-comparison-v1",
    sajuThemes,
    tarotThemes,
    agreements,
    complementarySignals: findThemeRelationships(sajuThemes, tarotThemes, "complement"),
    tensions: findThemeRelationships(sajuThemes, tarotThemes, "tension"),
    evidence: { saju: sajuEvidence, tarot: tarotEvidence },
    limitations: LIMITATIONS,
  };
}
