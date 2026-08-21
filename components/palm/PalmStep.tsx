"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  countReadyPalmHands,
  PALM_SIDE_LABELS,
  type PalmImageDraft,
  type PalmSide,
  type PalmStepState,
} from "../../src/application/palmFlow";
import {
  cameraFailureStatus,
  captureVideoFrame,
  optimizePalmImage,
  requestEnvironmentCamera,
  stopMediaStream,
  type CameraStatus,
} from "../../src/camera";
import { PalmCamera } from "./PalmCamera";
import { PalmGuideOverlay } from "./PalmGuideOverlay";
import { PalmPermissionError } from "./PalmPermissionError";
import { PalmPreview } from "./PalmPreview";
import { PalmSideSelector } from "./PalmSideSelector";

interface PalmStepProps {
  readonly state: PalmStepState;
  readonly onSelectSide: (side: PalmSide) => void;
  readonly onAcceptImage: (side: PalmSide, image: PalmImageDraft) => void;
  readonly onClearImage: (side: PalmSide) => void;
  readonly onBack: () => void;
  readonly onContinue: () => void | Promise<void>;
  readonly analyzing?: boolean;
  readonly analysisError?: string | undefined;
}

const PALM_CAPTURE_GUIDE = [
  "손바닥을 카메라 정면으로 향해주세요.",
  "손가락을 자연스럽게 펴고 손 전체를 프레임 안에 넣어주세요.",
  "밝은 곳에서 손금에 초점을 맞추고 강한 그림자와 흔들림을 피해주세요.",
] as const;

