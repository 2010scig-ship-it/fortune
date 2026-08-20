import { describe, expect, it } from "vitest";
import {
  clearPalmImage,
  countReadyPalmHands,
  createEmptyPalmStepState,
  palmInputSummary,
  selectPalmSide,
  setPalmImage,
} from "../../src/application/palmFlow";

describe("palm step state", () => {
  it("starts with the left hand selected and neither image fabricated", () => {
    const state = createEmptyPalmStepState();
    expect(state.activeSide).toBe("left");
    expect(countReadyPalmHands(state)).toBe(0);
    expect(palmInputSummary(state)).toBe("왼손 없음 · 오른손 없음");
  });

  it("tracks left and right slots independently", () => {
    const file = new File(["palm"], "left-palm.jpg", { type: "image/jpeg" });
    const initial = selectPalmSide(createEmptyPalmStepState(), "right");
    const withLeft = setPalmImage(initial, "left", { file, previewUrl: "blob:left", source: "camera" });

    expect(withLeft.activeSide).toBe("left");
    expect(withLeft.hands.left.status).toBe("ready");
    expect(withLeft.hands.right.status).toBe("empty");
    expect(countReadyPalmHands(withLeft)).toBe(1);
    expect(palmInputSummary(withLeft)).toBe("왼손 사진 있음 · 오른손 없음");

    const cleared = clearPalmImage(withLeft, "left");
    expect(countReadyPalmHands(cleared)).toBe(0);
  });
});
