import type { PalmSide } from "../../src/application/palmFlow";

interface PalmPreviewProps {
  readonly side: PalmSide;
  readonly previewUrl: string;
  readonly pending: boolean;
  readonly processing?: boolean;
  readonly processingError?: string | undefined;
  readonly width?: number | undefined;
  readonly height?: number | undefined;
  readonly onRetake: () => void;
  readonly onChooseFile: () => void;
  readonly onDelete: () => void;
  readonly onUse?: () => void;
}

export function PalmPreview({
  side,
  previewUrl,
  pending,
  processing = false,
  processingError,
  width,
  height,
  onRetake,
  onChooseFile,
  onDelete,
  onUse,
}: PalmPreviewProps) {
  const sideLabel = side === "left" ? "왼손" : "오른손";
  return <div className="palm-preview">
    <div className="palm-preview-image">
      <img src={previewUrl} alt={`${sideLabel} 손바닥 촬영 미리보기`}/>
      <span>{side.toUpperCase()} PALM</span>
    </div>
    <div className="palm-preview-copy">
      <span>{pending ? "CAPTURED" : "READY"}</span>
      <h3>{sideLabel} {pending ? "촬영 완료" : "사진 준비됨"}</h3>
      <p>손 전체가 프레임 안에 있고 손금이 흔들림 없이 보이는지 확인해 주세요.</p>
      {width !== undefined && height !== undefined ? <small className="palm-image-meta">최적화 완료 · {width} × {height}px</small> : null}
      {processingError ? <p className="error" role="alert">{processingError}</p> : null}
      <div className="palm-preview-actions">
        <button type="button" disabled={processing} onClick={onRetake}>다시 찍기</button>
        <button type="button" disabled={processing} onClick={onChooseFile}>사진에서 다시 선택</button>
        <button type="button" disabled={processing} onClick={onDelete}>{pending ? "선택 취소" : "이미지 삭제"}</button>
        {pending && onUse ? <button type="button" disabled={processing} className="primary-button" onClick={onUse}>{processing ? "이미지 최적화 중…" : "이 사진 사용하기"} <span>→</span></button> : null}
      </div>
    </div>
  </div>;
}
