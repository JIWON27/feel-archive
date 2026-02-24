# Feel-Archive 서비스 기획 스펙 문서

> **문서 버전**: 1.0
> **작성일**: 2026-02-24
> **서비스명**: 미확정 (가칭: Feel-Archive)

---

## 1. 프로젝트 개요

### 1.1 서비스 정의
**공간 기반 감정 아카이빙 플랫폼**

사용자의 감정을 특정 장소와 연결하여 기록하고, 다른 사람들의 경험을 발견할 수 있는 웹 서비스입니다.

### 1.2 프로젝트 목적
- **목적**: Java/Spring 기반 회사 이직을 위한 사이드 프로젝트
- **주요 어필 포인트**:
  - GIS 공간 쿼리 (모빌리티 도메인 연관성)
  - DDD 아키텍처
  - 이벤트 기반 시스템
  - 테스트 커버리지
  - CI/CD 파이프라인

### 1.3 타겟 사용자
- **연령대**: 20-30대 전체
- **예상 규모**: 극소규모 (10-100명)
- **사용 맥락**: 일기/기록 문화에 관심 있는 세대

### 1.4 일정
- **목표 기간**: 4주
- **투입 시간**: 평일 1-2시간, 주말 3-5시간

---

## 2. 핵심 기능

### 2.1 감정 아카이브 (Archive)

#### 감정 태그 시스템
- **선택 방식**: 미리 정의된 태그 중 **단일 선택**
- **감정 목록** (한국어 감정 단어 중심):
  - 행복
  - 슬픔
  - 불안함
  - 화난
  - 차분한
  - 신난
  - 외로운
  - 감사한
  - 평온
  - 설렘
  - 그리움
  - *(추가 검토 가능)*

#### 장소 기록
- **정밀도**: 사용자가 직접 선택 (동네 수준 ~ 구체적 스팟)
- **기록 방식**:
  - 현장 기록 (GPS 기반)
  - 회상 기록 (지도 검색으로 장소 선택)
- **위치 메모 (locationLabel)**:
  - 역지오코딩(Kakao Maps)으로 자동 주소가 기본값으로 제공됨
  - 사용자가 직접 입력한 메모가 우선 적용됨 (미입력 시 역지오코딩 주소 사용)
- **위치 노출 수준**: 공개 글 작성 시 노출 수준 선택 가능

#### 게시글 구성
| 항목 | 설명 |
|------|------|
| 감정 태그 | 단일 선택 필수 |
| 장소 | 선택 (위치 공유 토글로 공유 여부 선택, 공유 시 정밀도 선택 가능) |
| 텍스트 | 긴 글 허용 (2000자 이상, 최대 5000자) |
| 사진 | 선택적 첨부 (최대 5개, 파일당 5MB, 전체 20MB) |
| 공개 설정 | 작성 시 필수 선택 (공개/비공개) |

#### 수정/삭제 정책
- **아카이브 글**: 자유롭게 수정/삭제 가능
- **이미지 수정**: 지연 연결 방식 - 수정 완료 시 신규 이미지를 먼저 업로드 후 최종 imageIds 목록(기존 유지 + 신규 추가)을 PATCH 요청에 포함하여 일괄 반영. 수정 취소 시 아직 연결되지 않은 이미지는 서버에 남지 않음.
- **삭제 방식**: Soft Delete (배치로 정리)

---

### 2.2 탐색 기능 (Explore)

#### 탐색 뷰
- **지도 뷰**: Kakao Maps 기반, 마커로 위치 표시
- **피드 뷰**: SNS 스타일 스크롤 피드
- **뷰 전환**: 두 뷰 간 자유롭게 전환 가능

#### 홈페이지 레이아웃 (WhatsApp 스타일)
- **2단 레이아웃 구조**:
  - 왼쪽: 아카이브 리스트 (400-450px 고정폭)
  - 오른쪽: Kakao Maps (나머지 공간)
- **현재 위치**: GPS 자동 감지하여 지도 중심에 표시
- **리스트-지도 양방향 동기화**:
  - 리스트에서 아카이브 클릭 → 지도가 해당 위치로 부드럽게 이동 (panTo)
  - 지도 마커 클릭 → 리스트에서 해당 아카이브로 스크롤
