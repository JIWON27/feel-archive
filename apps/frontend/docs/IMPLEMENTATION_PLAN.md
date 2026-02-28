# Feel-Archive Implementation Plan

> **문서 버전**: 1.0
> **작성일**: 2026-01-19
> **프로젝트**: Feel-Archive (공간 기반 감정 아카이빙 플랫폼)

---

## 1. 프로젝트 개요

### 1.1 현재 상태
| 항목 | 상태                               |
|------|----------------------------------|
| 프론트엔드 | 정적 HTML 랜딩 페이지만 존재 (Next.js 미구축) |
| 배포 환경 | 미구축 (Vercel 연동 필요)              |

### 1.2 목표
- **기간**: 4주 (평일 1-2시간, 주말 3-5시간)
- **대상 사용자**: 20-30대, 10-100명 소규모

### 1.3 기술 스택
| 영역 | 기술 |
|------|------|
| Frontend | Next.js 14, React Query, Tailwind CSS, Kakao Maps SDK |

---

## 2. 기능 우선순위

### 2.1 필수 (MVP Core)
| 기능 | 사용자 가치 | 기술 하이라이트 |
|------|------------|----------------|
| 이메일 인증 | 개인화된 경험 | 토큰 관리, 인증 상태 유지 |
| Archive CRUD | 감정 기록의 핵심 | React Query, 폼 검증 |
| 위치 기반 조회 | 위치 기반 발견 | GPS API, 현재 위치 활용 |
| 지도 뷰 | 시각적 탐색 | Kakao Maps SDK, 마커 표시 |
| 피드 뷰 | 콘텐츠 소비 | 무한 스크롤, 필터링 |

### 2.2 선택 (Complete Experience)
| 기능 | 사용자 가치 | 기술 하이라이트 |
|------|------------|----------------|
| 좋아요/스크랩 | 참여 및 저장 | 낙관적 UI 업데이트 |
| 타임캡슐 | 미래의 나에게 | 타이머 UI, 알림 표시 |
| 필터/정렬 | 원하는 콘텐츠 찾기 | URL 쿼리 파라미터, 필터 UI |

### 2.3 후순위 (Polish)
| 기능 | 사용자 가치 | 기술 하이라이트 |
|------|------------|----------------|
| 월간 리포트 | 감정 회고 | 차트 시각화 (Chart.js) |

### 2.4 연기 (Post-MVP) — 실제 구현 현황 반영
- ~~이미지 업로드 (S3 연동 복잡성)~~ → ✅ **구현 완료** (AWS S3, 아카이브/타임캡슐 모두)
- 위치 정밀도 상세 설정 → 미구현 (위치 선택 여부 토글로 대체)
- ~~이메일 알림 발송~~ → ✅ **구현 완료** (타임캡슐 공개 시 SMTP 발송, Spring Retry 포함)

---

## 3. Phase별 상세 계획

### Phase 0: Project Setup (Day 1-2)

#### 목표
개발 환경 구축 및 스켈레톤 앱 실행

#### 프론트엔드 구조
```
frontend/
├── package.json
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # 인증 관련 페이지
│   │   ├── (main)/          # 메인 서비스 페이지
│   │   └── layout.tsx
│   ├── components/          # 재사용 컴포넌트
│   ├── hooks/               # 커스텀 훅
│   ├── lib/                 # API 클라이언트, 유틸
│   └── types/               # TypeScript 타입
└── tailwind.config.js
```

#### 완료 조건 (DoD)
- [ ] `npm run dev` 성공
- [ ] Kakao Maps 테스트 페이지에서 지도 렌더링

---

### Phase 1: Authentication & Member Domain (Week 1, Days 1-3)

#### 목표
회원가입/로그인 기능 구현

#### API 명세
| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| POST | /api/auth/signup | { email, password, nickname } | 201 Created |
| POST | /api/auth/login | { email, password } | { accessToken } |
| POST | /api/auth/logout | - | 200 OK |
| GET | /api/members/me | - | { id, email, nickname, ... } |
| PATCH | /api/members/me | { nickname?, profileImageUrl? } | 200 OK |

