---
name: wrap
description: Complete a task and automatically update SPEC.md and API.md to maintain Single Source of Truth (SSOT). Use this skill after implementing features from TASK_LIST.json to sync implementation details back to documentation. Triggers when (1) User types "/wrap" command, (2) User says "wrap up", "sync spec", or "update spec", (3) After completing a task and user wants to sync changes back to docs.
---

# Wrap - Documentation Auto-Update

## Overview

Maintains SPEC.md and API.md as the Single Source of Truth (SSOT) by automatically syncing completed implementations back to documentation. This skill bridges the gap between implementation (frontend/backend code) and documentation in a Spec-Driven Development (SDD) workflow.

**Documentation Files**:
- **SPEC.md**: Service planning document (features, UX, business logic)
- **API.md**: Detailed API specification (endpoints, request/response, examples)

## When to Use

Use this skill after completing a task to ensure SPEC.md stays up-to-date with implementation:

- **After completing a task** from TASK_LIST.json (passes: true)
- **User types `/wrap`** command
- **User says** "wrap up", "sync spec", "update spec"
- **Before moving to next task** to maintain documentation hygiene

## Workflow

**Overview**:
1. Identify completed tasks
2. Analyze implementation
3. Validate consistency
4. **Validate API consistency** ⭐ (Critical - prevents API doc drift)
5. **Validate Data Model consistency** ⭐ (Critical - prevents schema doc drift)
6. **Validate DTO-level Field consistency** ⭐ (Critical - prevents request/response field drift)
7. Update SPEC.md
8. Update API.md (if needed)
9. Update metadata
10. Report results

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

**API Changes Detection**:
- New endpoints added (Controllers)
- Request/Response DTOs modified
- Validation rules changed
- Error responses updated

**Verification Checklist**:
- ✅ Code matches task description
- ✅ API endpoints exist in backend controllers
- ✅ Database entities are defined
- ✅ Frontend features are implemented
- ✅ API.md reflects actual API contracts
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

---

### 3.5. Validate API Consistency (Critical)

**IMPORTANT**: Always verify that SPEC.md Section 7 matches actual backend Controllers.

**Why This Matters**:
- SPEC.md can become outdated
- Initial specs may differ from implementation
- Prevents documentation drift

**Validation Procedure**:

1. **Read all Controllers** to get actual endpoints:
```bash
# Find all controllers and extract @RequestMapping
find apps/backend -name "*Controller.java" | xargs grep -A 1 "@RequestMapping"
```

2. **Extract actual endpoints**:
```
AuthController: /api/v1
UserController: /api/v1/users
ArchiveController: /api/v1/archives
TimeCapsuleController: /api/v1/time-capsule
EmotionController: /api/v1/emotions
```

3. **Compare with SPEC.md Section 7**:
   - Read SPEC.md lines 397-445 (Section 7: API 엔드포인트)
   - For each subsection (7.1 인증, 7.2 회원, etc.):
     - Extract documented endpoints
     - Compare with actual Controller endpoints
     - Check for mismatches

4. **Detect common mismatches**:
   - ❌ Missing `/api/v1` prefix
   - ❌ Wrong path (e.g., `/api/timecapsules` vs `/api/v1/time-capsule`)
   - ❌ Wrong HTTP method (e.g., `PATCH` vs `PUT`)
   - ❌ Missing endpoints (new endpoints not documented)
   - ❌ Deprecated endpoints (documented but removed from code)

5. **Report mismatches**:
```
⚠️ API Consistency Check Failed!

Mismatches found:
1. TimeCapsule endpoints
   - SPEC.md Section 7.5: POST /api/timecapsules
   - Actual Controller: POST /api/v1/time-capsule
   - Issue: Wrong path (missing v1, wrong pluralization)

2. Auth endpoints
   - SPEC.md Section 7.1: POST /api/auth/login
   - Actual Controller: POST /api/v1/login
   - Issue: Wrong base path

3. Missing endpoint
   - Not in SPEC.md
   - Actual Controller: POST /api/v1/token/reIssue
   - Issue: New endpoint not documented

Action required:
1. Update SPEC.md Section 7 to match actual implementation
2. Update API.md with correct endpoints
3. Re-run /wrap after fixing
```

6. **If mismatches found**:
   - ❌ **STOP** - Do not proceed to Step 4
   - Report all mismatches to user
   - Wait for user to decide:
     - Option A: Auto-fix SPEC.md + API.md (Recommended)
     - Option B: User will manually fix
     - Option C: Update Controllers to match docs

7. **If no mismatches** ✅:
   - Proceed to Step 4

**Example Validation**:
```javascript
// Read SPEC.md Section 7.5
SPEC: "POST /api/timecapsules"

// Read TimeCapsuleController.java
@RequestMapping("/api/v1/time-capsule")
@PostMapping
→ Actual: "POST /api/v1/time-capsule"

// Compare
if (spec !== actual) {
  reportMismatch({
    section: "7.5 타임캡슐",
    documented: "POST /api/timecapsules",
    actual: "POST /api/v1/time-capsule",
    severity: "HIGH"
  })
}
```