- **아카이브 미리보기**: 선택된 아카이브는 지도 상단에 요약 카드 표시
- **상세 보기**: 아카이브 더블클릭 또는 미리보기 카드의 "자세히 보기" 버튼으로 이동

#### 위치 권한 처리
- **권한 요청**: 페이지 로드 시 자동으로 Geolocation API 호출
- **권한 허용 시**:
  - 현재 GPS 위치로 지도 중심 설정
  - 반경 50km 내 주변 아카이브 우선 조회
  - 캐시 허용: 1분 이내 위치 정보 재사용 (maximumAge: 60000ms)
- **권한 거부 시**:
  - 5초 타임아웃 후 기본 위치로 자동 폴백
  - 기본 위치: 용산 ITX역 (위도 37.5292, 경도 126.9642)
  - 전체 아카이브 목록 표시
- **현재 위치 표시**:
  - Google Maps 스타일 파란색 원형 마커
  - 외곽 반투명 원 (정확도 범위 표시) + 중앙 파란색 점
  - zIndex 100으로 다른 마커보다 위에 표시

#### 주변 아카이브 우선 표시
- **조회 방식**: 현재 위치 기반 반경 50km 내 아카이브 자동 조회
- **폴백 로직**: 주변 아카이브가 없으면 전체 목록으로 자동 전환
- **API**: `GET /api/v1/archives/nearby?latitude={lat}&longitude={lng}&radius={km}`

#### 지도 마커 시스템
- **마커 표시**: GIS 정보(latitude, longitude)가 있는 아카이브만 표시
- **감정별 색상**: 각 감정에 따라 다른 색상의 원형 마커
- **감정 이모지**: 마커 중앙에 감정을 나타내는 이모지 표시
- **선택 상태**: 선택된 마커는 크기 1.2배 확대 (scale)
- **마커 스타일**: 흰색 테두리, 그림자 효과로 입체감 부여

#### 필터/정렬 옵션
- 감정별 필터
- 시간순 정렬 (최신순/오래된순)
- 거리순 정렬 (현재 위치 기준)
- 인기순 정렬 (좋아요 수 기준)

#### 사용자 상호작용
| 기능 | 설명 |
|------|------|
| 좋아요 | 공감 표시 |
| 스크랩 | 본인 컬렉션에 저장 |
| 댓글 | **미지원** |
| 팔로우 | **미지원** (콘텐츠 중심) |

---

### 2.3 타임캡슐 (Time Capsule)

#### 기능 설명
미래의 자신에게 보내는 감정 기록. 설정한 시간이 지나면 자동으로 열람 가능.

#### 상세 규칙
| 항목 | 설명 |
|------|------|
| 공개 대상 | **자신에게만** (커뮤니티 공개 불가) |
| 공개 시점 | 날짜 및 시간 직접 선택 (1시간 단위) |
| 수정 가능 기간 | 작성 후 **30분 이내**만 수정 가능 |
| 30분 이후 | 완전 잠금 (수정/삭제 불가) |
| 알림 | 타임캡슐 공개 시 알림 발송 |

---

### 2.4 월간 리포트 (Report)

#### 기능 설명
사용자의 감정 기록을 시각화하여 통계 정보 제공.

#### 제공 내용
- 월간 감정 흐름 그래프 (라인 차트)
- 감정별 분포 (바 차트/파이 차트)
- 기록 빈도 통계

#### 특징
- **분석 수준**: 단순 통계/시각화 (AI 인사이트 없음)
- **접근 방식**: 마이페이지에서 실시간 확인 가능
- **이메일 발송**: 미지원

---

### 2.5 알림 조회 및 관리 (Notification Management)

#### 기능 설명
사용자가 읽지 않은 알림을 한눈에 확인하고 관리할 수 있으며, 타임캡슐 공개 알림을 받아 놓치지 않을 수 있도록 합니다.

#### 주요 시나리오
1. **알림 목록 조회**
   - 사용자 행동: 알림 아이콘 클릭
   - 시스템 동작: 읽지 않은 알림을 최신순으로 표시
   - 결과: 읽지 않은 알림 개수 뱃지 표시

2. **개별 알림 읽음 처리**
   - 사용자 행동: 특정 알림 클릭
   - 시스템 동작: 해당 알림을 읽음 상태로 변경 (isRead: true, readAt: 현재 시각)
   - 결과: 연결된 리소스로 이동 (예: 타임캡슐 상세 페이지)

