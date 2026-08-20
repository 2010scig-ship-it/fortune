import { RWS_DECK, drawForSpread, getTarotSpread, type RandomSource, type TarotQuestionCategory, type TarotSpreadId } from "../engine/tarot/index";
import { calculateSajuCore } from "../engine/saju/index";
import { getCurrentSewoon } from "../engine/saju/sewoon";
import type { BirthData, SajuCoreResult, Sewoon } from "../engine/saju/types";
import { combineReadings } from "../interpretation/combined/index";
import type { CombinedReading } from "../interpretation/combined/types";
import { interpretSaju } from "../interpretation/saju/index";
import type { SajuInterpretation } from "../interpretation/saju/types";
import { interpretSpread } from "../interpretation/tarot/index";
import type { TarotSpreadInterpretation } from "../interpretation/tarot/types";

export interface SajuReading { readonly core: SajuCoreResult; readonly sewoon: Sewoon; readonly interpretation: SajuInterpretation }
export interface FullReading extends SajuReading { readonly tarot: TarotSpreadInterpretation; readonly combined: CombinedReading }

export function createSajuReading(birth: BirthData, clock: () => number): SajuReading {
  const core = calculateSajuCore(birth);
  const sewoon = getCurrentSewoon({ clock, timezone: birth.location?.timezone ?? "Asia/Seoul" });
  return { core, sewoon, interpretation: interpretSaju({ core, sewoon }) };
}

export function addTarotReading(saju: SajuReading, spreadId: TarotSpreadId, category: TarotQuestionCategory, rng: RandomSource): FullReading {
  const tarot = interpretSpread(drawForSpread(RWS_DECK, getTarotSpread(spreadId), rng), category);
  return { ...saju, tarot, combined: combineReadings({ saju: saju.interpretation, tarot }) };
}