**Auto-Fix Option**:
If user chooses auto-fix:
1. Update SPEC.md Section 7 with actual endpoints
2. Update API.md with correct endpoints
3. Update metadata dates
4. Generate comprehensive fix report

---

### 3.6. Validate Data Model Consistency (Critical)

**IMPORTANT**: Always verify that SPEC.md Section 6 (데이터 모델) matches actual backend Entities.

**Why This Matters**:
- Data models evolve during implementation
- Field names/types may differ from initial specs
- Relationships may be added or changed
- Prevents schema documentation drift

**Validation Procedure**:

1. **Find all Entity files**:
```bash
# Locate all JPA entities
find apps/backend/domain -path "*/entity/*.java" -type f
```

2. **Read key Entity files**:
```
Archive.java      → apps/backend/domain/.../archive/entity/Archive.java
TimeCapsule.java  → apps/backend/domain/.../capsule/entity/TimeCapsule.java
User.java         → apps/backend/domain/.../user/entity/User.java
ArchiveImage.java → apps/backend/domain/.../archive/entity/ArchiveImage.java
...
```

3. **Extract Entity field information**:
   - Parse `@Column`, `@Id`, `@ManyToOne`, `@Embedded` annotations
   - Field names and Java types
   - Nullability (`nullable = false`)
   - Relationships (FK via `@ManyToOne`, `@OneToMany`)
   - Embedded value objects (`@Embedded`)
   - Enums (`@Enumerated`)
   - Timestamps (`@CreationTimestamp`, `@UpdateTimestamp`)
   - Soft delete fields (`deletedAt`)

4. **Compare with SPEC.md Section 6**:
   - Read SPEC.md lines for Section 6 (데이터 모델)
   - For each entity (Archive, TimeCapsule, User, etc.):
     - Extract documented fields from SPEC.md
     - Compare with actual Entity fields
     - Check for mismatches

5. **Detect common mismatches**:
   - ❌ **Field name differences**: `isPublic` vs `visibility`
   - ❌ **Type differences**: `emotions[]` (array) vs `emotion` (single)
   - ❌ **Missing fields**: New fields in Entity not in SPEC.md
   - ❌ **Deprecated fields**: Fields in SPEC.md but removed from Entity
   - ❌ **Wrong relationships**: `memberId` vs `user (FK to User)`
   - ❌ **Missing @Embedded**: Value objects like `Location`, `Email`, `Password`
   - ❌ **Enum vs String**: `EmotionType` enum vs plain string

6. **Report mismatches**:
```
⚠️ Data Model Consistency Check Failed!

Mismatches found:

1. Archive Entity
   - SPEC.md Section 6: isPublic (Boolean)
   - Actual Entity: visibility (Visibility enum)
   - Issue: Field name and type mismatch

   - SPEC.md Section 6: emotion (EmotionType enum) ✅ CORRECT
   - Actual Entity: emotion (Emotion enum)

   - SPEC.md Section 6: memberId (FK)
   - Actual Entity: user (User, @ManyToOne)
   - Issue: Should document as relationship, not just ID

   - SPEC.md Section 6: latitude, longitude (Double)
   - Actual Entity: location (Location @Embedded), point (Point)
   - Issue: Missing embedded Location object

   - SPEC.md Section 6: Missing field
   - Actual Entity: likeCount (int)
   - Issue: New field not documented

2. TimeCapsule Entity
   - SPEC.md Section 6: status (String)
   - Actual Entity: capsuleStatus (CapsuleStatus enum)
   - Issue: Field name and type mismatch

   - SPEC.md Section 6: Missing field
   - Actual Entity: isNotificationSent (boolean)
   - Issue: New field not documented

3. User Entity
   - SPEC.md Section 6: email (String)
   - Actual Entity: email (Email @Embedded)
   - Issue: Email is a value object, not plain string

   - SPEC.md Section 6: password (String)
   - Actual Entity: password (Password @Embedded)
   - Issue: Password is a value object with validation

Action required:
1. Update SPEC.md Section 6 to match actual Entities
2. Document embedded value objects properly
3. Correct field names and types
4. Re-run /wrap after fixing
```

7. **Entity Field Mapping Examples**:

```java
// Archive.java field → SPEC.md documentation

@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
Long id;
→ "id (PK, Long)"

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id", nullable = false)
User user;
→ "user (FK to User, NOT NULL)"
// ❌ NOT "userId (FK)" or "memberId (FK)"

@Enumerated(EnumType.STRING)
@Column(name = "emotion", nullable = false)
Emotion emotion;
→ "emotion (Emotion enum, NOT NULL)"

@Column(name = "content", nullable = false)
String content;
→ "content (String, NOT NULL)"

@Enumerated(EnumType.STRING)
@Column(name = "visibility", nullable = false)
Visibility visibility;
→ "visibility (Visibility enum: PUBLIC/PRIVATE, NOT NULL)"
// ❌ NOT "isPublic (Boolean)"

@Embedded
Location location;
→ "location (Location @Embedded: latitude, longitude, locationName)"
// ❌ NOT separate "latitude (Double), longitude (Double)"

@Column(name = "like_count")
int likeCount;
→ "likeCount (int, default 0)"

@CreationTimestamp
@Column(name = "created_at", updatable = false, nullable = false)
LocalDateTime createdAt;
→ "createdAt (LocalDateTime, auto-generated, NOT NULL)"

@Column(name = "deleted_at")
LocalDateTime deletedAt;
→ "deletedAt (LocalDateTime, nullable - soft delete)"
```

8. **If mismatches found**:
   - ❌ **STOP** - Do not proceed to Step 4
   - Report all mismatches with side-by-side comparison
   - Wait for user to decide:
     - Option A: Auto-fix SPEC.md Section 6 (Recommended)
     - Option B: User will manually fix
     - Option C: Update Entities to match docs (rarely appropriate)

9. **If no mismatches** ✅:
   - Proceed to Step 4

**Auto-Fix Option**:
If user chooses auto-fix:
1. Read all relevant Entity files completely
2. Extract full field list with types, annotations, relationships
3. Update SPEC.md Section 6 with accurate entity definitions
4. Preserve structure but correct all field mismatches
5. Add comments for complex fields (embedded objects, enums)
6. Generate comprehensive fix report

**Example Auto-Fix Output**:
```markdown
## 6. 데이터 모델

### Archive (아카이브 글)
├── id (PK, Long, auto-increment)
├── user (FK to User, @ManyToOne, NOT NULL)
├── emotion (Emotion enum, NOT NULL)
├── content (String, NOT NULL)
├── visibility (Visibility enum: PUBLIC/PRIVATE, NOT NULL)
├── location (Location @Embedded)
│   ├── latitude (Double)
│   ├── longitude (Double)
│   └── locationName (String)
├── point (Point - PostGIS geometry type)
├── likeCount (int, default 0)
├── createdAt (LocalDateTime, auto-generated)
├── updatedAt (LocalDateTime, auto-updated)
└── deletedAt (LocalDateTime, nullable - soft delete)

### TimeCapsule (타임캡슐)
├── id (PK, Long, auto-increment)
├── user (FK to User, @ManyToOne, NOT NULL)
├── emotion (Emotion enum, NOT NULL)
├── content (String, NOT NULL)
├── location (Location @Embedded)
├── capsuleStatus (CapsuleStatus enum: LOCKED/OPENED, NOT NULL)
├── isNotificationSent (boolean, NOT NULL, default false)
├── openAt (LocalDateTime, NOT NULL - unlock time)
├── createdAt (LocalDateTime, auto-generated)
├── updatedAt (LocalDateTime, auto-updated)
└── deletedAt (LocalDateTime, nullable - soft delete)

### User (회원)
├── id (PK, Long, auto-increment)
├── name (String, NOT NULL)
├── email (Email @Embedded - value object with validation)
├── nickname (Nickname @Embedded - value object)
├── password (Password @Embedded - encrypted)
├── phone (Phone @Embedded - value object)
├── gender (Gender enum: MALE/FEMALE, NOT NULL)
├── birthDate (BirthDate @Embedded)
├── role (Role enum: USER/ADMIN, default USER)
├── status (Status enum: ACTIVE/INACTIVE, default ACTIVE)
├── createdAt (LocalDateTime, auto-generated)
└── updatedAt (LocalDateTime, auto-updated)
```

---

### 3.7. Validate DTO-level Field Consistency (Critical)

**IMPORTANT**: Always verify that API.md request/response body fields match the actual backend Request/Response DTOs and common response wrappers.

**Why This Matters**:
- API.md can document field names that never existed in actual DTOs
- Common wrappers like `PagingResponse` may differ from Spring's default `Page<T>`
- Field names change during development (e.g., `scheduledAt` → `openAt`)
- New fields added to DTOs may not be reflected in API.md

**Validation Procedure**:

1. **Identify endpoints to validate**:
   - Endpoints touched by recently completed tasks
   - Endpoints whose Request or Response DTOs were modified
   - Any endpoint flagged during Steps 3.5 or 3.6

2. **Read common response wrappers** (always check these first):
   ```bash
   # Find PagingResponse and other common wrappers
   find apps/backend/api -name "PagingResponse.java" -o -name "ApiResponse.java"
   ```
   Extract actual field names and compare with API.md's "페이지네이션" section.