3. **전체 알림 읽음 처리**
   - 사용자 행동: "모두 읽음" 버튼 클릭
   - 시스템 동작: 모든 읽지 않은 알림을 읽음 상태로 일괄 변경
   - 결과: 모든 알림이 읽음 상태로 표시

#### 상세 규칙
| 항목 | 설명 |
|------|------|
| 페이지 크기 | 20개 (기본값) |
| 정렬 순서 | 최신순 (createdAt DESC) |
| 필터링 | isRead 파라미터로 읽음/안읽음 필터 가능 |
| 삭제 기능 | 미지원 (읽음 처리만) |
| 보관 기간 | 무제한 |
| UI 방식 | 무한 스크롤 페이지네이션 |

---

### 2.6 타임캡슐 알림 이메일 발송 (Time Capsule Email Notification)

#### 기능 설명
사용자가 웹사이트를 방문하지 않아도 타임캡슐 공개 시점에 이메일 알림을 받아 소중한 과거의 기록을 놓치지 않고 확인할 수 있습니다.

#### 주요 시나리오
1. **타임캡슐 공개 시점 도래**
   - 사용자 행동: 없음 (자동 처리)
   - 시스템 동작: Spring 스케줄러(`@Scheduled`, 매분 실행)가 `openAt` 시각이 현재 시각 이전인 타임캡슐을 조회하여 배치 처리, 공개 처리 후 `TimeCapsuleOpenedEvent` 발행
   - 결과: 타임캡슐 공개 이벤트 생성

2. **알림 생성 및 이메일 발송 (비동기)**
   - 사용자 행동: 없음 (자동 처리)
   - 시스템 동작:
     - `@TransactionalEventListener(AFTER_COMMIT)`로 트랜잭션 커밋 후 이벤트 수신
     - `@Async("timeCapsuleNotificationExecutor")`로 별도 스레드 풀에서 비동기 처리
     - 이벤트 핸들러가 Notification 엔티티 생성 (인앱 알림)
     - 사용자의 `emailNotificationEnabled` 설정 확인
     - 설정이 `true`인 경우 SMTP를 통해 사용자 이메일로 알림 발송
     - EmailLog에 발송 이력 기록
   - 결과: 사용자 이메일로 알림 발송, 발송 이력 DB 저장

3. **사용자 확인**
   - 사용자 행동: 이메일 수신 확인, "타임캡슐 보러가기" 링크 클릭
   - 시스템 동작: 타임캡슐 상세 페이지로 리다이렉트
   - 결과: 타임캡슐 내용 확인 가능

#### 상세 규칙
| 항목 | 설명 |
|------|------|
| 발송 대상 | `User.emailNotificationEnabled = true`인 사용자만 |
| 발송 시점 | 타임캡슐 `openAt` 시각 (즉시 발송, 시간 제한 없음) |
| 이메일 제목 | "🎁 타임캡슐이 열렸습니다!" |
| 이메일 본문 | HTML 템플릿 (타임캡슐 작성일, 공개일 정보 포함) |
| CTA 버튼 | "타임캡슐 보러가기" (타임캡슐 상세 페이지 링크) |
| 재시도 정책 | `MessagingException` 발생 시 최대 3회 시도 (Spring Retry, 지수 백오프: 1초 → 2초 → 4초) |
| 발송 이력 | EmailLog 엔티티에 성공/실패 기록 |
| 수신 설정 | 사용자가 설정 페이지에서 ON/OFF 가능 |
| 수동 재발송 | Phase 1(MVP)에서는 미지원, 추후 관리자 API 추가 예정 |

### 2.8 감정 날씨 (Emotion Weather)

#### 기능 설명
대한민국 전체 사용자의 오늘 감정 기록을 집계하여 Top 3 감정 랭킹을 제공합니다. 아카이브가 작성될 때마다 Redis Sorted Set이 업데이트되며, 프론트엔드가 5분 주기로 폴링하여 헤더에 표시합니다.

#### 주요 시나리오
1. **랭킹 조회 (폴링)**
   - 사용자 행동: 사이트 접속 (헤더 마운트)
   - 시스템 동작: `GET /api/v1/emotions/ranking`으로 현재 Top 3 조회 후 5분마다 자동 갱신
   - 결과: 헤더에 감정 날씨 TOP 3 ticker 표시 (슬라이드업 애니메이션으로 순환)

