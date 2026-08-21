# PWA and Mobile Methodology (Phase 7)

## 설치 구성

앱은 Next.js App Router의 `app/manifest.ts`와 layout metadata를 사용한다.

- 앱 이름: `結 — 나를 읽는 네 가지 시선`
- 짧은 이름: `結`
- 시작 URL과 scope: `/`
- 표시 모드: `standalone`
- theme color: `#102c21`
- background color: `#f4efe4`
- 192px, 512px, maskable 512px, Apple touch icon

아이콘은 `scripts/generate-pwa-icons.ps1`로 재생성할 수 있다. maskable 아이콘의 핵심 문양은 안전 영역 안에 배치한다.

## Service worker

`public/sw.js`는 프로덕션의 보안 컨텍스트에서만 등록한다. localhost는 브라우저가 허용하는 개발용 보안 컨텍스트이며, 실제 배포는 HTTPS가 필요하다.

- 설치 시 오프라인 안내, manifest, PWA 아이콘만 사전 캐시한다.
- 같은 origin의 정적 GET 자산은 runtime cache에 저장한다.
- 페이지 이동은 network-first이며 실패하면 해당 페이지 캐시 또는 `/offline`을 사용한다.
- `/api/` 요청과 GET 이외의 요청은 가로채거나 캐시하지 않는다.
- `sw.js` 자체는 `no-cache, no-store` 헤더를 사용해 업데이트를 막지 않는다.

Journal의 localStorage 데이터와 서비스 워커의 Cache Storage는 서로 분리되어 있다. 서비스 워커는 Journal 레코드를 읽거나 복제하지 않는다.

## 카메라와 설치 모드

카메라는 PWA API가 아니라 `navigator.mediaDevices.getUserMedia()`를 사용한다. 따라서 HTTPS의 일반 Safari, Chrome, Samsung Internet과 설치된 standalone 앱이 같은 Palm 흐름을 사용한다. 페이지 진입 시 권한을 요청하지 않고 사용자가 카메라 시작을 선택한 뒤 요청한다.

보안 헤더는 same-origin 문서의 카메라만 허용하는 `camera=(self)`이며 마이크와 위치는 비활성화한다. 권한 거부와 미지원 환경에서는 기존 파일 선택 fallback을 유지한다.

## 모바일 보정

- viewport `width=device-width`, `initialScale=1`, `viewport-fit=cover`
- standalone의 상·하단 safe-area 반영
- 모바일 입력과 버튼 최소 높이 44px
- `prefers-reduced-motion` 존중
- Palm camera preview와 일반 모바일 웹 흐름 공유

기기별 설치 UI는 브라우저 정책에 따른다. iOS Safari에서는 공유 메뉴의 “홈 화면에 추가”를 사용하며, 지원 브라우저에서만 설치 제안이 표시된다.
