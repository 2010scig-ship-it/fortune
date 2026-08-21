import { describe, expect, it, vi } from "vitest";
import {
  cameraFailureStatus,
  ENVIRONMENT_CAMERA_CONSTRAINTS,
  requestEnvironmentCamera,
  stopMediaStream,
  type CameraMediaDevices,
} from "../../src/camera";

describe("web camera lifecycle", () => {
  it("requests the rear-facing camera without audio", async () => {
    const stream = {} as MediaStream;
    const getUserMedia = vi.fn(async () => stream);
    const mediaDevices: CameraMediaDevices = { getUserMedia };

    await expect(requestEnvironmentCamera(mediaDevices)).resolves.toBe(stream);
    expect(getUserMedia).toHaveBeenCalledWith(ENVIRONMENT_CAMERA_CONSTRAINTS);
  });

  it("reports missing browser support without requesting permission", async () => {
    await expect(requestEnvironmentCamera(undefined)).rejects.toMatchObject({ name: "CameraUnsupportedError" });
    expect(cameraFailureStatus({ name: "CameraUnsupportedError" })).toBe("unsupported");
  });

  it("maps permission failures separately from other camera failures", () => {
    expect(cameraFailureStatus({ name: "NotAllowedError" })).toBe("permissionDenied");
    expect(cameraFailureStatus({ name: "SecurityError" })).toBe("permissionDenied");
    expect(cameraFailureStatus({ name: "NotReadableError" })).toBe("error");
  });

  it("stops every media track during cleanup", () => {
    const firstStop = vi.fn();
    const secondStop = vi.fn();
    stopMediaStream({ getTracks: () => [{ stop: firstStop }, { stop: secondStop }] });
    expect(firstStop).toHaveBeenCalledOnce();
    expect(secondStop).toHaveBeenCalledOnce();
  });
});
