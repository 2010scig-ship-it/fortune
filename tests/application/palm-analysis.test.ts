import { describe, expect, it, vi } from "vitest";
import { analyzePalmStep } from "../../src/application/palmAnalysis";
import { createEmptyPalmStepState, setPalmImage } from "../../src/application/palmFlow";
import type { PalmAnalyzer, PalmImageUploader, PalmResult } from "../../src/engine/palm";

const mockResult: PalmResult = {
  mode: "mock",
  summary: "mock result",
  limitations: ["mock"],
};

describe("palm analysis application flow", () => {
  it("uploads only ready hands, analyzes URLs, and removes temporary uploads", async () => {
    const file = new File(["left"], "left.jpg", { type: "image/jpeg" });
    const state = setPalmImage(createEmptyPalmStepState(), "left", {
      file,
      previewUrl: "blob:preview",
      source: "library",
    });
    const upload = vi.fn(async () => ({ url: "blob:analysis" }));
    const remove = vi.fn(async () => undefined);
    const analyze = vi.fn(async () => mockResult);
    const uploader: PalmImageUploader = { upload, remove };
    const analyzer: PalmAnalyzer = { analyze };

    await expect(analyzePalmStep(state, uploader, analyzer)).resolves.toBe(mockResult);
    expect(upload).toHaveBeenCalledWith(file);
    expect(analyze).toHaveBeenCalledWith({ leftPalmUrl: "blob:analysis" });
    expect(remove).toHaveBeenCalledWith({ url: "blob:analysis" });
  });

  it("skips the analyzer when no palm image is ready", async () => {
    const analyzer: PalmAnalyzer = { analyze: vi.fn(async () => mockResult) };
    const uploader: PalmImageUploader = { upload: vi.fn(async () => ({ url: "unused" })) };

    await expect(analyzePalmStep(createEmptyPalmStepState(), uploader, analyzer)).resolves.toBeUndefined();
    expect(analyzer.analyze).not.toHaveBeenCalled();
  });

  it("removes temporary uploads even when analysis fails", async () => {
    const file = new File(["left"], "left.jpg", { type: "image/jpeg" });
    const state = setPalmImage(createEmptyPalmStepState(), "left", {
      file,
      previewUrl: "blob:preview",
      source: "camera",
    });
    const remove = vi.fn(async () => undefined);
    const uploader: PalmImageUploader = { upload: async () => ({ url: "blob:analysis" }), remove };
    const analyzer: PalmAnalyzer = { analyze: async () => { throw new Error("vision unavailable"); } };

    await expect(analyzePalmStep(state, uploader, analyzer)).rejects.toThrow("vision unavailable");
    expect(remove).toHaveBeenCalledWith({ url: "blob:analysis" });
  });
});