#### 사용자 플로우
```
[회원가입]
이메일 입력 → 비밀번호 입력 → 닉네임 입력 → 가입 완료 → 로그인 페이지

[로그인]
이메일 입력 → 비밀번호 입력 → JWT 발급 → 홈으로 이동
```

#### 완료 조건 (DoD)
- [ ] 이메일/비밀번호로 회원가입 가능
- [ ] 로그인 시 JWT 토큰 발급
- [ ] 토큰으로 인증된 API 호출 가능
- [ ] 로그아웃 시 클라이언트 토큰 삭제
- [ ] 프론트엔드 인증 상태 유지 (새로고침 후에도)

---

### Phase 2: Archive Core + GIS (Week 1, Days 4-7)

#### 목표
위치 기반 아카이브 생성 및 지도 표시 (핵심 기능)

#### API 명세
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/archives | 아카이브 작성 |
| GET | /api/archives | 목록 조회 (페이징, 필터, 정렬) |
| GET | /api/archives/{id} | 상세 조회 |
| PATCH | /api/archives/{id} | 수정 |
| DELETE | /api/archives/{id} | 삭제 (Soft Delete) |
| GET | /api/archives/map | 지도 마커 조회 (bounds 파라미터) |
| GET | /api/archives/nearby | 반경 내 조회 (lat, lng, radius 파라미터) |

#### 화면 구성
1. **아카이브 작성 페이지**
   - 위치 선택 (현재 위치 GPS / 지도에서 선택)
   - 감정 태그 복수 선택
   - 텍스트 입력 (2000자 이상)
   - 공개/비공개 선택

2. **탐색 - 지도 뷰**
   - Kakao Maps 전체 화면
   - 마커 클릭 시 미리보기 카드
   - 감정별 마커 색상 구분

3. **탐색 - 피드 뷰**
   - 카드 형태 리스트
   - 무한 스크롤
   - 필터 (감정, 거리, 시간)

#### 완료 조건 (DoD)
- [ ] 아카이브 작성 페이지에서 위치 선택 가능 (GPS / 지도 선택)
- [ ] 감정 태그 선택 UI 동작
- [ ] 아카이브 생성 후 목록에 표시
- [ ] Kakao Maps에 마커 표시
- [ ] 마커 클릭 시 미리보기 표시
- [ ] 피드 뷰 무한 스크롤 동작

---

### Phase 3: Interactions + TimeCapsule (Week 2)

#### 목표
좋아요/스크랩 기능 및 타임캡슐

#### API 명세
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/archives/{id}/like | 좋아요 토글 |
| POST | /api/archives/{id}/scrap | 스크랩 토글 |
| GET | /api/members/me/scraps | 내 스크랩 목록 |
| POST | /api/timecapsules | 타임캡슐 작성 |
| GET | /api/timecapsules | 내 타임캡슐 목록 |
| GET | /api/timecapsules/{id} | 타임캡슐 상세 |
| PATCH | /api/timecapsules/{id} | 타임캡슐 수정 (30분 내) |
| GET | /api/notifications | 알림 목록 |
| PATCH | /api/notifications/{id}/read | 알림 읽음 처리 |

#### 비즈니스 규칙
1. **타임캡슐 30분 규칙**
   - 작성 후 30분 이내만 수정 가능
   - 30분 경과 후 수정/삭제 버튼 비활성화

2. **타임캡슐 공개**
   - 예정 시간 도달 시 자동 공개
   - 공개 시 알림 표시

#### 완료 조건 (DoD)
- [ ] 좋아요 버튼 클릭 시 UI 즉시 업데이트 (낙관적 업데이트)
- [ ] 스크랩 목록 페이지에서 조회 가능
- [ ] 타임캡슐 작성 후 30분 경과 시 수정 버튼 비활성화 표시
- [ ] 타임캡슐 공개 시 알림 아이콘 표시
- [ ] 알림 목록 조회 및 읽음 처리 UI

---

### Phase 4: Report + Polish (Week 3)

#### 목표
월간 리포트 및 UI/UX 개선

#### API 명세
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/monthly | 월간 리포트 (year, month 파라미터) |
| GET | /api/reports/emotions | 감정 분포 통계 |

