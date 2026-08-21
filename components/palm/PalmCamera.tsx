"use client";

import { forwardRef, useEffect } from "react";
import type { PalmSide } from "../../src/application/palmFlow";
import { PalmGuideOverlay } from "./PalmGuideOverlay";

interface PalmCameraProps {
  readonly side: PalmSide;
  readonly stream: MediaStream;
  readonly onCapture: () => void;
  readonly onCancel: () => void;
  readonly onPlaybackError: () => void;
}

export const PalmCamera = forwardRef<HTMLVideoElement, PalmCameraProps>(function PalmCamera(
  { side, stream, onCapture, onCancel, onPlaybackError },
  ref,
) {
  useEffect(() => {
    if (typeof ref === "function" || ref === null) return;
    const video = ref.current;
    if (video === null) return;
    video.srcObject = stream;
    void video.play().catch(onPlaybackError);
    return () => {
      if (video.srcObject === stream) video.srcObject = null;
    };
  }, [onPlaybackError, ref, stream]);

  return <div className="palm-camera-shell">
    <div className="palm-camera-media">
      <video ref={ref} autoPlay muted playsInline aria-label={`${side === "left" ? "왼손" : "오른손"} 카메라 미리보기`}/>
      <PalmGuideOverlay side={side} camera/>
    </div>
    <div className="palm-camera-controls">
      <button type="button" className="secondary-button" onClick={onCancel}>촬영 취소</button>
      <button type="button" className="camera-shutter" onClick={onCapture}><span aria-hidden="true"/>촬영</button>
    </div>
  </div>;
});
