import {
  countReadyPalmHands,
  PALM_SIDE_LABELS,
  type PalmSide,
  type PalmStepState,
} from "../../src/application/palmFlow";
import { PalmGuideOverlay } from "./PalmGuideOverlay";
import { PalmSideSelector } from "./PalmSideSelector";

interface PalmStepProps {
  readonly state: PalmStepState;
  readonly onSelectSide: (side: PalmSide) => void;
  readonly onBack: () => void;
  readonly onContinue: () => void;
}

const PALM_CAPTURE_GUIDE = [
  "손바닥을 카메라 정면으로 향해주세요.",
  "손가락을 자연스럽게 펴고 손 전체를 프레임 안에 넣어주세요.",
  "밝은 곳에서 손금에 초점을 맞추고 강한 그림자와 흔들림을 피해주세요.",
] as const;

export function PalmStep({ state, onSelectSide, onBack, onContinue }: PalmStepProps) {
  const readyCount = countReadyPalmHands(state);
  const activeLabel = PALM_SIDE_LABELS[state.activeSide];

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
      <PalmSideSelector state={state} onSelect={onSelectSide}/>

      <div className="palm-capture-layout">
        <PalmGuideOverlay side={state.activeSide}/>
        <div className="palm-capture-copy">
          <span>{state.activeSide.toUpperCase()} PALM</span>
          <h3>{activeLabel} 촬영 준비</h3>
          <ol>{PALM_CAPTURE_GUIDE.map((item) => <li key={item}>{item}</li>)}</ol>
          <div className="palm-pending-actions" aria-label="다음 단계에서 제공될 사진 입력 방식">
            <button type="button" disabled>카메라로 촬영</button>
            <button type="button" disabled>사진에서 선택</button>
          </div>
          <small>카메라와 사진 선택은 3단계에서 활성화됩니다.</small>
        </div>
      </div>

      <aside className="palm-privacy-note">
        <b>사진 사용 안내</b>
        <p>페이지에 들어오는 것만으로 카메라 권한을 요청하지 않습니다. 촬영한 이미지는 손금 분석에만 사용하고, 장기 저장 여부는 사용자가 선택할 수 있도록 구현할 예정입니다.</p>
      </aside>
    </div>

    <div className="step-actions">
      <button type="button" className="secondary-button" onClick={onBack}>이전</button>
      <button type="button" className="primary-button" onClick={onContinue}>
        {readyCount === 0 ? "손금 없이 검토하기" : "검토로 계속하기"} <span>→</span>
      </button>
    </div>
  </section>;
}
