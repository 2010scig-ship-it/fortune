import type { CameraFailureStatus } from "./types";

export interface CameraMediaDevices {
  getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
}

export interface StoppableMediaStream {
  getTracks(): readonly Pick<MediaStreamTrack, "stop">[];
}

export class CameraUnsupportedError extends Error {
  constructor() {
    super("Camera capture is not supported in this browser.");
    this.name = "CameraUnsupportedError";
  }
}

export const ENVIRONMENT_CAMERA_CONSTRAINTS = {
  video: { facingMode: { ideal: "environment" } },
  audio: false,
} as const satisfies MediaStreamConstraints;

export function getBrowserMediaDevices(): CameraMediaDevices | undefined {
  if (typeof navigator === "undefined") return undefined;
  const mediaDevices = navigator.mediaDevices;
  if (mediaDevices === undefined || typeof mediaDevices.getUserMedia !== "function") return undefined;
  return mediaDevices;
}

export async function requestEnvironmentCamera(
  mediaDevices: CameraMediaDevices | undefined = getBrowserMediaDevices(),
): Promise<MediaStream> {
  if (mediaDevices === undefined) throw new CameraUnsupportedError();
  return mediaDevices.getUserMedia(ENVIRONMENT_CAMERA_CONSTRAINTS);
}

export function stopMediaStream(stream: StoppableMediaStream | null | undefined): void {
  if (stream === null || stream === undefined) return;
  for (const track of stream.getTracks()) track.stop();
}

export function cameraFailureStatus(cause: unknown): CameraFailureStatus {
  const name = errorName(cause);
  if (name === "CameraUnsupportedError" || name === "NotSupportedError") return "unsupported";
  if (name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError") {
    return "permissionDenied";
  }
  return "error";
}

function errorName(cause: unknown): string | undefined {
  if (typeof cause !== "object" || cause === null || !("name" in cause)) return undefined;
  return typeof cause.name === "string" ? cause.name : undefined;
}
