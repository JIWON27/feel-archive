# Feel-Archive 프론트엔드 라우팅 문서

> **작성일**: 2026-01-26
> **최종 업데이트**: 2026-03-01 (v1.0.0 기준)
> **프레임워크**: Next.js 14 (App Router)

---

## 📋 라우팅 개요

Feel-Archive는 Next.js 14의 App Router를 사용하며, Route Groups를 통해 인증/메인 페이지를 구분합니다.

---

## 🔐 인증 관련 페이지 (Auth Route Group)

### `(auth)` 라우트 그룹
- **레이아웃**: 로그인된 사용자는 자동으로 홈(`/`)으로 리다이렉트
- **스타일**: 중앙 정렬, 배경 gray-50

| URL | 페이지 | 설명 | 인증 필요 |
|-----|--------|------|----------|
| `/login` | 로그인 | 이메일/비밀번호 로그인 | ❌ |
| `/signup` | 회원가입 | 신규 계정 생성 (전체 필드) | ❌ |

---

## 🏠 메인 서비스 페이지 (Main Route Group)

### `(main)` 라우트 그룹
- **레이아웃**: Protected Route - 미인증 사용자는 자동으로 로그인 페이지로 리다이렉트
- **헤더**: 전역 헤더 (`Header.tsx`) 포함 — 로고, 감정날씨 ticker, 알림벨, 유저메뉴
- **스타일**: `pt-14` (헤더 고정 offset)

---

## 📍 홈 & 탐색

| URL | 페이지 | 설명 | 주요 기능 |
|-----|--------|------|----------|
| `/` | 홈 (메인) | WhatsApp 스타일 2단 레이아웃 | • 왼쪽: 아카이브 리스트 (무한스크롤)<br>• 오른쪽: Kakao Maps<br>• 현재 위치 GPS 자동 감지 (기본: 용산 ITX역)<br>• 주변 50km 내 아카이브 우선 표시<br>• 마커 클릭 시 미리보기 카드 |

### 홈 페이지 구성
- **왼쪽 사이드바 (400-450px)**:
  - 현재 위치 표시
  - 아카이브 리스트 (무한 스크롤)

- **오른쪽 지도 (나머지 공간)**:
  - Kakao Maps
  - 감정별 색상 마커 (GIS 정보 있는 아카이브만)
  - 마커 클릭 시 상단 미리보기 카드
  - 현재 위치 파란색 마커 (Google Maps 스타일)
  - 리스트 클릭 시 지도 해당 위치로 panTo

---

## 📝 아카이브 관리

### 기본 CRUD

| URL | 페이지 | 설명 | 인증 필요 |
|-----|--------|------|----------|
| `/archives` | 아카이브 목록 | 전체 공개 아카이브 목록 | ✅ |
| `/archives/new` | 아카이브 작성 | 새 아카이브 작성 폼 | ✅ |
| `/archives/[id]` | 아카이브 상세 | 상세 내용, 좋아요/스크랩 | ✅ |
| `/archives/[id]/edit` | 아카이브 수정 | 수정 폼 (본인만) | ✅ |

### `/archives` - 목록 페이지
**기능**:
- 무한 스크롤 (React Query `useInfiniteQuery`)
- 감정별 필터링 (전체, 행복, 슬픔, 불안함, 화난, 차분한, 신난, 외로운, 감사한, 지친)
- 정렬: 최신순(`LATEST`), 오래된순(`OLDEST`), 인기순(`POPULAR`), 좋아요순(`LIKE`)
- 키워드 검색
- 카드 형식 표시 (2열 그리드)

### `/archives/new` - 작성 페이지
**입력 필드**:
- 감정 태그: **단일 선택** (9가지 감정 중 1개 필수)
- 내용: 텍스트 입력 (최대 5000자)
- 위치: **선택사항** — 위치 공유 토글로 ON/OFF 가능, ON 시 Kakao Maps에서 선택
- 이미지: 최대 5개, 파일당 5MB, 전체 20MB
- 공개 설정: 공개/비공개 선택

**기능**:
- 현재 위치 GPS 자동 가져오기
- 지도 클릭으로 위치 선택
- 역지오코딩 자동 주소 → 사용자 메모 우선 적용
- 실시간 유효성 검사 (Zod)

### `/archives/[id]` - 상세 페이지
**표시 정보**:
- 감정 태그 (단일)
- 전체 내용
- 이미지 갤러리 (JWT 인증 fetch로 표시 — `AuthImage`)
- 위치 정보 (있는 경우)
- 작성자, 작성일, 수정일
- 좋아요 개수 및 버튼
- 스크랩 버튼
- `···` 케밥 메뉴 (본인 글만: 수정, 삭제)

**기능**:
- 좋아요 토글
- 스크랩 토글
- 수정 페이지로 이동
- 삭제 확인 모달

