# 결 — 사주와 타로의 기록

결정론적 TypeScript 사주 계산과 규칙 기반 사주·타로 해석을 제공하는 Next.js 웹 앱입니다.

## 지원 범위

- 양력 1900–2100, `Asia/Seoul`
- 연주·월주·일주·시주, 24절기, 오행 원자료, 십성, 세운
- 78장 타로 덱, 정·역방향, 1장·3장·5장 배열
- 사주·타로 공통/보완/긴장 주제 비교

음력 변환, 신강·신약, 용신·희신, 대운은 방법론 결정 전까지 의도적으로 지원하지 않습니다. 자세한 계산 범위와 한계는 `docs/`를 참고하세요.

## 로컬 실행

Node.js 20.9 이상과 pnpm이 필요합니다.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

브라우저에서 <http://localhost:3000>을 엽니다.

AI 장문 상담을 사용하려면 `.env.local`의 `OPENAI_API_KEY`를 설정해야 합니다. 키가 없어도 사주 계산, 규칙 기반 해석, 타로와 통합 리딩은 정상 작동합니다.

## 배포 전 검증

```bash
pnpm validate
```

이 명령은 TypeScript strict 검사, 전체 테스트, Next.js 프로덕션 빌드를 순서대로 실행합니다.

## Vercel 배포

### GitHub 연결 방식

1. 변경사항을 GitHub 저장소에 푸시합니다.
2. Vercel 대시보드에서 **Add New → Project**를 선택합니다.
3. GitHub의 `fortune` 저장소를 가져옵니다.
4. Framework Preset이 **Next.js**인지 확인합니다.
5. Root Directory는 저장소 루트로 두고 **Deploy**를 선택합니다.

데이터베이스는 필요하지 않습니다. AI 장문 상담을 활성화하려면 Vercel 프로젝트의 Environment Variables에 `OPENAI_API_KEY`를 추가합니다. 모델을 바꾸려면 선택적으로 `OPENAI_MODEL`을 설정할 수 있습니다. `pnpm-lock.yaml`과 `packageManager` 필드로 pnpm 설치가 재현됩니다.

### Vercel CLI 방식

```bash
pnpm add --global vercel
vercel login
vercel
vercel --prod
```

첫 `vercel` 명령은 프로젝트 연결과 미리보기 배포를 만들고, `vercel --prod`는 프로덕션 배포를 만듭니다.

## 구조

- `src/engine/saju`: 결정론적 사주 계산
- `src/engine/tarot`: 타로 덱과 추첨
- `src/interpretation`: 규칙 기반 해석
- `src/application`: 엔진과 UI 사이의 애플리케이션 계층
- `app`: Next.js UI
- `tests`: 계산·해석·자산 매핑 테스트

## 타로 카드 자산

1909년 Rider–Waite–Smith 덱 이미지를 프로젝트 내부에 포함합니다. 출처와 공용 도메인 안내는 `public/tarot-cards/README.md`에 기록되어 있습니다.

## 주의

결과는 엔터테인먼트와 자기성찰을 위한 참고 자료이며 미래를 확정하지 않습니다. 의료·법률·투자 등 중요한 결정을 이 결과만으로 판단하지 마세요.
