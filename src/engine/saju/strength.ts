import { MethodologyDecisionRequiredError } from "./advancedMethodology";
import type { FourPillars } from "./types";
export function analyzeStrength(_pillars: FourPillars): never { throw new MethodologyDecisionRequiredError("strength"); }
