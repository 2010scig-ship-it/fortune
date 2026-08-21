export const DEFAULT_PALM_IMAGE_OPTIONS = {
  maxLongEdge: 1800,
  mimeType: "image/jpeg",
  quality: 0.86,
} as const satisfies Required<PalmImageOptimizationOptions>;

export interface PalmImageOptimizationOptions {
  readonly maxLongEdge?: number;
  readonly mimeType?: "image/jpeg" | "image/webp";
  readonly quality?: number;
}

export interface DecodedPalmImage {
  readonly source: CanvasImageSource;
  readonly width: number;
  readonly height: number;
  readonly close?: () => void;
}

export interface PalmImageOptimizationDependencies {
  readonly decode?: (file: File) => Promise<DecodedPalmImage>;
  readonly canvasFactory?: () => HTMLCanvasElement;
}

export interface OptimizedPalmImage {
  readonly file: File;
  readonly width: number;
  readonly height: number;
  readonly originalBytes: number;
  readonly optimizedBytes: number;
  readonly mimeType: "image/jpeg" | "image/webp";
  readonly quality: number;
}

export function fitWithinLongEdge(width: number, height: number, maxLongEdge: number): { readonly width: number; readonly height: number } {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new RangeError("이미지 크기를 확인할 수 없습니다.");
  }
  if (!Number.isFinite(maxLongEdge) || maxLongEdge <= 0) throw new RangeError("최대 이미지 크기가 올바르지 않습니다.");

  const scale = Math.min(1, maxLongEdge / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export async function optimizePalmImage(
  file: File,
  options: PalmImageOptimizationOptions = {},
  dependencies: PalmImageOptimizationDependencies = {},
): Promise<OptimizedPalmImage> {
  const maxLongEdge = options.maxLongEdge ?? DEFAULT_PALM_IMAGE_OPTIONS.maxLongEdge;
  const mimeType = options.mimeType ?? DEFAULT_PALM_IMAGE_OPTIONS.mimeType;
  const quality = options.quality ?? DEFAULT_PALM_IMAGE_OPTIONS.quality;
  if (!Number.isFinite(quality) || quality <= 0 || quality > 1) throw new RangeError("이미지 품질 값은 0보다 크고 1 이하여야 합니다.");

  const decoded = await (dependencies.decode ?? decodeBrowserImage)(file);
  try {
    const dimensions = fitWithinLongEdge(decoded.width, decoded.height, maxLongEdge);
    const canvas = (dependencies.canvasFactory ?? createBrowserCanvas)();
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const context = canvas.getContext("2d");
    if (context === null) throw new Error("이미지 최적화를 위한 화면을 만들 수 없습니다.");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, dimensions.width, dimensions.height);
    context.drawImage(decoded.source, 0, 0, dimensions.width, dimensions.height);
    const blob = await canvasToBlob(canvas, mimeType, quality);
    const extension = mimeType === "image/webp" ? "webp" : "jpg";
    const baseName = file.name.replace(/\.[^.]+$/, "") || "palm";
    const optimizedFile = new File([blob], `${baseName}-optimized.${extension}`, {
      type: mimeType,
      lastModified: Date.now(),
    });

    return {
      file: optimizedFile,
      width: dimensions.width,
      height: dimensions.height,
      originalBytes: file.size,
      optimizedBytes: optimizedFile.size,
      mimeType,
      quality,
    };
  } finally {
    decoded.close?.();
  }
}

async function decodeBrowserImage(file: File): Promise<DecodedPalmImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch {
      // Safari/browser codec differences can reject createImageBitmap while <img> can still decode the file.
    }
  }
  if (typeof Image === "undefined" || typeof URL === "undefined") {
    throw new Error("이 브라우저에서는 이미지 파일을 읽을 수 없습니다.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("선택한 이미지 파일을 읽지 못했습니다."));
      image.src = objectUrl;
    });
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (cause: unknown) {
    URL.revokeObjectURL(objectUrl);
    throw cause;
  }
}

function createBrowserCanvas(): HTMLCanvasElement {
  if (typeof document === "undefined") throw new Error("브라우저에서만 이미지를 최적화할 수 있습니다.");
  return document.createElement("canvas");
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error("최적화한 이미지를 파일로 변환하지 못했습니다."));
        return;
      }
      resolve(blob);
    }, mimeType, quality);
  });
}
