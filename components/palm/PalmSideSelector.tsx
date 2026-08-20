import {
  PALM_SIDES,
  PALM_SIDE_LABELS,
  type PalmSide,
  type PalmStepState,
} from "../../src/application/palmFlow";

interface PalmSideSelectorProps {
  readonly state: PalmStepState;
  readonly onSelect: (side: PalmSide) => void;
}

export function PalmSideSelector({ state, onSelect }: PalmSideSelectorProps) {
  return <div className="palm-side-selector" aria-label="촬영할 손 선택">
    {PALM_SIDES.map((side) => {
      const isReady = state.hands[side].status === "ready";
      const isActive = state.activeSide === side;
      return <button
        type="button"
        className={isActive ? "active" : undefined}
        aria-pressed={isActive}
        onClick={() => onSelect(side)}
        key={side}
      >
        <span>{isReady ? "✓" : "○"}</span>
        <b>{PALM_SIDE_LABELS[side]}</b>
        <small>{isReady ? "사진 준비됨" : isActive ? "현재 선택" : "준비 전"}</small>
      </button>;
    })}
  </div>;
}
