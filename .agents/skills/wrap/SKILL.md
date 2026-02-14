---
name: wrap
description: Complete a task and automatically update SPEC.md to maintain Single Source of Truth (SSOT). Use this skill after implementing features from TASK_LIST.json to sync implementation details back to SPEC.md. Triggers when (1) User types "/wrap" command, (2) User says "wrap up", "sync spec", or "update spec", (3) After completing a task and user wants to sync changes back to spec.
---

# Wrap - SPEC.md Auto-Update

## Overview

Maintains SPEC.md as the Single Source of Truth (SSOT) by automatically syncing completed implementations back to the specification document. This skill bridges the gap between implementation (frontend/backend code) and documentation (SPEC.md) in a Spec-Driven Development (SDD) workflow.

## When to Use

Use this skill after completing a task to ensure SPEC.md stays up-to-date with implementation:

- **After completing a task** from TASK_LIST.json (passes: true)
- **User types `/wrap`** command
- **User says** "wrap up", "sync spec", "update spec"
- **Before moving to next task** to maintain documentation hygiene

## Workflow

### 1. Identify Completed Tasks

Read `docs/TASK_LIST.json` and find recently completed tasks:

```javascript
// Look for tasks with:
{
  "passes": true,
  "completedAt": "2026-02-13", // Recent date
  "commit": "feat: ..." // Has commit message
}
```

Focus on the **most recently completed task** or ask user which task to sync.

### 2. Analyze Implementation

**Frontend**: Check `apps/frontend/src/`
- Pages: `app/(main)/`, `app/(auth)/`
- Components: `components/`
- Services: `lib/services/`
- Types: `types/`

**Backend**: Check `apps/backend/`
- Controllers: `api/**/controller/`
- DTOs: `api/**/controller/request/`, `api/**/controller/response/`
- Entities: `storage/db/core/entity/`
- Services: `domain/**/service/`

**Verification Checklist**:
- ✅ Code matches task description
- ✅ API endpoints exist in backend controllers
- ✅ Database entities are defined
- ✅ Frontend features are implemented
- ❌ **If mismatch found**: Report conflict and ask for clarification

### 3. Validate Consistency

**Critical Rule**: Only update SPEC.md if code and task description align.

**Conflict Detection**:
- Code implements different behavior than task describes
- API endpoint signature differs from SPEC.md
- Database schema conflicts with existing definition
- Frontend UI differs from spec requirements

**On Conflict**:
```
⚠️ Conflict detected in task #32:
- SPEC.md says: "Default location: Seoul City Hall"
- Code implements: "Default location: Yongsan ITX Station"
- Task description: "Change default location to Yongsan ITX Station"

Should I:
1. Update SPEC.md to match code (Recommended)
2. Keep SPEC.md as-is
3. Update both to align with a new value
```

### 4. Update SPEC.md Sections

Update these sections based on implementation:

#### 2. 핵심 기능 (Core Features)

Add/update feature descriptions discovered during implementation:

```markdown
### 2.2 탐색 기능 (Explore)

#### 위치 권한 처리
- **권한 거부 시**: 5초 타임아웃 후 기본 위치(용산 ITX역: 37.5297, 126.9645) 사용
- **권한 허용 시**: 현재 GPS 위치로 지도 중심 설정
- **현재 위치 표시**: Google Maps 스타일 파란색 원형 마커
```

#### 7. API 엔드포인트 (API Endpoints)

Add new endpoints or update existing ones:

```markdown
### 7.3 아카이브
```
GET    /api/v1/archives/nearby   반경 내 조회 (lat, lng, radius 파라미터)
                                   Query params: latitude, longitude, radiusKm
                                   Response: ArchiveSummary[] (전체 정보 포함)
PATCH  /api/v1/archives/{id}      아카이브 수정
DELETE /api/v1/archives/{id}      아카이브 삭제 (Soft Delete)
```
```

#### 6. 데이터 모델 (Data Model)

Add new entities or update fields:

```markdown
Archive (아카이브 글)
├── id (PK)
├── memberId (FK)
├── content (텍스트)
├── emotion (단일 감정 - EmotionType enum)  # Updated from emotions[]
├── latitude (위도)
├── longitude (경도)
├── locationName (장소명)
├── images (이미지 URL 배열, 최대 5개)  # New field
├── imageUrls (String[], 최대 5개, 파일당 5MB, 전체 20MB)  # New field
├── isPublic (공개 여부)
└── ...
```

### 5. Update SPEC.md Metadata

**IMPORTANT**: Update the document metadata **ONLY IF** SPEC.md content was actually modified in Step 4.

**Decision Logic**:
- ✅ **Content was updated** (sections added/modified in Step 4) → Update 작성일
- ❌ **No content changes** (SPEC.md already current) → Skip metadata update, keep existing date

**When to update**:
```javascript
// If you used Edit/Write tools on SPEC.md in Step 4:
if (specMdContentWasModified) {
  // Update the date to current KST
  Edit({
    file_path: "docs/SPEC.md",
    old_string: "> **작성일**: 2026-01-19",
    new_string: "> **작성일**: 2026-02-15"  // Current KST date
  })
}
// Otherwise: Skip this step entirely
```

