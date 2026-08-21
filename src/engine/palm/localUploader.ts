import type { PalmImageUploader, UploadedPalmImage } from "./types";

export interface PalmObjectUrlAdapter {
  create(file: File): string;
  revoke(url: string): void;
}

export function createLocalPalmImageUploader(adapter: PalmObjectUrlAdapter = browserObjectUrlAdapter()): PalmImageUploader {
  return {
    async upload(file): Promise<UploadedPalmImage> {
      return { url: adapter.create(file) };
    },
    async remove(image): Promise<void> {
      adapter.revoke(image.url);
    },
  };
}

function browserObjectUrlAdapter(): PalmObjectUrlAdapter {
  if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
    throw new Error("브라우저의 임시 이미지 URL 기능을 사용할 수 없습니다.");
  }
  return {
    create: (file) => URL.createObjectURL(file),
    revoke: (url) => URL.revokeObjectURL(url),
  };
}
