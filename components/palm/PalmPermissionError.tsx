import type { CameraFailureStatus } from "../../src/camera";

const ERROR_COPY: Readonly<Record<CameraFailureStatus, { readonly title: string; readonly body: string }>> = {
  permissionDenied: {
    title: "카메라 권한이 허용되지 않았습니다.",
    body: "브라우저의 카메라 권한을 확인하거나 기존 사진을 선택해 주세요.",
  },
  unsupported: {
    title: "이 브라우저에서는 카메라를 사용할 수 없습니다.",
    body: "기기의 카메라 앱으로 촬영한 뒤 사진에서 선택해 주세요.",
  },
  error: {
    title: "카메라를 시작하지 못했습니다.",
    body: "다른 앱이 카메라를 사용 중인지 확인하거나 기존 사진을 선택해 주세요.",
  },
};

interface PalmPermissionErrorProps {
  readonly status: CameraFailureStatus;
  readonly onRetry: () => void;
  readonly onNativeCapture: () => void;
  readonly onChooseFile: () => void;
  readonly onCancel: () => void;
}

export function PalmPermissionError({ status, onRetry, onNativeCapture, onChooseFile, onCancel }: PalmPermissionErrorProps) {
  const copy = ERROR_COPY[status];
  return <div className="palm-camera-state" role="alert">
    <span>CAMERA · FALLBACK</span>
    <h3>{copy.title}</h3>
    <p>{copy.body}</p>
    <div className="palm-state-actions">
      {status !== "unsupported" ? <button type="button" onClick={onRetry}>다시 시도</button> : null}
      <button type="button" onClick={onNativeCapture}>기기 카메라로 촬영</button>
      <button type="button" className="primary-button" onClick={onChooseFile}>사진 선택 <span>→</span></button>
      <button type="button" onClick={onCancel}>돌아가기</button>
    </div>
  </div>;
}