**How to calculate Korean time**:
1. Get current date from system context (Today's date is shown in system messages)
2. Use that date directly as it's already in KST
3. Format as YYYY-MM-DD (e.g., 2026-02-15)

**Critical**: Only update metadata if real changes were made. Don't update the date just for verification runs.

### 6. Report Results

After updating SPEC.md, provide a clear summary:

**Example A: Content was updated**
```
✅ SPEC.md updated successfully

Document metadata:
- 작성일: Updated to 2026-02-15 (KST)

Updated sections:
- 2.2 탐색 기능: Added location permission handling details
- 7.3 아카이브 API: Added GET /api/v1/archives/nearby endpoint details
- 6. 데이터 모델: Updated Archive entity with emotion field (복수→단일)

Tasks synced:
- #28: 현재 위치 기반 주변 아카이브 자동 조회 기능 구현
- #29: 주변 아카이브 API 호출 방식 수정
- #30: 주변 아카이브 API 응답 타입 변경 대응

Files analyzed:
- apps/frontend/src/app/(main)/page.tsx
- apps/backend/api/archive/controller/ArchiveController.java
- apps/backend/api/archive/controller/response/ArchiveSummaryResponse.java
```

**Example B: No content changes (verification only)**
```
✅ SPEC.md verification complete

Status: Already up-to-date (no changes made)
Document metadata: Not updated (작성일: 2026-01-19 remains unchanged)

Tasks verified:
- #28: 현재 위치 기반 주변 아카이브 자동 조회 ✅ Already documented
- #29: 주변 아카이브 API 호출 방식 수정 ✅ Already documented
- #30: 주변 아카이브 API 응답 타입 변경 대응 ✅ Already documented

All implementations match SPEC.md. No updates required.
```

## Important Notes

### SSOT Principle

- **SPEC.md = Source of Truth**: But implementation is the reality
- **Conservative Updates**: Only add what's actually implemented in code
- **No Speculation**: Never invent features not present in code
- **Both Domains**: Update for both frontend AND backend changes

### Update Strategy

- **Atomic Updates**: Update related sections together (e.g., API + Data Model + Core Features)
- **Preserve Structure**: Maintain existing SPEC.md formatting and organization
- **Incremental**: Add new information, don't rewrite entire sections unless necessary
- **Version Control**: Changes should be committable (use Edit tool for precise updates)
- **Conditional Metadata Update**: Update document metadata (작성일) **ONLY** when SPEC.md content is modified
  - ✅ Content modified in Step 4 → Update 작성일 to current KST date
  - ❌ No content changes (verification only) → Keep existing 작성일 unchanged
  - Use current date from system context (shown as "Today's date is YYYY-MM-DD")
  - Format: YYYY-MM-DD (Korean Standard Time, KST)
  - Rationale: Date reflects when content was last changed, not when it was last verified

### Conflict Resolution

**Always prioritize code over documentation**:
1. Code is the source of truth for "what's implemented"
2. SPEC.md is the source of truth for "what's intended"
3. When they conflict, ask user to decide

**Never auto-update if**:
- Code conflicts with SPEC.md in a breaking way
- Implementation deviates from original requirements
- Uncertainty exists about intended behavior

## Example Usage

### Example 1: Task #32 (Location Permission Handling)

**User**: `/wrap`

**Skill Actions**:

1. **Identify**: Task #32 completed (passes: true, completedAt: 2026-02-13)
2. **Analyze**:
   - Read `apps/frontend/src/app/(main)/page.tsx`
   - Find location permission handling code
   - Verify default location = Yongsan ITX (37.5297, 126.9645)
3. **Validate**: Code matches task description ✅
4. **Update SPEC.md**:
   - Section 2.2: Add location permission details
   - Section 2.2: Add current location marker details
5. **Update Metadata**: Content was modified → Change 작성일 to 2026-02-13 (KST)
6. **Report**: Show updated sections, metadata change, and files analyzed

### Example 2: Task #26 (Image Upload)

**User**: "wrap up task 26"

**Skill Actions**:

1. **Identify**: Task #26 (이미지 업로드 기능 구현)
2. **Analyze**:
   - Frontend: `components/archive/ImageUploader.tsx`
   - Backend: `ImageController.java`, `ImageUploadRequest.java`
   - Validation: Max 5 images, 5MB per file, 20MB total
3. **Validate**: Code matches task ✅
4. **Update SPEC.md**:
   - Section 2.1: Add image upload constraints
   - Section 6: Add images field to Archive entity
   - Section 7.3: Add image upload endpoint details
5. **Update Metadata**: Content was modified → Change 작성일 to current KST date
6. **Report**: 3 sections updated, metadata updated, 5 files analyzed

### Example 3: Conflict Detection

**User**: `/wrap`

**Skill Actions**:

1. **Identify**: Task #25 (감정 선택 복수→단일)
2. **Analyze**:
   - Frontend: emotion (single)
   - Backend: emotions[] (still array)
   - **Conflict detected** ❌
3. **Report Conflict**:
   ```
   ⚠️ Backend-Frontend mismatch detected:
   - Frontend: Archive type has 'emotion: EmotionType' (single)
   - Backend: Archive entity has 'emotions: List<EmotionType>' (array)

   Cannot update SPEC.md due to inconsistency.
   Please fix backend or confirm frontend should change.
   ```

## File Locations

- **SPEC.md**: `docs/SPEC.md`
- **TASK_LIST.json**: `apps/frontend/docs/TASK_LIST.json`
- **Frontend**: `apps/frontend/src/`
- **Backend**: `apps/backend/`
