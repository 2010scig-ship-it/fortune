export type CameraStatus =
  | "idle"
  | "requesting"
  | "active"
  | "captured"
  | "permissionDenied"
  | "unsupported"
  | "error";

export type CameraFailureStatus = Extract<CameraStatus, "permissionDenied" | "unsupported" | "error">;
