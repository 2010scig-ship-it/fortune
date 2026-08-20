import { READING_FLOW_STEPS, type ReadingFlowStep } from "../../src/application/readingFlow";

interface ReadingProgressProps {
  readonly activeStep: ReadingFlowStep;
  readonly unlockedThrough: number;
  readonly onStepChange: (step: ReadingFlowStep) => void;
}

export function ReadingProgress({ activeStep, unlockedThrough, onStepChange }: ReadingProgressProps) {
  return <ol className="reading-progress" aria-label="리딩 진행 단계">
    {READING_FLOW_STEPS.map((step, index) => {
      const isActive = step.id === activeStep;
      const isComplete = index < unlockedThrough;
      const isUnlocked = index <= unlockedThrough;
      return <li className={`${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`} key={step.id}>
        <button type="button" disabled={!isUnlocked} aria-current={isActive ? "step" : undefined} onClick={() => onStepChange(step.id)}>
          <span>{isComplete ? "✓" : String(step.number).padStart(2, "0")}</span>
          <b>{step.label}</b>
          <small>{step.description}</small>
        </button>
      </li>;
    })}
  </ol>;
}