### `/archives/[id]/edit` - 수정 페이지
**권한**: 본인이 작성한 글만 접근 가능 (`isOwner` 체크)
**기능**:
- 기존 데이터 로드
- 이미지 지연 연결 방식 — 수정 완료 시 신규 이미지 업로드 후 imageIds 일괄 반영
- 기존 이미지 유지/삭제, 신규 이미지 추가 분리 관리 (`EditImageUploader`)

---

## 🎯 타임캡슐

| URL | 페이지 | 설명 | 인증 필요 |
|-----|--------|------|----------|
| `/timecapsule/new` | 타임캡슐 작성 | 새 타임캡슐 작성 폼 | ✅ |
| `/timecapsule/[id]` | 타임캡슐 상세 | 잠금/열림 상태별 UI | ✅ |

### `/timecapsule/new` - 작성 페이지
**입력 필드**:
- 감정 태그: 단일 선택 (9가지)
- 내용: 텍스트 입력 (최대 5000자)
- 공개 일시: datetime 선택 (최소 1시간 후)
- 위치: 선택사항
- 이미지: 최대 5개

### `/timecapsule/[id]` - 상세 페이지
**잠금 상태 (`LOCKED`)**:
- 봉인 다크 UI
- 카운트다운 (일/시간/분)
- 수정/삭제 버튼 (작성 후 30분 이내 + LOCKED 상태만)

**열림 상태 (`OPENED`)**:
- 감정 배너 + 전체 내용
- 이미지 갤러리 (`AuthImage`)
- 위치 정보 (있는 경우)

---

## 👤 마이페이지

| URL | 페이지 | 설명 | 인증 필요 |
|-----|--------|------|----------|
| `/my/profile` | 마이페이지 | 프로필 + 계정 설정 통합 | ✅ |
| `/my/archives` | 내 아카이브 | 내가 쓴 글 (공개+비공개) | ✅ |
| `/my/scraps` | 스크랩 목록 | 스크랩한 아카이브 | ✅ |
| `/my/timecapsules` | 내 타임캡슐 | 타임캡슐 목록 (잠금/열림 분리) | ✅ |

### `/my/profile` - 마이페이지
**표시 내용**:
- 프로필 정보: 닉네임, 이메일, 가입일 등 (`GET /api/v1/users/me`)
- 비밀번호 변경 (`PATCH /api/v1/users/me/password`)
- 이메일 알림 토글 (`PATCH /api/v1/users/me/settings/email-notification`)
- 로그아웃 (확인 모달)
- 회원탈퇴 (확인 모달 + 비밀번호 입력)

### `/my/archives` - 내 아카이브
**표시 내용**:
- 공개 + 비공개 글 모두 표시
- 감정 이모지 칩 필터 (가로 스크롤)
- 정렬 드롭다운 (LATEST/OLDEST/POPULAR/LIKE)
- 키워드 검색 토글
- 무한 스크롤, 총 개수 표시

### `/my/scraps` - 스크랩 목록
**표시 내용**:
- 스크랩한 아카이브 목록
- 무한 스크롤
- 스크랩 해제 버튼
- 빈 상태 처리

### `/my/timecapsules` - 내 타임캡슐
**표시 내용**:
- 잠금 상태 섹션: 봉인 UI + 카운트다운
- 열림 상태 섹션: 감정 이모지 + 내용 미리보기 + 확인 링크
- 무한 스크롤

---

## 🔔 알림

| URL | 페이지 | 설명 | 인증 필요 |
|-----|--------|------|----------|
| `/notifications` | 알림 목록 | 전체 알림 (무한 스크롤) | ✅ |

### `/notifications` - 알림 목록
**표시 내용**:
- 읽음/읽지않음 알림 목록
- 무한 스크롤
- 개별 읽음 처리
- 전체 읽음 처리 버튼

---

## 🎯 동적 라우팅 파라미터

### `[id]` - 아카이브 ID
- **타입**: `number`
- **예시**: `/archives/123`, `/timecapsule/456`

---

## 🔄 리다이렉트 규칙

### 인증 상태에 따른 리다이렉트

| 현재 위치 | 인증 상태 | 리다이렉트 |
|----------|----------|-----------|
| `/login` 또는 `/signup` | 로그인됨 | → `/` |
| `(main)` 그룹 전체 | 미인증 | → `/login` |
| `/archives/[id]/edit` | 본인 글 아님 | → `/archives/[id]` |

### 로그인 후 동작
1. 로그인 성공 → `/` (홈)
2. 회원가입 성공 → `/login`

### 글 작성/수정 후 동작
1. 아카이브 작성 성공 → `/archives/[생성된 ID]`
2. 아카이브 수정 성공 → `/archives/[ID]`
3. 아카이브 삭제 성공 → `/archives`
4. 타임캡슐 작성 성공 → `/my/timecapsules`

---

## 🗺️ 네비게이션 구조

