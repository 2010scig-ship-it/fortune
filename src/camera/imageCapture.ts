export interface VideoFrameSource {
  readonly videoWidth: number;
  readonly videoHeight: number;
}

export interface CaptureVideoFrameOptions {
  readonly canvasFactory?: () => HTMLCanvasElement;
  readonly now?: () => number;
}

export async function captureVideoFrame(
  video: VideoFrameSource,
  options: CaptureVideoFrameOptions = {},
): Promise<File> {
  if (video.videoWidth <= 0 || video.videoHeight <= 0) {
    throw new Error("카메라 화면이 준비되지 않았습니다. 잠시 후 다시 촬영해 주세요.");
  }

  const canvas = (options.canvasFactory ?? createBrowserCanvas)();
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  if (context === null) throw new Error("촬영 이미지를 만들 수 없습니다.");
  context.drawImage(video as CanvasImageSource, 0, 0, canvas.width, canvas.height);

  const blob = await canvasToBlob(canvas);
  const capturedAt = (options.now ?? Date.now)();
  return new File([blob], `palm-${capturedAt}.jpg`, {
    type: blob.type || "image/jpeg",
    lastModified: capturedAt,
  });
}

function createBrowserCanvas(): HTMLCanvasElement {
  if (typeof document === "undefined") throw new Error("브라우저에서만 카메라 이미지를 만들 수 있습니다.");
  return document.createElement("canvas");
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error("촬영 이미지를 파일로 변환하지 못했습니다."));
        return;
      }
      resolve(blob);
    }, "image/jpeg", 0.92);
  });
}