3. **For each target endpoint, read its DTOs**:
   ```bash
   # Request DTOs
   find apps/backend/api -path "*/controller/request/*Request.java"
   # Response DTOs
   find apps/backend/api -path "*/controller/response/*Response.java"
   ```

4. **Compare actual DTO fields vs API.md**:

   **For Request DTOs**:
   - Field names (e.g., `openAt` not `scheduledAt`)
   - Required vs optional (`@NotNull`/`@NotBlank` = required)
   - Field types (e.g., `List<Long> imageIds`)
   - Nested object field names (e.g., `locationLabel` not `locationName`)

   **For Response DTOs**:
   - Field names and structure (flat vs nested objects)
   - Fields present in DTO but missing from API.md
   - Fields in API.md but absent from DTO (phantom fields)
   - Nested object structure (e.g., `{ location: { address, latitude, longitude } }`)

5. **Detect common mismatches**:
   - ❌ **Wrong field name**: `scheduledAt` vs `openAt`, `locationName` vs `locationLabel`
   - ❌ **Wrong required/optional**: field marked optional in docs but `@NotNull` in DTO
   - ❌ **Missing field**: `imageIds` in DTO but not in API.md
   - ❌ **Phantom field**: `isLiked` in API.md but not in DTO
   - ❌ **Wrong structure**: flat fields in docs but nested object in DTO
   - ❌ **Wrong wrapper**: Spring `Page<T>` fields instead of `PagingResponse` fields
   - ❌ **Wrong page indexing**: `default: 0` instead of `default: 1` when `setOneIndexedParameters(true)`

6. **Report mismatches**:
   ```
   ⚠️ DTO-level Field Consistency Check Failed!

   Mismatches found:

   1. PagingResponse wrapper (affects all list endpoints)
      API.md: pageable, first, empty, number, numberOfElements, size
      Actual PagingResponse.java: pageNo (1-indexed), pageSize, totalElements, totalPages, last
      Issue: Spring Page<T> fields documented instead of custom PagingResponse

   2. TimeCapsule 작성 Request (POST /api/v1/time-capsule)
      API.md: scheduledAt (required)
      Actual TimeCapsuleRequest.java: openAt (required, @Future)
      Issue: Wrong field name

   3. Archive 수정 Request (PATCH /api/v1/archives/{id})
      API.md: emotion (optional), content (optional)
      Actual ArchiveUpdateRequest.java: emotion (@NotNull), content (@NotBlank)
      Issue: Required fields marked as optional
      Missing in API.md: imageIds (List<Long>)

   4. CommonUserResponse (writer object in all archive responses)
      API.md: "id": 123
      Actual CommonUserResponse.java: userId (Long)
      Issue: Wrong field name

   Action required: Update API.md to match actual DTOs
   ```

7. **If mismatches found**:
   - ❌ **STOP** - Do not proceed to Step 4
   - Report all mismatches with side-by-side comparison
   - Wait for user to decide:
     - Option A: Auto-fix API.md to match DTOs (Recommended)
     - Option B: User will manually fix
     - Option C: Update DTOs to match docs (rarely appropriate)

8. **If no mismatches** ✅:
   - Proceed to Step 4

**Auto-Fix Option**:
If user chooses auto-fix:
1. Read all affected DTO files completely
2. Update API.md request/response body examples to match actual fields
3. Update common section (페이지네이션) if PagingResponse changed
4. Update metadata date
5. Generate fix report

**Key DTOs to always validate** (these are used across many endpoints):

| DTO | Location | Affects |
|-----|----------|---------|
| `PagingResponse<T>` | `api/common/response/PagingResponse.java` | All paginated list endpoints |
| `CommonUserResponse` | `api/archive/controller/response/CommonUserResponse.java` | All archive/capsule responses with writer |
| `LocationDetail` | `api/common/response/LocationDetail.java` | All location-containing responses |
| `LocationRequest` | `api/archive/controller/request/LocationRequest.java` | All location-containing requests |

---

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

---

### 4.5. Update API.md (Hybrid Approach)

**IMPORTANT**: Update API.md **ONLY IF** SPEC.md Section 7 (API 엔드포인트) has changed.

**Workflow**:

1. **Check SPEC.md Section 7 changes** (1st filter)
   - Did Step 4 modify Section 7 (API 엔드포인트)?
   - ✅ Yes → Proceed to step 2
   - ❌ No → Skip API.md update entirely

2. **Identify changed endpoints** (from SPEC.md diff)
   - New endpoints added (e.g., `GET /api/v1/archives/nearby`)
   - Existing endpoints modified (params, response)
   - Endpoints removed

3. **Read detailed specs from backend code** (for changed endpoints only)
   - Controller: `apps/backend/api/**/controller/*Controller.java`
   - Request DTO: `apps/backend/api/**/controller/request/*Request.java`
   - Response DTO: `apps/backend/api/**/controller/response/*Response.java`
   - Extract: HTTP method, path, parameters, validation rules, response schema