#### UI 구현
- **위치**: 전역 헤더 로고 오른쪽 (모든 페이지에서 표시)
- **표시 방식**: 슬라이드업 애니메이션으로 1위 → 2위 → 3위 3초 간격 순환
- **메달**: CSS 원형 배지 (금 #F59E0B / 은 #9CA3AF / 동 #B45309)
- **폴링 주기**: 5분 (React Query `refetchInterval`)

#### 상세 규칙
| 항목 | 설명 |
|------|------|
| 집계 범위 | 대한민국 전체 (공개 아카이브만) |
| 시간 범위 | 오늘 하루 (자정 기준 초기화) |
| 랭킹 표시 | Top 3 |
| 갱신 방식 | 프론트엔드 5분 폴링 (SSE 미사용) |
| Redis 구조 | Sorted Set, Key: `emotion:ranking:{yyyyMMdd}`, TTL: 자정 자동 만료 |
| 고도화 계획 | Phase 2에서 지역구별 감정 랭킹으로 확장 예정 (geohash 기반) |

---

### 2.7 SSE 기반 실시간 알림 (Real-time Notification)

#### 기능 설명
사이트를 열어두고 있는 동안 타임캡슐 공개 시점에 즉각적으로 실시간 알림(토스트/팝업)을 받아, 이메일을 확인하지 않아도 바로 타임캡슐을 확인할 수 있습니다.

#### 주요 시나리오
1. **SSE 연결 수립**
   - 사용자 행동: 로그인 후 사이트 접속
   - 시스템 동작: 서버와 SSE 커넥션 수립 (`GET /api/v1/notifications/subscribe`)
   - 결과: 실시간 알림 수신 대기 상태

2. **타임캡슐 공개 알림 수신**
   - 사용자 행동: 없음 (자동 처리)
   - 시스템 동작: 스케줄러가 타임캡슐 공개 처리 후 `TimeCapsuleOpenedEvent` 발행 → SSE로 연결된 사용자에게 `notification` 이벤트 전송
   - 결과: 화면에 토스트/알림 팝업 표시

3. **연결 종료**
   - 사용자 행동: 탭 닫기 또는 로그아웃
   - 시스템 동작: SSE 커넥션 자동 종료
   - 결과: 실시간 알림 수신 중단

#### 상세 규칙
| 항목 | 설명 |
|------|------|
| 연결 방식 | SSE (Server-Sent Events), 단방향 서버 → 클라이언트 |
| 하트비트 주기 | 30초마다 `heartbeat` 이벤트 전송 (연결 유지) |
| 재연결 | 브라우저 `EventSource` 기본 자동 재연결 |
| 이벤트 타입 | `connect` (연결 확인), `heartbeat` (연결 유지), `notification` (알림) |
| 알림 대상 | 타임캡슐 공개 (`TIME_CAPSULE_OPENED`) 이벤트만 |
| 연결 종료 조건 | 탭 닫기, 로그아웃, 네트워크 오류 |
| 새 Entity | 없음 (기존 `Notification` 엔티티 재사용) |

---

## 3. 사용자 시스템

### 3.1 인증
- **방식**: 이메일/비밀번호 기반 회원가입
- **소셜 로그인**: 미지원

### 3.2 사용자 프로필
| 항목 | 필수 여부 |
|------|----------|
| 닉네임 | 필수 |
| 프로필 사진 | 선택 |
| 소개글 | 미지원 |

### 3.3 알림
- **지원 범위**: 타임캡슐 공개 알림만
- **좋아요/스크랩 알림**: 미지원

---

## 4. 기술 스펙

### 4.1 기술 스택

#### 프론트엔드
| 항목 | 선택 |
|------|------|
| 프레임워크 | Next.js |
| 스타일링 | 미정 (일반적인 구현) |
| 상태 관리 | 미정 (일반적인 구현) |
| 지도 | Kakao Maps JavaScript SDK |

#### 백엔드
| 항목 | 선택 |
|------|------|
| 언어/프레임워크 | Java / Spring Boot |
| 데이터베이스 | MySQL (공간 데이터 지원) |
| ORM | JPA + QueryDSL |
| 캐싱 | Redis (예정) |
| 배치 | Spring Batch |

#### 인프라
| 항목 | 선택 |
|------|------|
| 배포 환경 | AWS |
| 이미지 저장 | 서버 로컬 저장 |
| CI/CD | 구축 예정 |

### 4.2 백엔드 핵심 기술 요구사항

#### GIS 공간 쿼리
- **활용 시나리오**:
  - 반경 N km 내 게시글 검색
  - 가까운 마커 클러스터링
  - 지역별 통계 집계
- **기술**: MySQL Spatial Functions 또는 PostGIS 검토
- **중요도**: **최우선** (모빌리티 도메인 이직 연관)

#### DDD (Domain-Driven Design)
- **Bounded Context 분리**:
  - 회원 (Member)
  - 아카이브 (Archive)
  - 타임캡슐 (TimeCapsule)
  - 리포트 (Report)
  - 알림 (Notification)

#### Spring Batch
- **활용 시나리오**:
  - Soft Delete된 아카이브 글 정리 (물리적 삭제)
- **성능 테스트**: cronJob vs DB 스케줄러 비교 예정

#### 이벤트 기반 시스템
- **활용 시나리오**: 타임캡슐 공개 알림 발송
- **구현 방식**: Spring 자체 이벤트 (`ApplicationEventPublisher` → `@TransactionalEventListener`)
- **비동기 처리**: `@Async` + `ThreadPoolTaskExecutor` (스레드 풀명: `timeCapsuleNotificationExecutor`)
- **실행 시점**: 트랜잭션 커밋 후 (`TransactionPhase.AFTER_COMMIT`)
- **재시도**: Spring Retry (`@Retryable`) - `MessagingException` 발생 시 최대 3회, 지수 백오프 (1초 → 2초 → 4초)

#### 기타 구현 목표
- 캐싱 (Redis)
- 테스트 커버리지 확보
- 비동기 스레드 처리
- 동시성 제어
- CI/CD 파이프라인

### 4.3 프론트엔드 구현 방향
- **수준**: 일반적인 구현 (특별한 기술 요구사항 없음)
- **개발 방식**: AI 적극 활용

---

## 5. UI/UX 설계

### 5.1 디자인 시스템
- **기존 랜딩 디자인**: 참고용으로만 활용
- **실제 서비스**: 새로운 디자인 시스템 제작 필요

### 5.2 반응형
- **우선순위**: 데스크톱 우선
- **모바일**: 반응형으로 대응

### 5.3 테마
- **다크 모드**: 미지원 (라이트 모드만)

### 5.4 페이지 구성 (초안)
> *상세 페이지 구성은 개발 진행하며 확정*

예상 페이지:
1. 랜딩/온보딩
2. 로그인/회원가입
3. 홈 (탐색: 지도/피드 뷰)
4. 글 작성
5. 글 상세
6. 마이페이지
   - 내 아카이브
   - 내 타임캡슐
   - 스크랩
   - 월간 리포트
7. 설정

---

## 6. 데이터 모델 (초안)

### 6.1 핵심 엔티티

```
User (회원)
├── id (PK, Long, auto-increment)
├── name (String, NOT NULL)
├── email (Email @Embedded - value object with validation)
├── nickname (Nickname @Embedded - value object)
├── password (Password @Embedded - encrypted value object)
├── phone (Phone @Embedded - value object with format validation)
├── gender (Gender enum: MALE/FEMALE, NOT NULL)
├── birthDate (BirthDate @Embedded - value object)
├── role (Role enum: USER/ADMIN, default USER)
├── status (Status enum: ACTIVE/INACTIVE, default ACTIVE)
├── emailNotificationEnabled (boolean, NOT NULL, default true - 이메일 알림 수신 여부)
├── createdAt (LocalDateTime, auto-generated)
└── updatedAt (LocalDateTime, auto-updated)

Archive (아카이브 글)
├── id (PK, Long, auto-increment)
├── user (FK to User, @ManyToOne, NOT NULL)
├── emotion (Emotion enum, NOT NULL)
├── content (String, NOT NULL, 최대 5000자)
├── visibility (Visibility enum: PUBLIC/PRIVATE, NOT NULL)
├── location (Location @Embedded)
│   ├── latitude (Double)
│   ├── longitude (Double)
│   └── locationName (String)
├── point (Point - PostGIS geometry type for spatial queries)
├── likeCount (int, default 0)
├── createdAt (LocalDateTime, auto-generated)
├── updatedAt (LocalDateTime, auto-updated)
└── deletedAt (LocalDateTime, nullable - soft delete)

ArchiveImage (아카이브 이미지)
├── id (PK, Long, auto-increment)
├── archive (FK to Archive, @ManyToOne, NOT NULL)
├── fileMeta (FileMeta @Embedded - file metadata)
│   ├── storageKey (String)
│   ├── originalName (String - 원본 파일명)
│   ├── contentType (String - MIME 타입)
│   ├── sizeBytes (Long - 파일 크기, 최대 5MB)
│   └── extension (String)
├── createdAt (LocalDateTime, auto-generated)
└── deletedAt (LocalDateTime, nullable - soft delete)

이미지 업로드 제한사항:
- 최대 개수: 5개
- 파일당 크기: 5MB
- 전체 크기: 20MB
- 수정 시: 기존 이미지 전체 삭제 후 재업로드

ArchiveLike (아카이브 좋아요)
├── id (PK, Long, auto-increment)
├── archive (FK to Archive, @ManyToOne, NOT NULL)
├── user (FK to User, @ManyToOne, NOT NULL)
└── createdAt (LocalDateTime, auto-generated)

ArchiveScrap (아카이브 스크랩)
├── id (PK, Long, auto-increment)
├── archive (FK to Archive, @ManyToOne, NOT NULL)
├── user (FK to User, @ManyToOne, NOT NULL)
└── createdAt (LocalDateTime, auto-generated)

TimeCapsule (타임캡슐)
├── id (PK, Long, auto-increment)
├── user (FK to User, @ManyToOne, NOT NULL)
├── emotion (Emotion enum, NOT NULL)
├── content (String, NOT NULL)
├── location (Location @Embedded)
│   ├── latitude (Double)
│   ├── longitude (Double)
│   └── locationName (String)
├── capsuleStatus (CapsuleStatus enum: LOCKED/OPENED, NOT NULL, default LOCKED)
├── isNotificationSent (boolean, NOT NULL, default false)
├── openAt (LocalDateTime, NOT NULL - unlock time, must be future)
├── createdAt (LocalDateTime, auto-generated)
├── updatedAt (LocalDateTime, auto-updated)
└── deletedAt (LocalDateTime, nullable - soft delete)

TimeCapsuleImage (타임캡슐 이미지)
├── id (PK, Long, auto-increment)
├── timeCapsule (FK to TimeCapsule, @ManyToOne, NOT NULL)
├── fileMeta (FileMeta @Embedded - file metadata)
│   ├── storageKey (String)
│   ├── originalName (String - 원본 파일명)
│   ├── contentType (String - MIME 타입)
│   ├── sizeBytes (Long - 파일 크기, 최대 5MB)
│   └── extension (String)
├── createdAt (LocalDateTime, auto-generated)
└── deletedAt (LocalDateTime, nullable - soft delete)

Notification (알림)
├── id (PK, Long, auto-increment)
├── user (FK to User, @ManyToOne, NOT NULL)
├── title (String, NOT NULL)
├── content (String, NOT NULL)
├── notificationType (NotificationType enum - 알림 타입)
├── relatedId (Long - 대상 ID)
├── isRead (boolean, default false)
├── createdAt (LocalDateTime, auto-generated)
└── readAt (LocalDateTime, nullable)

EmailLog (이메일 발송 로그)
├── id (PK, Long, auto-increment)
├── userId (Long, NOT NULL - 수신 사용자 ID)
├── type (RelatedType enum: TIME_CAPSULE/NOTICE, NOT NULL - 알림 관련 리소스 타입)
├── relatedId (Long - 관련 리소스 ID, 예: timeCapsuleId)
├── emailAddress (String, NOT NULL - 발송 당시 이메일 주소)
├── subject (String, NOT NULL - 이메일 제목)
├── content (String, TEXT, NOT NULL - 이메일 본문)
├── status (SendStatus enum: NONE/SUCCESS/FAIL, default NONE)
├── failReason (String, TEXT, nullable - 실패 사유)
├── retryCount (int, default 0 - 재시도 횟수)
├── sentAt (LocalDateTime, nullable - 실제 발송 시각)
├── createdAt (LocalDateTime, auto-generated - 로그 생성 시각)
└── deletedAt (LocalDateTime, nullable - soft delete)
```

### 6.2 감정 타입 (Enum)
```java
public enum Emotion {
    HAPPY,      // 행복한
    SAD,        // 슬픈
    ANXIOUS,    // 불안한
    ANGRY,      // 화난
    CALM,       // 차분한
    EXCITED,    // 신난
    LONELY,     // 외로운
    GRATEFUL,   // 감사한
    TIRED       // 지친
}
```

### 6.3 기타 Enum 타입
```java
public enum Visibility {
    PUBLIC,     // 공개
    PRIVATE     // 비공개
}

public enum CapsuleStatus {
    LOCKED,     // 잠금
    OPENED      // 열림
}

public enum Gender {
    MALE,       // 남성
    FEMALE      // 여성
}

public enum Role {
    USER,       // 일반 사용자
    ADMIN       // 관리자
}

public enum Status {
    ACTIVE,     // 활성
    INACTIVE,   // 비활성
    WITHDRAWN,  // 탈퇴
    DELETED     // 삭제
}

public enum SendStatus {
    NONE,       // 발송 전
    SUCCESS,    // 발송 성공
    FAIL        // 발송 실패
}

public enum RelatedType {
    TIME_CAPSULE,   // 타임캡슐
    NOTICE          // 공지사항
}
```

---

## 7. API 엔드포인트

### 7.1 인증
```
POST   /api/v1/login             로그인
DELETE /api/v1/logout            로그아웃
POST   /api/v1/token/reIssue     토큰 재발급
```

### 7.2 회원
```
POST   /api/v1/users             회원가입
GET    /api/v1/users/{id}        회원 정보 조회
```

### 7.3 아카이브
```
POST   /api/v1/archives             글 작성
GET    /api/v1/archives             글 목록 조회 (필터/정렬, 공개 글만)
GET    /api/v1/archives/me          내 아카이브 목록 조회 (내 글만, 필터/정렬)
GET    /api/v1/archives/{id}        글 상세 조회
PATCH  /api/v1/archives/{id}        글 수정 (emotion/content/visibility 필수, imageIds 선택)
DELETE /api/v1/archives/{id}        글 삭제 (soft delete)
PATCH  /api/v1/archives/{id}/status 아카이브 상태(공개/비공개) 변경
GET    /api/v1/archives/nearby      반경 내 아카이브 조회 (GIS)
                                     Query params: latitude, longitude, radius (기본값 50.0km)
                                     Response: ArchiveSummaryResponse[] (전체 정보 포함)
POST   /api/v1/archives/{id}/images 이미지 업로드 (최대 5개, 파일당 5MB, 전체 20MB)
DELETE /api/v1/archives/{archiveId}/images/{imageId}  이미지 삭제
GET    /api/v1/archives/{archiveId}/images/{imageId}  이미지 다운로드 (JWT 인증 필요)
```

### 7.4 좋아요/스크랩
```
POST   /api/v1/archives/{id}/like      좋아요
DELETE /api/v1/archives/{id}/like      좋아요 취소
POST   /api/v1/archives/{id}/scrap     스크랩
DELETE /api/v1/archives/{id}/scrap     스크랩 취소
GET    /api/v1/archives/scraps         내 스크랩 목록
```

### 7.5 타임캡슐
```
POST   /api/v1/time-capsule                              타임캡슐 작성
GET    /api/v1/time-capsule                              내 타임캡슐 목록
                                                          Query params: status (LOCKED/OPENED), page, size
GET    /api/v1/time-capsule/{id}                         타임캡슐 상세 조회
PUT    /api/v1/time-capsule/{id}                         타임캡슐 수정 (작성 후 30분 내)
DELETE /api/v1/time-capsule/{id}                         타임캡슐 삭제 (작성 후 30분 내 + LOCKED 상태만)
POST   /api/v1/time-capsule/{id}/images                  이미지 업로드 (최대 5개, 파일당 5MB)
DELETE /api/v1/time-capsule/{id}/images/{imageId}        이미지 삭제
GET    /api/v1/time-capsule/{id}/images/{imageId}        이미지 다운로드 (JWT 인증 필요)
```

### 7.6 감정 목록
```
GET    /api/v1/emotions              사용 가능한 감정 목록 조회
```

### 7.7 알림
```
GET    /api/v1/notifications              알림 목록 조회 (페이지네이션)
                                           Query params: page, size, sort, isRead
                                           Response: Page<NotificationResponse>
PATCH  /api/v1/notifications/{id}/read    개별 알림 읽음 처리
PATCH  /api/v1/notifications/read-all     전체 알림 읽음 처리
GET    /api/v1/notifications/subscribe    SSE 구독 (실시간 알림 수신)
                                           Response: text/event-stream
                                           Events: connect, heartbeat (30초마다), notification
```

### 7.8 이메일 알림 설정
```
PATCH  /api/v1/users/me/settings/email-notification  이메일 알림 수신 여부 변경 (미구현 - 백엔드 작업 필요)
                                                       Request Body: { "enabled": boolean }
                                                       Response: 200 OK
```

### 7.9 감정 날씨
```
GET    /api/v1/emotions/ranking            오늘의 감정 날씨 Top 3 조회
                                           Response: [{rank, emotion, count}] (배열)
```

---

## 8. 비기능 요구사항

### 8.1 성능
- GIS 쿼리 최적화 (공간 인덱스 활용)
- 캐싱으로 조회 성능 개선

### 8.2 확장성
- 이벤트 기반 아키텍처로 서비스 간 느슨한 결합
- DDD로 도메인 분리

### 8.3 테스트
- 단위 테스트 커버리지 확보
- 통합 테스트 구현

### 8.4 배포
- CI/CD 파이프라인 구축
- AWS 인프라 구성

---

## 9. 우려 사항 및 트레이드오프

### 9.1 프로젝트 미완성 위험
- **원인**: 4주 내 모든 기능 + 고급 기술 적용 시도
- **대응**:
  - MVP 기능 우선 구현
  - 기술 스택은 점진적 적용
  - 미완성보다는 핵심 기능 완성도 우선

### 9.2 오버엔지니어링 위험
- **원인**: 이직용 어필을 위해 많은 기술 적용 시도
- **대응**:
  - 기능에 자연스럽게 녹아드는 기술만 적용
  - 불필요한 복잡도 지양
  - GIS + DDD + 이벤트 시스템에 집중

### 9.3 모빌리티 도메인 연관성
- **핵심 어필 포인트**: GIS 공간 쿼리
- **구현 방향**:
  - 반경 검색, 클러스터링 등 실무에서 사용하는 패턴 구현
  - 공간 인덱스 활용한 성능 최적화
  - MySQL Spatial 또는 PostGIS 실무 경험 확보

---

## 10. 미확정 사항

- [ ] 서비스명 확정
- [ ] 상세 페이지 구성 및 화면 설계
- [ ] 새로운 디자인 시스템 제작
- [ ] 감정 태그 최종 목록 확정
- [ ] 배치 작업 상세 스케줄 (cronJob vs DB 스케줄러 결정)
- [ ] 캐싱 전략 상세 설계
- [ ] AWS 인프라 구성 상세

---

## 11. 용어 정의

| 용어 | 설명 |
|------|------|
| 아카이브 | 감정이 담긴 장소 기록 (일반 게시글) |
| 타임캡슐 | 미래에 열어볼 수 있도록 예약된 감정 기록 |
| 감정 태그 | 미리 정의된 감정 분류 (행복, 슬픔 등) |
| 정밀도 | 위치 공개 수준 (동네 ~ 구체적 스팟) |
| Soft Delete | 물리적 삭제 없이 삭제 플래그로 표시 |

---

## 부록: 기술 결정 근거

### A. MySQL Spatial vs PostGIS
- **초기 선택**: MySQL Spatial
- **근거**:
  - MySQL 이미 선택됨
  - 기본 GIS 쿼리에 충분
  - 복잡한 GIS가 필요하면 PostGIS로 마이그레이션 검토

### B. 이미지 저장: 서버 로컬 vs S3
- **초기 선택**: 서버 로컬
- **근거**:
  - 극소규모 사용자 (10-100명)
  - 비용 최소화
  - 추후 S3 마이그레이션 용이하도록 추상화

### C. 신고 기능 미구현
- **근거**:
  - 극소규모로 운영 가능
  - 개발 리소스 핵심 기능에 집중
  - 추후 필요시 추가
