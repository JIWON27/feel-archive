# 백엔드 API 수정 요청 사항

> **작성일**: 2026-01-26
> **작성자**: 프론트엔드 개발팀
> **프론트엔드 구현 완료**: 아카이브 CRUD 전체 기능

---

## 📋 요약

SPEC.md 기준으로 프론트엔드 구현이 완료되었으나, 현재 백엔드 API와 SPEC 간 차이점이 존재합니다. 아래 항목들의 수정이 필요합니다.

---

## 🔴 필수 수정 사항

### 1. ArchiveRequest - 감정 태그 복수 선택 지원

**현재 상태:**
```java
// ArchiveRequest.java
public record ArchiveRequest(
    @NotNull Emotion emotion,  // 단일 값
    @NotBlank String content,
    @NotNull Visibility visibility,
    LocationRequest location
) {}
```

**요청 사항:**
```java
public record ArchiveRequest(
    @NotNull @Size(min = 1) List<Emotion> emotions,  // 복수 선택으로 변경
    @NotBlank String content,
    @NotNull Visibility visibility,
    @NotNull LocationRequest location  // 필수로 변경 (선택사항)
) {}
```

**이유:**
- SPEC.md 2.1: "감정 태그 시스템: 복수 선택 가능"
- 사용자가 여러 감정을 동시에 느낄 수 있음 (예: 행복+설렘, 슬픔+그리움)

**영향 범위:**
- `Archive` 엔티티: `emotion` 필드 → `emotions` 관계로 변경
- `ArchiveEmotion` 엔티티: 이미 존재 (그대로 사용 가능)
- `ArchiveSummaryResponse`, `ArchiveDetailResponse`: `emotion` → `emotions` 배열로 변경

---

### 2. PATCH /api/v1/archives/{id} - 아카이브 전체 수정 API 추가

**현재 상태:**
- `PATCH /api/v1/archives/{id}/status` - 공개/비공개 상태만 변경 가능

**요청 사항:**
```java
@PatchMapping("/api/v1/archives/{archiveId}")
public ResponseEntity<Void> updateArchive(
    @PathVariable Long archiveId,
    @Valid @RequestBody ArchiveUpdateRequest request,
    @AuthenticationPrincipal Long userId
) {
    archiveService.update(archiveId, request, userId);
    return ResponseEntity.ok().build();
}
```

**ArchiveUpdateRequest:**
```java
public record ArchiveUpdateRequest(
    @NotNull @Size(min = 1) List<Emotion> emotions,
    @NotBlank String content,
    @NotNull Visibility visibility,
    @NotNull LocationRequest location
) {}
```

**이유:**
- SPEC.md 2.1: "아카이브 글: 자유롭게 수정/삭제 가능"
- 사용자가 감정, 내용, 위치를 모두 수정할 수 있어야 함

**비즈니스 규칙:**
- 본인이 작성한 글만 수정 가능 (userId 검증)
- 수정 시 `updatedAt` 타임스탬프 갱신

---

### 3. DELETE /api/v1/archives/{id} - 아카이브 삭제 API 추가 (Soft Delete)

**현재 상태:**
- 아카이브 삭제 API 없음

**요청 사항:**
```java
@DeleteMapping("/api/v1/archives/{archiveId}")
public ResponseEntity<Void> deleteArchive(
    @PathVariable Long archiveId,
    @AuthenticationPrincipal Long userId
) {
    archiveService.delete(archiveId, userId);
    return ResponseEntity.noContent().build();
}
```

**이유:**
- SPEC.md 2.1: "삭제 방식: Soft Delete (배치로 정리)"
- 사용자가 자신의 글을 삭제할 수 있어야 함

**구현 방법:**
- `Archive` 엔티티의 `deletedAt` 필드를 현재 시간으로 설정
- 실제 데이터는 유지 (물리적 삭제는 배치 작업)
- 조회 쿼리에서 `deletedAt IS NULL` 조건 추가

**비즈니스 규칙:**
- 본인이 작성한 글만 삭제 가능 (userId 검증)
- Soft Delete 후 30일 경과 시 배치로 물리적 삭제 (별도 구현)

---

## 🟡 선택 수정 사항

### 4. LocationRequest 필수 여부

**현재 상태:**
- `LocationRequest`가 선택사항 (nullable)

**권장 사항:**
- SPEC.md에서는 "장소: 필수"로 명시됨
- 프론트엔드는 필수로 구현함
- 백엔드도 `@NotNull` 추가 권장

**또는:**
- SPEC.md를 수정하여 "장소: 선택사항"으로 변경
- 현재 백엔드 구현 유지

