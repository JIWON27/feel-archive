# Feel-Archive Frontend

공간 기반 감정 아카이빙 플랫폼의 프론트엔드 프로젝트입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (@tanstack/react-query)
- **Maps**: Kakao Maps JavaScript SDK

## 프로젝트 구조

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (main)/            # 메인 서비스 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   └── globals.css        # 전역 스타일
├── components/            # 재사용 컴포넌트
├── hooks/                 # 커스텀 훅
├── lib/                   # 유틸리티 및 설정
│   ├── api.ts            # API 클라이언트
│   └── providers.tsx     # React Query Provider
├── types/                 # TypeScript 타입 정의
└── package.json
```

## 시작하기

### 1. 환경 변수 설정

`.env.local.example` 파일을 복사하여 `.env.local` 파일을 생성하고 필요한 값을 설정하세요.

```bash
cp .env.local.example .env.local
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 [http://localhost:3001](http://localhost:3001)에서 실행됩니다.

## 빌드

```bash
npm run build
```

## 환경 변수

- `NEXT_PUBLIC_API_URL`: 백엔드 API URL (기본값: http://localhost:8080)
- `NEXT_PUBLIC_KAKAO_APP_KEY`: Kakao Maps JavaScript API 키

## 관련 문서

- [SPEC.md](../../docs/SPEC.md) - 서비스 기획 스펙
- [IMPLEMENTATION_PLAN.md](../../docs/IMPLEMENTATION_PLAN.md) - 구현 계획