4. **Update API.md** with complete documentation

**Example Decision Tree**:
```
SPEC.md Section 7 modified?
├─ YES → API changed
│  ├─ Read ArchiveController.java
│  ├─ Read NearbyArchiveRequest.java
│  ├─ Read ArchiveSummaryResponse.java
│  └─ Update API.md with full spec
│
└─ NO → API unchanged
   └─ Skip API.md update
```

**What to update in API.md**:

#### New Endpoint Added
Add complete endpoint documentation:
```markdown
### X. [Endpoint Title]

**Endpoint**
```
[METHOD] /api/v1/[path]
```

**인증 필요**: ✅/❌

**Request Body**
```json
{
  "field": "type (required/optional, validation rules)"
}
```

**Response (200 OK)**
```json
{
  "field": "value"
}
```

**Status Codes**
- `200 OK`: Success description
- `400 Bad Request`: Validation failure
...
```

#### Request/Response Modified
Update the relevant endpoint's Request or Response section with new fields or changed types.

#### Validation Rules Changed
Update validation rules in Request Body description:
```json
{
  "password": "string (required, 8-20자)",  // Updated from 8-16자
  "nickname": "string (required, 최대 20자)"  // Updated from 최대 10자
}
```

#### Example Updates
```markdown
**Before**:
```json
{
  "emotions": ["HAPPY", "SAD"]  // Array
}
```

**After**:
```json
{
  "emotion": "HAPPY"  // Single value
}
```
```

**Update procedure (Hybrid)**:
1. **Check SPEC.md Section 7**: Did Step 4 modify any API endpoints?
2. **If YES**:
   - Identify which endpoints changed (added/modified/removed)
   - For each changed endpoint:
     - Read corresponding Controller (e.g., `ArchiveController.java`)
     - Read Request DTO (e.g., `ArchiveRequest.java`)
     - Read Response DTO (e.g., `ArchiveSummaryResponse.java`)
     - Extract validation rules from annotations (`@NotBlank`, `@Size`, etc.)
   - Use Edit tool to update corresponding sections in `docs/API.md`
   - Update "최종 업데이트" date in API.md header
3. **If NO**: Skip API.md update entirely

**Why Hybrid?**
- ✅ SPEC.md Section 7 = 1st filter (fast detection)
- ✅ Backend code = Source of detailed specs (accuracy)
- ✅ Only analyze changed endpoints (efficiency)

---

### 5. Update Documentation Metadata

**IMPORTANT**: Update metadata **ONLY IF** the respective document was actually modified.

**Decision Logic**:
- ✅ **SPEC.md modified** (Step 4) → Update SPEC.md 작성일
- ✅ **API.md modified** (Step 4.5) → Update API.md 최종 업데이트
- ❌ **No changes** → Skip metadata update, keep existing dates

**SPEC.md Metadata Update**:
```javascript
// If you used Edit/Write tools on SPEC.md in Step 4:
if (specMdContentWasModified) {
  Edit({
    file_path: "docs/SPEC.md",
    old_string: "> **작성일**: 2026-01-19",
    new_string: "> **작성일**: 2026-02-15"  // Current KST date
  })
}
```

**API.md Metadata Update**:
```javascript
// If you used Edit/Write tools on API.md in Step 4.5:
if (apiMdContentWasModified) {
  Edit({
    file_path: "docs/API.md",
    old_string: "> **최종 업데이트**: 2026-01-19",
    new_string: "> **최종 업데이트**: 2026-02-15"  // Current KST date
  })
}
```

