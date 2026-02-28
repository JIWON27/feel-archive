# 백엔드 API 수정 요청 사항

> **작성일**: 2026-01-26
> **최종 업데이트**: 2026-03-01 (v1.0.0 기준 — 모든 항목 해결 완료)
> **작성자**: 프론트엔드 개발팀

---

## ✅ 전체 요약 (v1.0.0 기준)

**모든 주요 요청 사항이 해결 완료되었습니다.**
현재 프론트엔드와 백엔드 API가 정상적으로 연동되어 있습니다.

---

## ✅ 해결 완료된 항목

### 1. PATCH /api/v1/archives/{id} - 아카이브 전체 수정 API ✅ 구현 완료

**현재 상태**: 구현 완료
**엔드포인트**: `PATCH /api/v1/archives/{archiveId}`
**Request Body**:
```json
{
  "emotion": "HAPPY",
  "content": "수정된 내용",
  "visibility": "PUBLIC",
  "location": { "latitude": 37.5, "longitude": 126.9, "locationLabel": "서울" },
  "imageIds": [1, 2, 3]
}
```
- `location`: optional
- `imageIds`: 유지할 이미지 ID 목록 (서버가 기존 이미지와 비교하여 동기화)

**Response**: `ArchiveDetailResponse` (200 OK)

---

### 2. DELETE /api/v1/archives/{id} - 아카이브 삭제 API ✅ 구현 완료

**현재 상태**: 구현 완료
**엔드포인트**: `DELETE /api/v1/archives/{archiveId}`
**Response**: 204 No Content
- Soft Delete 방식 (`deletedAt` 필드 설정)

---

### 3. 위치 정보 선택사항 처리 ✅ 해결 완료

**결정**: 위치는 **선택사항**으로 확정
- 프론트엔드: ArchiveForm에 위치 공유 토글 추가 (`shareLocation` 상태)
- `shareLocation === false` 시 location 값 undefined로 전송
- 백엔드: `location` 필드 optional 처리로 유지

---

### 4. ArchiveSummaryResponse isLiked / isScraped 필드 ✅ 구현 완료

현재 백엔드 응답에 `isLiked`, `isScraped` 포함:
```json
{
  "archiveId": 456,
  "emotion": "HAPPY",
  "contentPreview": "...",
  "latitude": 37.5665,
  "longitude": 126.9780,
  "address": "서울시청",
  "createdAt": "2026-02-15T14:30:00",
  "likeCount": 5,
  "isLiked": false,
  "isScraped": true,
  "writer": { "userId": 123, "nickname": "길동이" }
}
```

---

### 5. ArchiveDetailResponse isLiked / isScraped / isOwner 필드 ✅ 구현 완료

현재 백엔드 응답에 `isLiked`, `isScraped`, `isOwner` 모두 포함.
- `isOwner` Jackson 직렬화: `@JsonProperty("isOwner")` 적용 완료

---

### 6. 주변 아카이브 조회 API ✅ 구현 완료

**엔드포인트**: `GET /api/v1/archives/nearby`
**Query Parameters**: `latitude`, `longitude`, `radius` (default: 50.0)
**Response**: `List<ArchiveSummaryResponse>` (전체 정보 포함)

프론트엔드 구현:
```typescript
const { data } = await apiClient.get<ArchiveSummary[]>('/api/v1/archives/nearby', {
  params: { latitude, longitude, radius },
});
```

---

## 📋 현재 구현 완료 범위

### 아카이브
- ✅ 아카이브 작성 (감정 단일 선택, 위치 선택사항, 이미지 최대 5개)
- ✅ 아카이브 목록 조회 (무한 스크롤, 감정/키워드 필터, LATEST/OLDEST/POPULAR/LIKE 정렬)
- ✅ 아카이브 상세 조회 (isOwner/isLiked/isScraped 포함)
- ✅ 아카이브 수정 (지연 연결 이미지 방식)
- ✅ 아카이브 삭제 (Soft Delete)
- ✅ 이미지 업로드 (최대 5개, 파일당 5MB, 전체 20MB)
- ✅ 이미지 삭제
- ✅ 좋아요/스크랩 기능 (토글)
- ✅ 내 아카이브 목록 (공개+비공개, 필터/정렬)
- ✅ 스크랩 목록 (무한 스크롤)
- ✅ 주변 아카이브 조회 (GPS 기반 반경 50km)

### 지도
- ✅ Kakao Maps 통합 (WhatsApp 스타일 2단 레이아웃)
- ✅ 감정별 마커 색상/이모지
- ✅ 현재 위치 파란색 마커
- ✅ 리스트-지도 양방향 동기화

### 인증
- ✅ 로그인, 회원가입, 로그아웃
- ✅ JWT 자동 갱신 (Axios interceptor)

### 마이페이지
- ✅ 프로필 조회 (`GET /api/v1/users/me`)
- ✅ 비밀번호 변경 (`PATCH /api/v1/users/me/password`)
- ✅ 이메일 알림 설정 (`PATCH /api/v1/users/me/settings/email-notification`, body: `{enable: boolean}`)
- ✅ 회원탈퇴 (`DELETE /api/v1/users`, body: `{currentPassword}`)

### 타임캡슐
- ✅ 작성, 목록, 상세, 수정, 삭제 (30분 제한)
- ✅ 이미지 업로드/표시 (AuthImage - JWT 인증)

### 알림
- ✅ SSE 실시간 수신 (`event: time-capsule`)
- ✅ 알림 목록 (무한 스크롤, Spring Page 포맷)
- ✅ 개별/전체 읽음 처리

### 감정 날씨
- ✅ Top 3 조회 (5분 폴링, Ticker 애니메이션)

---

## 🔴 미구현 기능 (1.0.0 이후 예정)

| 기능 | 설명 |
|------|------|
| 프로필 수정 | 닉네임, 프로필 사진 변경 (`PATCH /api/v1/users/me`) |
| 월간 리포트 | 감정 통계 차트 |
| 모바일 반응형 | 터치 최적화, 모바일 네비게이션 |
| 404 에러 페이지 | `app/not-found.tsx` |
| 접근성 개선 | ARIA, 키보드 네비게이션 |

## ✅ CI/CD 현황

**백엔드**: AWS CodeBuild → ECR → CodeDeploy → EC2 완전 자동화
- `buildspec.yml`: Gradle 빌드 + Docker 이미지 빌드 & ECR push
- `appspec.yml` + `scripts/deploy.sh`: SSM에서 환경변수 조회 후 컨테이너 실행
- 시크릿: AWS SSM Parameter Store

**프론트엔드**: Vercel 자동 배포 완료
- `NEXT_PUBLIC_API_URL` 환경변수로 API 프록시 (EC2 백엔드 연결)
- main 브랜치 push 시 자동 배포

**이미지 저장**: AWS S3 (로컬 저장에서 S3로 전환 완료)

---

**참고 문서:**
- `/docs/SPEC.md` - 서비스 기획 스펙
- `/docs/API.md` - API 상세 명세
- `/apps/frontend/docs/ROUTES.md` - 라우팅 현황
- `/apps/frontend/types/` - TypeScript 타입 정의
