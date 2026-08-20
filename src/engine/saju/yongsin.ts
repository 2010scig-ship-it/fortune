import { MethodologyDecisionRequiredError } from "./advancedMethodology";
import type { FourPillars } from "./types";
export function analyzeYongshin(_pillars: FourPillars): never { throw new MethodologyDecisionRequiredError("yongshin"); }
