# Integrated Reading Methodology (Phase 5)

## 역할과 입력 경계

`src/interpretation/integrated`는 이미 생성된 구조화 결과를 하나의 읽기 흐름으로 배열하는 순수 규칙 계층이다. 사주 값을 다시 계산하거나 타로를 다시 뽑지 않으며, 이름 획수나 손바닥 특징을 추정하지 않는다. 입력은 다음으로 제한한다.

- 결정론적 `SajuCoreResult`, `Sewoon`, 규칙 기반 `SajuInterpretation`
- `NameResult`
- 규칙 기반 `TarotSpreadInterpretation`
- 선택적인 `PalmResult`
- 사용자가 입력한 이름, 질문 주제와 질문 문장

생년월일 원문과 손바닥 원본 이미지는 통합 엔진이나 AI 내러티브 요청에 전달하지 않는다.

## 출처 상태와 근거

결과는 각 출처의 상태를 `sourceStatus`로 기록한다.

- 사주·타로: `rule-based`
- 이름: 현재 `personalization-only` 또는 미관찰 mock
- Palm: `not-provided`, `mock-unobserved`, `vision-observed`

현재 Name Engine은 개인화/mock이며 획수·음양·오행을 계산하지 않는다. 현재 Palm Analyzer의 mock은 confidence 0이고 실제 이미지 특징을 관찰하지 않는다. 이 두 결과는 설명과 한계에는 포함되지만, 사주·타로의 공통 주제나 수렴 근거에 합산하지 않는다. Palm 관찰은 `vision` 모드이면서 confidence가 0보다 크고 mock 표시가 없는 구조화 항목만 표시할 수 있다.

## 통합 규칙

공통 주제, 보완 신호, 긴장 신호는 `src/interpretation/combined`의 닫힌 Theme 비교 결과를 재사용한다. 통합 결과는 다음 필드를 제공한다.

- `headline`, `overview`
- `sajuSection`, `nameSection`, `tarotSection`, `palmSection`
- `convergence`, `divergence`, `currentFocus`
- `actionGuide`, `journalPrompt`, `disclaimer`
- `sourceStatus`, Theme `evidence`

동일한 구조화 입력에는 동일한 결과가 나온다. 확률, 길흉 점수, 사건 예측, 숨은 신뢰도를 만들지 않는다.

## 지원 범위와 한계

사주 부분의 날짜 범위·시간대·정밀도는 `docs/saju-methodology.md`의 범위를 그대로 따른다. 통합 계층은 그 범위를 확장하지 않는다. 이름의 정식 성명학 계산과 실제 Palm vision 판독은 아직 지원하지 않는다.

결과는 엔터테인먼트와 자기성찰을 위한 참고 자료이며 의료·법률·투자 결정을 대신하지 않는다.
