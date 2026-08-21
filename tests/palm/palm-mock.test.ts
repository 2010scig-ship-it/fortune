import { describe, expect, it, vi } from "vitest";
import { createLocalPalmImageUploader, mockPalmAnalyzer } from "../../src/engine/palm";

describe("mock palm adapters", () => {
  it("creates a structured result without pretending to inspect image lines", async () => {
    const result = await mockPalmAnalyzer.analyze({ leftPalmUrl: "blob:left" });

    expect(result.mode).toBe("mock");
    expect(result.leftHand?.heartLine).toMatchObject({
      observedFeatures: expect.stringContaining("실제 영상 판독은 수행하지 않았습니다"),
      confidence: 0,
    });
    expect(result.rightHand).toBeUndefined();
    expect(result.limitations.join(" ")).toContain("mock");
  });

  it("uses replaceable object URL operations for local upload and removal", async () => {
    const create = vi.fn(() => "blob:uploaded");
    const revoke = vi.fn();
    const uploader = createLocalPalmImageUploader({ create, revoke });
    const file = new File(["palm"], "palm.jpg", { type: "image/jpeg" });

    const uploaded = await uploader.upload(file);
    await uploader.remove?.(uploaded);

    expect(create).toHaveBeenCalledWith(file);
    expect(uploaded).toEqual({ url: "blob:uploaded" });
    expect(revoke).toHaveBeenCalledWith("blob:uploaded");
  });
});
