import { MethodologyDecisionRequiredError } from "./advancedMethodology";
import type { BirthData, FourPillars } from "./types";
export function calculateDaewoon(_birth: BirthData, _pillars: FourPillars): never { throw new MethodologyDecisionRequiredError("daewoon"); }