#### UI 개선 항목
- [ ] 로딩 상태 (Skeleton UI)
- [ ] 에러 상태 (Toast 알림)
- [ ] 빈 상태 ("기록이 없습니다" 메시지)
- [ ] 모바일 반응형
- [ ] 접근성 (키보드 네비게이션, ARIA)

#### 완료 조건 (DoD)
- [ ] 월간 감정 분포 바 차트 표시
- [ ] 일별 감정 흐름 라인 차트 표시
- [ ] 모든 페이지 로딩/에러/빈 상태 처리
- [ ] 모바일 화면에서 사용 가능

---

### Phase 5: Infrastructure + Deployment (Week 4) ✅ 완료

#### 구축된 인프라 (실제 현황)

**프론트엔드 (Vercel)**
- Vercel 자동 배포 완료 (2026-02-23)
- `next.config.mjs`: `NEXT_PUBLIC_API_URL` 환경변수로 API 리버스 프록시 설정
  - 개발: `http://localhost:8080/api/*`
  - 프로덕션: EC2 백엔드 URL로 프록시
- 환경 변수: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_KAKAO_APP_KEY`

**백엔드 (AWS)**
- **CI**: GitHub → AWS CodeBuild (`buildspec.yml`)
  - Gradle 빌드 (`:api:bootJar -x test`)
  - Docker 이미지 빌드 & ECR push (`feel-archive:latest`, `feel-archive:{git-sha7}`)
- **CD**: AWS CodeDeploy (`appspec.yml` + `scripts/deploy.sh`)
  - EC2 인스턴스에서 SSM Parameter Store에서 환경변수 조회
  - ECR에서 이미지 pull 후 Docker 컨테이너 실행 (포트 8080)
  - Docker 네트워크: `feel-archive-net`
- **이미지 저장**: AWS S3 (`S3_BUCKET` SSM 파라미터)
- **시크릿**: AWS SSM Parameter Store (DB_URL, JWT_SECRET, MAIL 등)
- **캐시/세션**: Redis (REDIS_HOST, REDIS_PORT — ElastiCache 또는 EC2 내)

#### SSM Parameter Store 관리 항목
| 파라미터 | 설명 |
|---------|------|
| `DB_URL` | MySQL 연결 URL |
| `DB_USERNAME` / `DB_PASSWORD` | DB 자격증명 |
| `REDIS_HOST` / `REDIS_PORT` | Redis 연결 |
| `JWT_SECRET` | JWT 서명 키 |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | SMTP 메일 발송 |
| `KAKAO_REST_API_KEY` | 카카오 역지오코딩 API 키 |
| `APP_SERVER_URL` | 백엔드 서버 URL |
| `APP_CLIENT_URL` | 프론트엔드 클라이언트 URL |
| `S3_BUCKET` | S3 버킷명 |
| `BATCH_SIZE` | 배치 처리 크기 |

#### 완료 조건 (DoD) — 모두 달성
- [x] Vercel 자동 배포 연동
- [x] main 브랜치 push 시 프로덕션 배포
- [x] HTTPS 적용 (Vercel 자동 제공)
- [x] 환경 변수 설정 완료
- [x] 백엔드 CodeBuild → ECR → CodeDeploy 파이프라인
- [x] AWS SSM Parameter Store 시크릿 관리

---

## 4. 리스크 및 대응

| 리스크 | 영향도 | 대응 전략 |
|--------|--------|----------|
| 4주 내 미완성 | 높음 | Phase 2 (지도/피드 뷰) = 최소 MVP, 이후는 선택적 |
| 오버엔지니어링 | 중간 | 단순 구현 먼저, 필요 시 리팩토링 |
| Kakao Maps 제한 | 낮음 | Week 1 프로토타입으로 조기 검증 |
| API 응답 지연 | 중간 | 로딩 상태 UI, 낙관적 업데이트 활용 |

---

## 5. 복구 정보 (Recovery Info)

### 현재 기준점 (Baseline) — v1.0.0 기준 (2026-03-01)
- **마지막 정상 상태**: 마이페이지 기능 구현 완료 (develop 브랜치)
- **Git commit**: `feat(mypage): 마이페이지 기능 구현 및 API 문서 수정`
- **Branch**: `develop` (main 머지 예정)
- **확인 방법**:
  - `npm run dev` 실행 (Port 3000)
  - 로그인 → 홈 화면에서 지도 + 아카이브 목록 표시 확인
  - `/my/profile` 에서 프로필 조회, 비밀번호 변경, 이메일 알림 설정, 탈퇴 확인

### 구현 완료 기능 (v1.0.0)
| 기능 | 상태 | 주요 페이지 |
|------|------|------------|
| 인증 (로그인/회원가입/로그아웃) | ✅ 완료 | `/login`, `/signup` |
| 아카이브 CRUD + 이미지 | ✅ 완료 | `/archives`, `/archives/new`, `/archives/[id]` |
| 아카이브 수정 (지연연결 이미지) | ✅ 완료 | `/archives/[id]/edit` |
| 좋아요/스크랩 | ✅ 완료 | 아카이브 카드/상세 |
| 지도 (Kakao Maps) | ✅ 완료 | `/` (홈) |
| 주변 아카이브 조회 (GIS) | ✅ 완료 | `/` (홈) |
| 타임캡슐 CRUD + 이미지 | ✅ 완료 | `/timecapsule/new`, `/timecapsule/[id]` |
| 알림 (SSE + 목록) | ✅ 완료 | `/notifications` |
| 마이페이지 (프로필 + 설정) | ✅ 완료 | `/my/profile` |
| 내 아카이브/스크랩/타임캡슐 | ✅ 완료 | `/my/archives`, `/my/scraps`, `/my/timecapsules` |
| 감정 날씨 Ticker | ✅ 완료 | 헤더 (전역) |

### 미구현 기능 (Post-1.0.0)
| 기능 | 태스크 ID | 우선순위 |
|------|----------|---------|
| 월간 리포트 차트 | #18 | 중간 |
| 모바일 반응형 | #20 | 높음 |
| 404 에러 페이지 | #36 | 낮음 |
| 프로필 수정 | #34 | 중간 |
| 접근성 개선 | #38 | 낮음 |
| CI/CD 파이프라인 | #21 | 높음 |
| Vercel 배포 | #22 | 높음 |

### 되돌림 전략
1. **Git 브랜치 전략**: develop 브랜치에서 개발, main은 배포 가능 상태
2. **Vercel Rollback**: 배포 후 이전 버전으로 즉시 롤백 가능

### 롤백 포인트
| Checkpoint | 설명 | Git 브랜치/커밋 |
|------------|------|----------------|
| task 32 완료 | 주변 아카이브 + 위치 마커 (2026-02-13) | feature 브랜치 |
| task 46 완료 | 아카이브 수정 지연연결 이미지 (2026-02-19) | feature 브랜치 |
| task 45 완료 | 감정 날씨 Ticker (2026-02-18) | feature 브랜치 |
| task 56 완료 | 마이페이지 + 무한스크롤 수정 (2026-02-27) | develop 브랜치 |

---

## 6. 검증 계획

### 컴포넌트 테스트
- React Query 훅: 데이터 페칭 및 캐싱 동작
- UI 컴포넌트: 버튼, 폼, 카드 등 렌더링 확인

### E2E 검증
| 시나리오 | 검증 방법 |
|----------|----------|
| 회원가입/로그인 | 브라우저에서 전체 플로우 수행 |
| 아카이브 작성 | 위치 선택 → 감정 태그 → 저장 → 지도에 표시 확인 |
| 주변 아카이브 조회 | 현재 위치 기반 목록 및 지도 마커 표시 확인 |
| 타임캡슐 | 작성 → 30분 경과 후 수정 버튼 비활성화 확인 |
| 배포 | Vercel 프리뷰 및 프로덕션 배포 확인 |

---

## 부록: 참고 문서

- **SPEC.md**: 전체 요구사항 정의서
- **TASK_LIST.json**: 상세 작업 목록
- **index.html**: 디자인 참조 (색상: #D19D5E, 폰트, 레이아웃)