**How to calculate Korean time**:
1. Get current date from system context (Today's date is shown in system messages)
2. Use that date directly as it's already in KST
3. Format as YYYY-MM-DD (e.g., 2026-02-15)

**Critical**: Only update metadata if real changes were made. Don't update dates just for verification runs.

### 6. Report Results

After updating documentation, provide a clear summary:

**Example A: Both SPEC.md and API.md updated**
```
✅ Documentation updated successfully

SPEC.md:
- 작성일: Updated to 2026-02-15 (KST)
- Updated sections:
  - 2.2 탐색 기능: Added location permission handling details
  - 6. 데이터 모델: Updated Archive entity with emotion field (복수→단일)

API.md:
- 최종 업데이트: Updated to 2026-02-15 (KST)
- Updated endpoints:
  - GET /api/v1/archives/nearby: Added query params, response schema
  - PATCH /api/v1/archives/{id}: Updated request validation rules

Tasks synced:
- #28: 현재 위치 기반 주변 아카이브 자동 조회 기능 구현
- #29: 주변 아카이브 API 호출 방식 수정
- #30: 주변 아카이브 API 응답 타입 변경 대응

Files analyzed:
- apps/frontend/src/app/(main)/page.tsx
- apps/backend/api/archive/controller/ArchiveController.java
- apps/backend/api/archive/controller/response/ArchiveSummaryResponse.java
```

**Example B: Only SPEC.md updated (no API changes)**
```
✅ SPEC.md updated successfully

SPEC.md:
- 작성일: Updated to 2026-02-15 (KST)
- Updated sections:
  - 2.2 탐색 기능: Added location permission handling details

API.md:
- Not updated (no API changes detected)

Tasks synced:
- #31: 현재 위치 마커 지도에 표시 (Frontend-only feature)

Files analyzed:
- apps/frontend/components/map/KakaoMap.tsx
```

**Example C: Only API.md updated (API changes only)**
```
✅ API.md updated successfully

SPEC.md:
- Not updated (features already documented)

API.md:
- 최종 업데이트: Updated to 2026-02-15 (KST)
- Updated endpoints:
  - POST /api/v1/archives/{id}/images: Added file size constraints
  - Response schemas updated with new fields

Tasks synced:
- #26: 아카이브 이미지 업로드 기능 구현

Files analyzed:
- apps/backend/api/archive/controller/ArchiveController.java
- apps/backend/api/archive/controller/request/ImageUploadRequest.java
```

**Example D: No content changes (verification only)**
```
✅ Documentation verification complete

Status: Already up-to-date (no changes made)

SPEC.md:
- 작성일: 2026-02-14 (unchanged)

API.md:
- 최종 업데이트: 2026-02-15 (unchanged)

Tasks verified:
- #28: 현재 위치 기반 주변 아카이브 자동 조회 ✅ Already documented
- #29: 주변 아카이브 API 호출 방식 수정 ✅ Already documented
- #30: 주변 아카이브 API 응답 타입 변경 대응 ✅ Already documented

All implementations match documentation. No updates required.
```

## Important Notes

### SSOT Principle

- **SPEC.md = Service Planning Truth**: Features, UX, business logic
- **API.md = API Contract Truth**: Detailed endpoint specifications for developers
- **Implementation = Reality**: Code is the ultimate source of "what's actually done"
- **Conservative Updates**: Only add what's actually implemented in code
- **No Speculation**: Never invent features not present in code
- **Both Domains**: Update for both frontend AND backend changes

### Update Strategy

- **Atomic Updates**: Update related sections together (e.g., SPEC.md feature + API.md endpoint + Data Model)
- **Preserve Structure**: Maintain existing formatting and organization in both documents
- **Incremental**: Add new information, don't rewrite entire sections unless necessary
- **Version Control**: Changes should be committable (use Edit tool for precise updates)
- **Dual Documentation**:
  - SPEC.md: High-level features and business requirements
  - API.md: Low-level technical API specifications
  - Update both when API changes involve new features
- **Conditional Metadata Update**: Update metadata **ONLY** when content is modified
  - ✅ SPEC.md modified → Update 작성일 to current KST date
  - ✅ API.md modified → Update 최종 업데이트 to current KST date
  - ❌ No content changes (verification only) → Keep existing dates unchanged
  - Use current date from system context (shown as "Today's date is YYYY-MM-DD")
  - Format: YYYY-MM-DD (Korean Standard Time, KST)
  - Rationale: Dates reflect when content was last changed, not when it was last verified

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

### Example 1: Task #32 (Frontend-only feature, no API changes)

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
   - Section 7 (API 엔드포인트): **Not modified** ❌
5. **Update API.md** (Hybrid approach):
   - **Step 1**: SPEC.md Section 7 was NOT modified ❌
   - **Decision**: Skip API.md update entirely
6. **Update Metadata**:
   - SPEC.md 작성일: Updated to 2026-02-13 (KST)
   - API.md 최종 업데이트: **Not updated** (no API changes)
7. **Report**: SPEC.md updated, API.md skipped (frontend-only feature)

### Example 2: Task #26 (Image Upload - with API changes)

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
   - Section 7.3: Add `POST /api/v1/archives/{id}/images` endpoint
5. **Update API.md** (Hybrid approach):
   - **Step 1**: SPEC.md Section 7.3 was modified ✅ → Proceed
   - **Step 2**: Identify changed endpoint: `POST /api/v1/archives/{id}/images`
   - **Step 3**: Read backend code:
     - `ArchiveController.java` → HTTP POST, multipart/form-data
     - No explicit Request DTO (uses `List<MultipartFile>`)
     - `ArchiveImageResponse.java` → Response schema
   - **Step 4**: Update API.md Section 3.7 with:
     - Full endpoint documentation
     - Request format (multipart/form-data)
     - File constraints (5개, 5MB, 20MB)
     - Response schema with example
     - Error codes (400, 413)
6. **Update Metadata**:
   - SPEC.md 작성일: Updated to current KST
   - API.md 최종 업데이트: Updated to current KST
7. **Report**: SPEC.md (3 sections) + API.md (1 endpoint) updated

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

---

### Example 4: API Consistency Check (Auto-detection)

**User**: `/wrap`

**Skill Actions**:

1. **Identify**: No specific task (routine check)
2. **Analyze**: Skip (no new tasks)
3. **Validate Consistency**: Pass
4. **Validate API Consistency** ⭐:
   - Read all Controllers:
     ```
     AuthController: /api/v1
     UserController: /api/v1/users
     ArchiveController: /api/v1/archives
     TimeCapsuleController: /api/v1/time-capsule
     ```
   - Read SPEC.md Section 7:
     ```
     7.1 인증: POST /api/auth/login     ❌
     7.2 회원: POST /api/auth/signup    ❌
     7.5 타임캡슐: POST /api/timecapsules  ❌
     ```
   - **Mismatches detected** ❌

5. **Report API Mismatches**:
   ```
   ⚠️ API Consistency Check Failed!

   Found 3 mismatches between SPEC.md and actual Controllers:

   1. Section 7.1 (인증)
      SPEC.md: POST /api/auth/login
      Actual:  POST /api/v1/login
      Issue:   Wrong base path (missing v1)

   2. Section 7.2 (회원)
      SPEC.md: POST /api/auth/signup
      Actual:  POST /api/v1/users
      Issue:   Wrong base path + endpoint name

   3. Section 7.5 (타임캡슐)
      SPEC.md: POST /api/timecapsules
      Actual:  POST /api/v1/time-capsule
      Issue:   Missing v1 prefix + wrong pluralization

   ⚠️ Cannot proceed with SPEC.md/API.md updates until API docs are fixed.

   Options:
   1. Auto-fix (Recommended): Update SPEC.md + API.md to match Controllers
   2. Manual fix: I'll wait for you to update docs
   3. Update Controllers: Change backend to match docs (not recommended)

   Which option would you like?
   ```

6. **If user chooses Option 1 (Auto-fix)**:
   - Update SPEC.md Section 7 with correct endpoints
   - Update API.md with correct endpoints (replace all occurrences)
   - Update metadata dates
   - Report:
     ```
     ✅ Auto-fix completed!

     SPEC.md:
     - Section 7.1: POST /api/auth/login → POST /api/v1/login
     - Section 7.2: POST /api/auth/signup → POST /api/v1/users
     - Section 7.5: POST /api/timecapsules → POST /api/v1/time-capsule
     - 작성일: Updated to 2026-02-15

     API.md:
     - 12 endpoint paths corrected
     - 최종 업데이트: Updated to 2026-02-15

     All documentation now matches actual Controllers ✅
     ```

---

### Example 5: Data Model Consistency Check (Auto-detection)

**User**: `/wrap`

**Skill Actions**:

1. **Identify**: No specific task (routine check)
2. **Analyze**: Skip (no new tasks)
3. **Validate Consistency**: Pass
4. **Validate API Consistency**: Pass ✅
5. **Validate Data Model Consistency** ⭐:
   - Find Entity files:
     ```bash
     find apps/backend/domain -path "*/entity/*.java" -type f
     ```
   - Read key Entities:
     - `Archive.java`
     - `TimeCapsule.java`
     - `User.java`
   - Extract Entity fields and compare with SPEC.md Section 6:

   **Archive Entity Analysis**:
   ```java
   // Actual Entity (Archive.java)
   @ManyToOne
   User user;                              // FK relationship

   @Enumerated(EnumType.STRING)
   Visibility visibility;                  // Enum: PUBLIC/PRIVATE

   @Embedded
   Location location;                      // Embedded object

   int likeCount;                          // New field
   ```

   ```markdown
   // SPEC.md Section 6 (documented)
   ├── memberId (FK)                       ❌ Should be: user (FK to User)
   ├── isPublic (Boolean)                  ❌ Should be: visibility (Visibility enum)
   ├── latitude (Double)                   ❌ Should be: location (Location @Embedded)
   ├── longitude (Double)                  ❌ Part of Location @Embedded
   ├── Missing: likeCount                  ❌ New field not documented
   ```

   **TimeCapsule Entity Analysis**:
   ```java
   // Actual Entity (TimeCapsule.java)
   @Enumerated(EnumType.STRING)
   CapsuleStatus capsuleStatus;            // Enum: LOCKED/OPENED

   boolean isNotificationSent;             // New field
   ```

   ```markdown
   // SPEC.md Section 6 (documented)
   ├── status (String)                     ❌ Should be: capsuleStatus (CapsuleStatus enum)
   ├── Missing: isNotificationSent         ❌ New field not documented
   ```

   **User Entity Analysis**:
   ```java
   // Actual Entity (User.java)
   @Embedded
   Email email;                            // Value object

   @Embedded
   Password password;                      // Value object (encrypted)

   @Embedded
   Phone phone;                            // Value object
   ```

   ```markdown
   // SPEC.md Section 6 (documented)
   ├── email (String)                      ❌ Should be: email (Email @Embedded)
   ├── password (String)                   ❌ Should be: password (Password @Embedded)
   ├── phone (String)                      ❌ Should be: phone (Phone @Embedded)
   ```

6. **Report Data Model Mismatches**:
   ```
   ⚠️ Data Model Consistency Check Failed!

   Found 11 mismatches between SPEC.md Section 6 and actual Entities:

   1. Archive Entity (5 issues)
      a. Field name mismatch:
         SPEC.md: memberId (FK)
         Actual:  user (User, @ManyToOne)
         Fix:     Document as relationship, not just ID

      b. Field name + type mismatch:
         SPEC.md: isPublic (Boolean)
         Actual:  visibility (Visibility enum: PUBLIC/PRIVATE)
         Fix:     Update to match enum field

      c. Embedded object not documented:
         SPEC.md: latitude (Double), longitude (Double)
         Actual:  location (Location @Embedded) containing lat/lng/name
         Fix:     Document as embedded object with nested fields

      d. Missing field:
         SPEC.md: (not documented)
         Actual:  likeCount (int, default 0)
         Fix:     Add missing field

      e. Missing field:
         SPEC.md: (not documented)
         Actual:  point (Point - PostGIS geometry type)
         Fix:     Add PostGIS field for spatial queries

   2. TimeCapsule Entity (2 issues)
      a. Field name + type mismatch:
         SPEC.md: status (String)
         Actual:  capsuleStatus (CapsuleStatus enum: LOCKED/OPENED)
         Fix:     Update to enum type

      b. Missing field:
         SPEC.md: (not documented)
         Actual:  isNotificationSent (boolean, NOT NULL, default false)
         Fix:     Add notification tracking field

   3. User Entity (4 issues)
      a-c. Value objects not documented:
         SPEC.md: email (String), password (String), phone (String)
         Actual:  All are @Embedded value objects with validation
         Fix:     Document as value objects, not plain strings

      d. Additional value object:
         SPEC.md: birthDate (LocalDate)
         Actual:  birthDate (BirthDate @Embedded)
         Fix:     Update to value object

   ⚠️ Cannot proceed with SPEC.md updates until data model docs are fixed.

   Options:
   1. Auto-fix (Recommended): Update SPEC.md Section 6 to match Entities
   2. Manual fix: I'll wait for you to update Section 6
   3. Update Entities: Change backend to match docs (rarely appropriate)

   Which option would you like?
   ```

7. **If user chooses Option 1 (Auto-fix)**:
   - Read all Entity files completely
   - Extract full field definitions with JPA annotations
   - Update SPEC.md Section 6 with accurate structure
   - Use proper formatting for embedded objects, enums, relationships
   - Update metadata date
   - Report:
     ```
     ✅ Auto-fix completed!

     SPEC.md Section 6 updated:

     Archive Entity:
     - memberId (FK) → user (FK to User, @ManyToOne)
     - isPublic (Boolean) → visibility (Visibility enum: PUBLIC/PRIVATE)
     - latitude, longitude → location (Location @Embedded)
     - Added: likeCount (int, default 0)
     - Added: point (Point - PostGIS geometry)

     TimeCapsule Entity:
     - status (String) → capsuleStatus (CapsuleStatus enum)
     - Added: isNotificationSent (boolean, default false)

     User Entity:
     - email (String) → email (Email @Embedded)
     - password (String) → password (Password @Embedded)
     - phone (String) → phone (Phone @Embedded)
     - birthDate (LocalDate) → birthDate (BirthDate @Embedded)

     SPEC.md:
     - 작성일: Updated to 2026-02-15

     All data model documentation now matches actual Entities ✅
     ```

---

## File Locations

- **SPEC.md**: `docs/SPEC.md` (Service planning document)
- **API.md**: `docs/API.md` (API specification document)
- **TASK_LIST.json**: `apps/frontend/docs/TASK_LIST.json`
- **Frontend**: `apps/frontend/src/`
- **Backend**: `apps/backend/`
  - Controllers: `apps/backend/api/src/main/java/com/feelarchive/api/**/controller/`
  - Request DTOs: `apps/backend/api/src/main/java/com/feelarchive/api/**/controller/request/`
  - Response DTOs: `apps/backend/api/src/main/java/com/feelarchive/api/**/controller/response/`
  - Entities: `apps/backend/domain/src/main/java/com/feelarchive/domain/**/entity/`
    - Archive: `apps/backend/domain/src/main/java/com/feelarchive/domain/archive/entity/Archive.java`
    - TimeCapsule: `apps/backend/domain/src/main/java/com/feelarchive/domain/capsule/entity/TimeCapsule.java`
    - User: `apps/backend/domain/src/main/java/com/feelarchive/domain/user/entity/User.java`
    - Others: ArchiveImage, ArchiveLike, ArchiveScrap, FileMeta, Notification, etc.
