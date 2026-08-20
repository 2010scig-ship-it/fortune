export class MethodologyDecisionRequiredError extends Error {
  constructor(readonly feature: "strength" | "daewoon" | "yongshin") {
    super(`${feature} is unsupported until methodology is selected`);
    this.name = "MethodologyDecisionRequiredError";
  }
}
