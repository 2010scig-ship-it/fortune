import { describe, expect, it, vi } from "vitest";
import { fitWithinLongEdge, optimizePalmImage } from "../../src/camera";

describe("palm image optimization", () => {
  it("fits the long edge without enlarging smaller images", () => {
    expect(fitWithinLongEdge(4000, 2000, 1800)).toEqual({ width: 1800, height: 900 });
    expect(fitWithinLongEdge(1200, 1600, 1800)).toEqual({ width: 1200, height: 1600 });
  });

  it("redraws and re-encodes an image with the configured size and quality", async () => {
    const drawImage = vi.fn();
    const fillRect = vi.fn();
    const close = vi.fn();
    const toBlob = vi.fn((callback: BlobCallback, mimeType?: string, quality?: number) => {
      expect(mimeType).toBe("image/jpeg");
      expect(quality).toBe(0.86);
      callback(new Blob(["optimized-palm"], { type: "image/jpeg" }));
    });
    const context = { drawImage, fillRect, fillStyle: "" } as unknown as CanvasRenderingContext2D;
    const canvas = { width: 0, height: 0, getContext: () => context, toBlob } as unknown as HTMLCanvasElement;
    const source = {} as CanvasImageSource;
    const file = new File(["original-palm"], "palm.png", { type: "image/png" });

    const result = await optimizePalmImage(file, {}, {
      decode: async () => ({ source, width: 4000, height: 2000, close }),
      canvasFactory: () => canvas,
    });

    expect(canvas.width).toBe(1800);
    expect(canvas.height).toBe(900);
    expect(fillRect).toHaveBeenCalledWith(0, 0, 1800, 900);
    expect(drawImage).toHaveBeenCalledWith(source, 0, 0, 1800, 900);
    expect(result.file.name).toBe("palm-optimized.jpg");
    expect(result).toMatchObject({ width: 1800, height: 900, mimeType: "image/jpeg", quality: 0.86 });
    expect(close).toHaveBeenCalledOnce();
  });

  it("rejects invalid dimensions and still releases decoded resources", async () => {
    const close = vi.fn();
    const file = new File(["palm"], "palm.jpg", { type: "image/jpeg" });

    await expect(optimizePalmImage(file, {}, {
      decode: async () => ({ source: {} as CanvasImageSource, width: 0, height: 0, close }),
    })).rejects.toThrow("이미지 크기를 확인할 수 없습니다");
    expect(close).toHaveBeenCalledOnce();
  });
});