---

## 🟢 Response DTO 변경 사항

### ArchiveSummaryResponse

**현재:**
```java
public record ArchiveSummaryResponse(
    Long archiveId,
    String emotion,  // 단일 값
    String contentPreview,
    String address,
    LocalDateTime createdAt,
    int likeCount,
    CommonUserResponse writer
) {}
```

**요청:**
```java
public record ArchiveSummaryResponse(
    Long archiveId,
    List<String> emotions,  // 복수로 변경
    String contentPreview,
    String address,
    LocalDateTime createdAt,
    int likeCount,
    Boolean isLiked,  // 현재 사용자가 좋아요 했는지
    Boolean isScraped,  // 현재 사용자가 스크랩 했는지
    CommonUserResponse writer
) {}
```

### ArchiveDetailResponse

**현재:**
```java
public record ArchiveDetailResponse(
    Long archiveId,
    String emotion,  // 단일 값
    String content,
    List<ArchiveImageResponse> images,
    String visibility,
    LocationResponse location,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    int likeCount,
    CommonUserResponse writer,
    Boolean isOwner
) {}
```

**요청:**
```java
public record ArchiveDetailResponse(
    Long archiveId,
    List<String> emotions,  // 복수로 변경
    String content,
    List<ArchiveImageResponse> images,
    String visibility,
    LocationResponse location,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    int likeCount,
    Boolean isLiked,  // 추가
    Boolean isScraped,  // 추가
    CommonUserResponse writer,
    Boolean isOwner
) {}
```

---

## 📊 데이터베이스 변경 사항

### Archive 엔티티 수정 (예상)

**현재:**
```java
@Entity
public class Archive {
    // ...
    @Enumerated(EnumType.STRING)
    private Emotion emotion;  // 단일 필드
}
```

**변경 후:**
```java
@Entity
public class Archive {
    // ...
    // emotion 필드 제거

    @OneToMany(mappedBy = "archive", cascade = CascadeType.ALL)
    private List<ArchiveEmotion> emotions;  // 관계 사용
}
```

**참고:**
- `ArchiveEmotion` 엔티티는 이미 존재하므로 재사용 가능
- 매핑 테이블 기반 복수 관계 구현

---

## ✅ 구현 우선순위

| 우선순위 | 항목 | 이유 |
|---------|-----|-----|
| 🔴 높음 | #1 감정 복수 선택 | SPEC 핵심 기능, 사용자 경험에 직접 영향 |
| 🔴 높음 | #2 아카이브 수정 API | 사용자가 글을 수정할 수 없음 |
| 🔴 높음 | #3 아카이브 삭제 API | 사용자가 글을 삭제할 수 없음 |
| 🟡 중간 | #4 위치 필수 여부 | SPEC과 불일치, 정책 결정 필요 |

---

## 🔄 마이그레이션 가이드

### 기존 데이터 처리

만약 이미 운영 중인 데이터가 있다면:

1. **감정 복수 선택 마이그레이션:**
   ```sql
   -- 기존 단일 emotion을 ArchiveEmotion 테이블로 이전
   INSERT INTO archive_emotion (archive_id, emotion_type)
   SELECT id, emotion FROM archive WHERE emotion IS NOT NULL;
   ```

2. **API 버전 관리 (선택):**
   - `/api/v2/archives` 엔드포인트로 새 API 제공
   - 기존 v1은 deprecated 처리

---

## 📞 연락처

질문이나 논의가 필요한 사항이 있으면 프론트엔드 팀에 연락주세요.

**프론트엔드 구현 완료 범위:**
- ✅ 아카이브 작성 (감정 복수 선택, 위치 필수)
- ✅ 아카이브 목록 조회 (무한 스크롤, 필터링, 정렬)
- ✅ 아카이브 상세 조회
- ✅ 아카이브 수정
- ✅ 아카이브 삭제
- ✅ 좋아요/스크랩 기능
- ✅ 내 아카이브 목록
- ✅ 스크랩 목록

**테스트 완료:**
- ✅ TypeScript 타입 검증 통과
- ✅ Next.js 빌드 성공
- ✅ 모든 페이지 라우팅 정상 작동

---

**참고 문서:**
- `/Users/minjiwon/Desktop/feel-archive/docs/SPEC.md` - 서비스 기획 스펙
- `/Users/minjiwon/Desktop/feel-archive/apps/frontend/types/archive.ts` - 프론트엔드 타입 정의
- `/Users/minjiwon/Desktop/feel-archive/apps/frontend/services/archive-service.ts` - API 호출 구현
