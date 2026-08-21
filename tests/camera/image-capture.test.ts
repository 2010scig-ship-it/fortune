import { describe, expect, it, vi } from "vitest";
import { captureVideoFrame } from "../../src/camera";

describe("camera frame capture", () => {
  it("draws the current video frame and returns a JPEG File", async () => {
    const drawImage = vi.fn();
    const context = { drawImage } as unknown as CanvasRenderingContext2D;
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
      toBlob: (callback: BlobCallback) => callback(new Blob(["palm"], { type: "image/jpeg" })),
    } as unknown as HTMLCanvasElement;
    const video = { videoWidth: 1280, videoHeight: 720 };

    const file = await captureVideoFrame(video, {
      canvasFactory: () => canvas,
      now: () => 1234,
    });

    expect(canvas.width).toBe(1280);
    expect(canvas.height).toBe(720);
    expect(drawImage).toHaveBeenCalledWith(video, 0, 0, 1280, 720);
    expect(file.name).toBe("palm-1234.jpg");
    expect(file.type).toBe("image/jpeg");
  });

  it("refuses to capture before video dimensions are available", async () => {
    await expect(captureVideoFrame({ videoWidth: 0, videoHeight: 0 })).rejects.toThrow("카메라 화면이 준비되지 않았습니다");
  });
});
