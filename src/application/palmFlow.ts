export const PALM_SIDES = ["left", "right"] as const;

export type PalmSide = (typeof PALM_SIDES)[number];
export type PalmImageSource = "camera" | "library";

export const PALM_SIDE_LABELS: Readonly<Record<PalmSide, string>> = {
  left: "왼손",
  right: "오른손",
};

export interface PalmImageDraft {
  readonly file: File;
  readonly previewUrl: string;
  readonly source: PalmImageSource;
  readonly width?: number;
  readonly height?: number;
  readonly originalBytes?: number;
  readonly optimizedBytes?: number;
}

export type PalmHandInputState =
  | { readonly side: PalmSide; readonly status: "empty" }
  | { readonly side: PalmSide; readonly status: "ready"; readonly image: PalmImageDraft };

export interface PalmStepState {
  readonly activeSide: PalmSide;
  readonly hands: Readonly<Record<PalmSide, PalmHandInputState>>;
}

export function createEmptyPalmStepState(): PalmStepState {
  return {
    activeSide: "left",
    hands: {
      left: { side: "left", status: "empty" },
      right: { side: "right", status: "empty" },
    },
  };
}

export function selectPalmSide(state: PalmStepState, side: PalmSide): PalmStepState {
  return state.activeSide === side ? state : { ...state, activeSide: side };
}

export function setPalmImage(state: PalmStepState, side: PalmSide, image: PalmImageDraft): PalmStepState {
  return {
    ...state,
    activeSide: side,
    hands: { ...state.hands, [side]: { side, status: "ready", image } },
  };
}

export function clearPalmImage(state: PalmStepState, side: PalmSide): PalmStepState {
  return {
    ...state,
    hands: { ...state.hands, [side]: { side, status: "empty" } },
  };
}

export function countReadyPalmHands(state: PalmStepState): number {
  return PALM_SIDES.filter((side) => state.hands[side].status === "ready").length;
}

export function palmInputSummary(state: PalmStepState): string {
  return PALM_SIDES
    .map((side) => `${PALM_SIDE_LABELS[side]} ${state.hands[side].status === "ready" ? "사진 있음" : "없음"}`)
    .join(" · ");
}

export function releasePalmPreviewUrls(state: PalmStepState, revoke: (url: string) => void): void {
  for (const side of PALM_SIDES) {
    const hand = state.hands[side];
    if (hand.status === "ready") revoke(hand.image.previewUrl);
  }
}