export function PalmStep({
  state,
  onSelectSide,
  onAcceptImage,
  onClearImage,
  onBack,
  onContinue,
  analyzing = false,
  analysisError,
}: PalmStepProps) {
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle");
  const [permissionIntro, setPermissionIntro] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [pendingImage, setPendingImage] = useState<PalmImageDraft | undefined>(undefined);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [imageProcessingError, setImageProcessingError] = useState<string>();
  const streamRef = useRef<MediaStream | null>(null);
  const pendingImageRef = useRef<PalmImageDraft | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const libraryInputRef = useRef<HTMLInputElement>(null);
  const captureFallbackInputRef = useRef<HTMLInputElement>(null);
  const requestVersionRef = useRef(0);
  const mountedRef = useRef(true);
  const readyCount = countReadyPalmHands(state);
  const activeLabel = PALM_SIDE_LABELS[state.activeSide];
  const activeHand = state.hands[state.activeSide];

  const stopCurrentStream = useCallback(() => {
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    setCameraStream(null);
  }, []);

  const discardPendingImage = useCallback(() => {
    const current = pendingImageRef.current;
    if (current !== undefined) URL.revokeObjectURL(current.previewUrl);
    pendingImageRef.current = undefined;
    setPendingImage(undefined);
    setImageProcessing(false);
    setImageProcessingError(undefined);
  }, []);

  const resetCaptureUi = useCallback(() => {
    requestVersionRef.current += 1;
    stopCurrentStream();
    discardPendingImage();
    setCameraStatus("idle");
    setPermissionIntro(false);
  }, [discardPendingImage, stopCurrentStream]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestVersionRef.current += 1;
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      const pending = pendingImageRef.current;
      if (pending !== undefined) URL.revokeObjectURL(pending.previewUrl);
      pendingImageRef.current = undefined;
    };
  }, []);

  async function startCamera() {
    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    stopCurrentStream();
    discardPendingImage();
    setPermissionIntro(false);
    setCameraStatus("requesting");

    try {
      const stream = await requestEnvironmentCamera();
      if (!mountedRef.current || requestVersionRef.current !== requestVersion) {
        stopMediaStream(stream);
        return;
      }
      streamRef.current = stream;
      setCameraStream(stream);
      setCameraStatus("active");
    } catch (cause: unknown) {
      if (!mountedRef.current || requestVersionRef.current !== requestVersion) return;
      stopCurrentStream();
      setCameraStatus(cameraFailureStatus(cause));
    }
  }

  async function capturePalm() {
    const video = videoRef.current;
    if (video === null) return;
    const captureVersion = requestVersionRef.current + 1;
    requestVersionRef.current = captureVersion;
    try {
      const capture = captureVideoFrame(video);
      stopCurrentStream();
      const file = await capture;
      if (!mountedRef.current || requestVersionRef.current !== captureVersion) return;
      const image: PalmImageDraft = {
        file,
        previewUrl: URL.createObjectURL(file),
        source: "camera",
      };
      pendingImageRef.current = image;
      setPendingImage(image);
      setImageProcessingError(undefined);
      setCameraStatus("captured");
    } catch {
      stopCurrentStream();
      if (!mountedRef.current || requestVersionRef.current !== captureVersion) return;
      setCameraStatus("error");
    }
  }

  function cancelCamera() {
    requestVersionRef.current += 1;
    stopCurrentStream();
    setCameraStatus("idle");
    setPermissionIntro(false);
  }

  function chooseFile() {
    libraryInputRef.current?.click();
  }

  function useNativeCaptureFallback() {
    captureFallbackInputRef.current?.click();
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>, source: PalmImageDraft["source"]) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (file === undefined) return;
    if (file.type !== "" && !file.type.startsWith("image/")) {
      setCameraStatus("error");
      return;
    }

    requestVersionRef.current += 1;
    stopCurrentStream();
    discardPendingImage();
    const image: PalmImageDraft = {
      file,
      previewUrl: URL.createObjectURL(file),
      source,
    };
    pendingImageRef.current = image;
    setPendingImage(image);
    setImageProcessingError(undefined);
    setPermissionIntro(false);
    setCameraStatus("captured");
  }

  async function usePendingImage() {
    const image = pendingImageRef.current;
    if (image === undefined) return;
    const side = state.activeSide;
    const processingVersion = requestVersionRef.current + 1;
    requestVersionRef.current = processingVersion;
    setImageProcessing(true);
    setImageProcessingError(undefined);
    try {
      const optimized = await optimizePalmImage(image.file);
      if (!mountedRef.current || requestVersionRef.current !== processingVersion || pendingImageRef.current !== image) return;
      const acceptedImage: PalmImageDraft = {
        file: optimized.file,
        previewUrl: URL.createObjectURL(optimized.file),
        source: image.source,
        width: optimized.width,
        height: optimized.height,
        originalBytes: optimized.originalBytes,
        optimizedBytes: optimized.optimizedBytes,
      };
      URL.revokeObjectURL(image.previewUrl);
      pendingImageRef.current = undefined;
      setPendingImage(undefined);
      onAcceptImage(side, acceptedImage);
      setCameraStatus("idle");
      setPermissionIntro(false);

      const otherSide: PalmSide = side === "left" ? "right" : "left";
      if (state.hands[otherSide].status === "empty") onSelectSide(otherSide);
    } catch (cause: unknown) {
      if (!mountedRef.current || requestVersionRef.current !== processingVersion) return;
      setImageProcessingError(cause instanceof Error ? cause.message : "이미지를 최적화하지 못했습니다.");
    } finally {
      if (mountedRef.current && requestVersionRef.current === processingVersion) setImageProcessing(false);
    }
  }

  function retakePendingImage() {
    discardPendingImage();
    setCameraStatus("idle");
    setPermissionIntro(true);
  }

  function selectSide(side: PalmSide) {
    if (side === state.activeSide) return;
    resetCaptureUi();
    onSelectSide(side);
  }

  const handlePlaybackError = useCallback(() => {
    requestVersionRef.current += 1;
    stopCurrentStream();
    setCameraStatus("error");
  }, [stopCurrentStream]);

  function leavePalmStep(next: () => void) {
    resetCaptureUi();
    next();
  }

  async function continuePalmStep() {
    resetCaptureUi();
    await onContinue();
  }

  const failureStatus = cameraStatus === "permissionDenied" || cameraStatus === "unsupported" || cameraStatus === "error"
    ? cameraStatus
    : undefined;

  return <section className="palm-step flow-stage">
    <div className="section-heading">
      <p className="eyebrow">STEP 04 · PALM</p>
      <h2>손에 남은 결</h2>
      <p>손바닥에서 보이는 특징을 먼저 기록하고, 전통적인 의미와 자기성찰 관점의 해석을 나누어 살펴봅니다.</p>
    </div>

    <div className="palm-workspace">
      <div className="palm-workspace-head">
        <div><span>PALM · 손 선택</span><strong>{readyCount}/2 준비됨</strong></div>
        <p>한 손만으로도 진행할 수 있습니다. 두 손을 모두 촬영하면 더 많은 관찰 정보를 사용할 수 있습니다.</p>
      </div>
      <PalmSideSelector state={state} onSelect={selectSide}/>

      <input
        ref={libraryInputRef}
        className="palm-file-input"
        type="file"
        accept="image/*"
        onChange={(event) => handleFileSelected(event, "library")}
        aria-label={`${activeLabel} 사진 라이브러리에서 선택`}
      />
      <input
        ref={captureFallbackInputRef}
        className="palm-file-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(event) => handleFileSelected(event, "camera")}
        aria-label={`${activeLabel} 기기 카메라 fallback`}
      />

      <div className="palm-capture-layout">
        {pendingImage !== undefined ? <PalmPreview
          side={state.activeSide}
          previewUrl={pendingImage.previewUrl}
          pending
          processing={imageProcessing}
          processingError={imageProcessingError}
          onRetake={retakePendingImage}
          onChooseFile={chooseFile}
          onDelete={() => {
            discardPendingImage();
            setCameraStatus("idle");
          }}
          onUse={usePendingImage}
        /> : null}

        {pendingImage === undefined && cameraStatus === "active" && cameraStream !== null ? <PalmCamera
          ref={videoRef}
          side={state.activeSide}
          stream={cameraStream}
          onCapture={capturePalm}
          onCancel={cancelCamera}
          onPlaybackError={handlePlaybackError}
        /> : null}

        {pendingImage === undefined && cameraStatus === "requesting" ? <div className="palm-camera-state" aria-live="polite">
          <span>CAMERA · REQUESTING</span>
          <h3>카메라를 준비하고 있습니다.</h3>
          <p>브라우저에 권한 확인 창이 나타나면 카메라 사용을 허용해 주세요.</p>
          <button type="button" onClick={cancelCamera}>취소</button>
        </div> : null}

        {pendingImage === undefined && failureStatus !== undefined ? <PalmPermissionError
          status={failureStatus}
          onRetry={startCamera}
          onNativeCapture={useNativeCaptureFallback}
          onChooseFile={chooseFile}
          onCancel={cancelCamera}
        /> : null}

        {pendingImage === undefined && cameraStatus === "idle" && activeHand.status === "ready" && !permissionIntro ? <PalmPreview
          side={state.activeSide}
          previewUrl={activeHand.image.previewUrl}
          pending={false}
          width={activeHand.image.width}
          height={activeHand.image.height}
          onRetake={() => setPermissionIntro(true)}
          onChooseFile={chooseFile}
          onDelete={() => onClearImage(state.activeSide)}
        /> : null}

        {pendingImage === undefined && cameraStatus === "idle" && (activeHand.status === "empty" || permissionIntro) ? <>
          <PalmGuideOverlay side={state.activeSide}/>
          <div className="palm-capture-copy">
            <span>{state.activeSide.toUpperCase()} PALM</span>
            <h3>{permissionIntro ? "카메라 접근 안내" : `${activeLabel} 촬영 준비`}</h3>
            {permissionIntro ? <>
              <p className="palm-permission-copy">손바닥 촬영을 위해 카메라 접근 권한이 필요합니다.<br/>촬영한 이미지는 손금 분석을 위해 사용됩니다.</p>
              <div className="palm-pending-actions">
                <button type="button" className="primary-button" onClick={startCamera}>카메라 시작 <span>→</span></button>
                <button type="button" onClick={chooseFile}>사진 선택</button>
                <button type="button" onClick={() => setPermissionIntro(false)}>취소</button>
              </div>
            </> : <>
              <ol>{PALM_CAPTURE_GUIDE.map((item) => <li key={item}>{item}</li>)}</ol>
              <div className="palm-pending-actions">
                <button type="button" onClick={() => setPermissionIntro(true)}>카메라로 촬영</button>
                <button type="button" onClick={chooseFile}>사진에서 선택</button>
              </div>
            </>}
          </div>
        </> : null}
      </div>

      <aside className="palm-privacy-note">
        <b>사진 사용 안내</b>
        <p>페이지에 들어오는 것만으로 카메라 권한을 요청하지 않습니다. 현재 사진은 이 브라우저 화면에서만 미리보기로 사용하며 서버나 Journal에 저장하지 않습니다.</p>
      </aside>
    </div>

    <div className="step-actions">
      <button type="button" disabled={analyzing} className="secondary-button" onClick={() => leavePalmStep(onBack)}>이전</button>
      <button type="button" disabled={analyzing || imageProcessing || pendingImage !== undefined} className="primary-button" onClick={continuePalmStep}>
        {analyzing ? "PalmResult 생성 중…" : pendingImage !== undefined ? "사진 사용 여부를 확인해 주세요" : readyCount === 0 ? "손금 없이 검토하기" : readyCount === 1 ? "한 손 분석하고 계속" : "두 손 분석하고 계속"} <span>→</span>
      </button>
    </div>
    {analysisError ? <p className="error palm-analysis-error" role="alert">{analysisError}</p> : null}
  </section>;
}