```
Feel-Archive
│
├─ 인증 (비로그인)
│  ├─ /login
│  └─ /signup
│
└─ 메인 (로그인 필요)
   │
   ├─ 홈 & 탐색
   │  └─ / (메인 홈 - 지도 + 리스트)
   │
   ├─ 아카이브
   │  ├─ /archives (목록)
   │  ├─ /archives/new (작성)
   │  └─ /archives/[id]
   │     ├─ (상세)
   │     └─ /edit (수정)
   │
   ├─ 타임캡슐
   │  ├─ /timecapsule/new (작성)
   │  └─ /timecapsule/[id] (상세)
   │
   ├─ 마이페이지
   │  ├─ /my/profile (프로필 + 설정)
   │  ├─ /my/archives (내 글)
   │  ├─ /my/scraps (스크랩)
   │  └─ /my/timecapsules (내 타임캡슐)
   │
   └─ 알림
      └─ /notifications (알림 목록)
```

---

## 📱 반응형 라우팅

### 데스크톱 (md 이상)
- 홈: 2단 레이아웃 (사이드바 + 지도)
- 목록: 2열 그리드

### 모바일 (md 미만)
- 홈: 사이드바 전체 화면 (지도는 숨김)
- 목록: 1열 그리드

---

## 🔒 Protected Routes 구현

### 구현 방법
- **훅**: `useProtectedRoute()`, `usePublicOnlyRoute()`
- **위치**: Layout 레벨에서 체크
- **메커니즘**:
  1. `localStorage`에서 `accessToken` 확인
  2. Zustand `useAuthStore`의 `isAuthenticated` 상태 확인
  3. 미인증 시 `router.replace('/login')`

### Layout별 보호
- **`(auth)/layout.tsx`**: 로그인 사용자 리다이렉트
- **`(main)/layout.tsx`**: 미인증 사용자 리다이렉트

---

## 🎨 페이지별 스타일

### 홈 (`/`)
- **레이아웃**: Flexbox 2단
- **높이**: `h-screen` (전체 화면)
- **스크롤**: 왼쪽만 스크롤, 오른쪽 고정

### 목록 (`/archives`)
- **레이아웃**: 그리드 (2열)
- **배경**: gray-50

### 상세 (`/archives/[id]`)
- **레이아웃**: 단일 컬럼 (max-w-4xl)
- **배경**: gray-50
- **카드**: 흰색 배경, shadow

### 작성/수정 (`/archives/new`, `/archives/[id]/edit`)
- **레이아웃**: 단일 컬럼 (max-w-3xl)
- **폼**: 흰색 배경, shadow, p-6

---

## 🔗 주요 네비게이션 링크

### 헤더 (구현 완료)
- 로고 → `/`
- 감정 날씨 Ticker (5분 폴링, 슬라이드업 애니메이션)
- 알림벨 → 드롭다운 / `/notifications`
- 글쓰기 버튼 → `/archives/new`
- 타임캡슐 버튼 → `/timecapsule/new`
- 유저메뉴 → `/my/profile`, 로그아웃

---

## 📊 데이터 로딩 전략

### SSR vs CSR
- **모든 페이지**: CSR (Client-Side Rendering, `'use client'`)
- **이유**: 인증 필요, 실시간 데이터

### React Query 활용
- **목록 페이지**: `useInfiniteQuery` (무한 스크롤)
- **상세 페이지**: `useQuery` (단일 데이터)
- **작성/수정**: `useMutation` (데이터 변경)

### 페이지네이션 방식
- **아카이브/타임캡슐**: 1-based (`pageNo` 필드, `setOneIndexedParameters(true)`)
- **알림**: 0-based (Spring Page 표준, `number` 필드)

### 이미지 표시
- **AuthImage 컴포넌트**: JWT 토큰이 필요한 이미지를 Axios로 fetch 후 Blob URL 변환
- **사용처**: 아카이브 상세, 타임캡슐 상세, 수정 페이지

---

## 📝 URL 쿼리 파라미터

### `/archives` - 필터링
```
/archives?emotion=HAPPY&sortType=LATEST&keyword=서울
```
- `emotion`: 감정 필터 (HAPPY, SAD, ANXIOUS, ANGRY, CALM, EXCITED, LONELY, GRATEFUL, TIRED)
- `sortType`: 정렬 (LATEST, OLDEST, POPULAR, LIKE)
- `keyword`: 내용 검색어
- `page`, `size`: 페이지네이션 (1-based)

---

## 🚀 미구현 / 향후 예정 라우트

| URL | 기능 | 상태 |
|-----|------|------|
| `/my/profile/edit` | 프로필 수정 (닉네임, 프로필 사진) | 미구현 |
| `/my/report` | 월간 감정 리포트 (차트) | 미구현 |

---

**참고**:
- 모든 라우트는 인증 시스템 통합
- JWT 토큰 기반 인증 (Access Token: localStorage, Refresh Token: HttpOnly Cookie)
- 401 에러 시 자동 토큰 갱신 (Axios interceptor)
- 갱신 실패 시 로그아웃 및 로그인 페이지 이동
