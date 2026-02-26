# Feel-Archive API 문서

> **최종 업데이트**: 2026-02-26
> **Base URL**: `http://localhost:8080` (개발)
> **API 버전**: v1
>
> ⚠️ **중요**: 모든 엔드포인트는 `/api/v1` prefix를 사용합니다.

---

## 목차

- [개요](#개요)
- [인증 (Authentication)](#인증-authentication)
- [회원 (User)](#회원-user)
- [아카이브 (Archive)](#아카이브-archive)
- [좋아요/스크랩 (Like/Scrap)](#좋아요스크랩-likescrap)
- [타임캡슐 (TimeCapsule)](#타임캡슐-timecapsule)
- [알림 (Notification)](#알림-notification)
- [실시간 감정 날씨 (Emotion Weather)](#실시간-감정-날씨-emotion-weather)
- [리포트 (Report)](#리포트-report)
- [공통 사항](#공통-사항)

---

## 개요

### Base URL
```
http://localhost:8080
```

### 인증 방식
- **JWT Bearer Token** (Access Token)
- **HttpOnly Cookie** (Refresh Token)

### 공통 Request Headers
```http
Content-Type: application/json
Authorization: Bearer {accessToken}
```

### 공통 Response Format
성공 시 각 엔드포인트별로 정의된 응답 반환
에러 시 [에러 응답 형식](#에러-응답-형식) 참고

---

## 인증 (Authentication)

### 1. 로그인

사용자 인증 후 Access Token과 Refresh Token을 발급합니다.

**Endpoint**
```
POST /api/v1/login
```

**인증 필요**: ❌ No

**Request Body**
```json
{
  "email": "string (required, email format)",
  "password": "string (required)"
}
```

**Request Example**
```http
POST /api/v1/login HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK)**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Headers**
```http
Set-Cookie: refreshToken={token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
```

**Status Codes**
- `200 OK`: 로그인 성공
- `400 Bad Request`: 유효성 검증 실패 (이메일 형식, 필수 필드 누락)
- `401 Unauthorized`: 이메일 또는 비밀번호 불일치

**Error Example**
```json
{
  "message": "이메일을 입력해주세요.",
  "status": 400
}
```

---

### 2. 로그아웃

Refresh Token을 무효화하고 쿠키를 삭제합니다.

**Endpoint**
```
DELETE /api/v1/logout
```

**인증 필요**: ✅ Yes (Refresh Token in Cookie)

**Request Cookies**
```
refreshToken={token}
```

**Request Example**
```http
DELETE /api/v1/logout HTTP/1.1
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```http
200 OK
Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0
```

**Status Codes**
- `200 OK`: 로그아웃 성공
- `401 Unauthorized`: Refresh Token 없음 또는 유효하지 않음

---

### 3. 토큰 재발급

Refresh Token을 사용하여 새로운 Access Token과 Refresh Token을 발급합니다.

**Endpoint**
```
POST /api/v1/token/reIssue
```

**인증 필요**: ✅ Yes (Refresh Token in Cookie)

**Request Cookies**
```
refreshToken={token}
```

**Request Example**
```http
POST /api/v1/token/reIssue HTTP/1.1
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Headers**
```http
Set-Cookie: refreshToken={newToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
```

**Status Codes**
- `200 OK`: 토큰 재발급 성공
- `401 Unauthorized`: Refresh Token 만료 또는 유효하지 않음

---

## 회원 (User)

### 1. 회원가입

새로운 사용자를 등록합니다.

**Endpoint**
```
POST /api/v1/users
```

**인증 필요**: ❌ No

**Request Body**
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "password": "string (required, 8-20자)",
  "phone": "string (required, 010으로 시작하는 11자리)",
  "nickname": "string (required, 최대 20자)",
  "gender": "MALE | FEMALE (required)",
  "birthDate": "string (required, YYYY-MM-DD)"
}
```

**Validation Rules**
- `email`: 이메일 형식 검증
- `password`: 8자 이상 20자 이하
- `phone`: 정규식 `^010\d{8}$` (예: 01012345678)
- `nickname`: 최대 20자
- `gender`: `MALE` 또는 `FEMALE`
- `birthDate`: ISO 8601 날짜 형식 (YYYY-MM-DD)

**Request Example**
```http
POST /api/v1/users HTTP/1.1
Content-Type: application/json

{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "password123",
  "phone": "01012345678",
  "nickname": "길동이",
  "gender": "MALE",
  "birthDate": "1990-01-01"
}
```

**Response (201 Created)**
```http
201 Created
Location: /api/v1/users/123
```

**Status Codes**
- `201 Created`: 회원가입 성공 (Location 헤더에 생성된 리소스 URL 포함)
- `400 Bad Request`: 유효성 검증 실패
- `409 Conflict`: 이미 존재하는 이메일

**Error Example (400)**
```json
{
  "message": "비밀번호는 8자 이상 20자 이하로 입력해주세요.",
  "status": 400
}
```

**Error Example (409)**
```json
{
  "message": "이미 가입된 이메일입니다.",
  "status": 409
}
```

---

### 2. 회원 정보 조회

특정 사용자의 정보를 조회합니다.

**Endpoint**
```
GET /api/v1/users/{id}
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 사용자 ID

**Request Example**
```http
GET /api/v1/users/123 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
{
  "id": 123,
  "name": "홍길동",
  "email": "hong@example.com",
  "nickname": "길동이",
  "gender": "MALE",
  "birthDate": "1990-01-01",
  "createdAt": "2026-01-15T10:30:00"
}
```

**Status Codes**
- `200 OK`: 조회 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `404 Not Found`: 존재하지 않는 사용자 ID

---

## 아카이브 (Archive)

### 1. 아카이브 작성

새로운 아카이브를 작성합니다.

**Endpoint**
```
POST /api/v1/archives
```

**인증 필요**: ✅ Yes (Bearer Token)

**Request Body**
```json
{
  "emotion": "HAPPY | SAD | ANXIOUS | ANGRY | CALM | EXCITED | LONELY | GRATEFUL | TIRED (required)",
  "content": "string (required)",
  "visibility": "PUBLIC | PRIVATE (required)",
  "location": {
    "latitude": "number (BigDecimal, optional)",
    "longitude": "number (BigDecimal, optional)",
    "locationLabel": "string (optional) - 사용자 메모 또는 역지오코딩 주소"
  }
}
```

**Request Example**
```http
POST /api/v1/archives HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "emotion": "HAPPY",
  "content": "오늘 정말 행복한 하루였다!",
  "visibility": "PUBLIC",
  "location": {
    "latitude": 37.5665,
    "longitude": 126.9780,
    "locationLabel": "서울시청"
  }
}
```

**Response (201 Created)**
```http
201 Created
Location: /api/v1/archives/456
```

**Status Codes**
- `201 Created`: 작성 성공 (Location 헤더에 생성된 리소스 URL)
- `400 Bad Request`: 유효성 검증 실패 (필수 필드 누락, 감정/공개 설정 누락)
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

---

### 2. 아카이브 목록 조회

공개된 아카이브 목록을 조회합니다 (페이지네이션 지원).

**Endpoint**
```
GET /api/v1/archives
```

**인증 필요**: ✅ Yes (Bearer Token)

**Query Parameters**
- `page` (int, optional, default: 1): 페이지 번호 (1부터 시작)
- `size` (int, optional, default: 20): 페이지 크기
- `emotion` (string, optional): 감정 필터 (`HAPPY | SAD | ANXIOUS | ANGRY | CALM | EXCITED | LONELY | GRATEFUL | TIRED`)
- `keyword` (string, optional): 내용 검색 키워드
- `sortType` (string, optional, default: `LATEST`): 정렬 기준 (`LATEST` | `OLDEST` | `POPULAR` | `VIEWS`)

**Request Example**
```http
GET /api/v1/archives?page=1&size=10&emotion=HAPPY&keyword=서울&sortType=LATEST HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
{
  "content": [
    {
      "archiveId": 456,
      "emotion": "HAPPY",
      "contentPreview": "오늘 정말 행복한 하루였다!",
      "latitude": 37.5665,
      "longitude": 126.9780,
      "address": "서울특별시 중구 세종대로 110",
      "createdAt": "2026-02-15T14:30:00",
      "likeCount": 5,
      "isLiked": false,
      "isScraped": true,
      "writer": {
        "userId": 123,
        "nickname": "길동이"
      }
    }
  ],
  "pageNo": 1,
  "pageSize": 10,
  "totalElements": 100,
  "totalPages": 10,
  "last": false
}
```

**Status Codes**
- `200 OK`: 조회 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

---

### 3. 아카이브 상세 조회

특정 아카이브의 상세 정보를 조회합니다.

**Endpoint**
```
GET /api/v1/archives/{id}
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 아카이브 ID

**Request Example**
```http
GET /api/v1/archives/456 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
{
  "archiveId": 456,
  "emotion": "HAPPY",
  "content": "오늘 정말 행복한 하루였다! 친구들과 함께한 시간이 너무 즐거웠어요.",
  "visibility": "PUBLIC",
  "location": {
    "address": "서울시청",
    "latitude": 37.5665,
    "longitude": 126.9780
  },
  "images": [
    {
      "id": 1,
      "url": "/api/v1/archives/456/images/1"
    }
  ],
  "likeCount": 5,
  "isOwner": true,
  "isLiked": false,
  "isScraped": true,
  "writer": {
    "userId": 123,
    "nickname": "길동이"
  },
  "createdAt": "2026-02-15T14:30:00",
  "updatedAt": "2026-02-15T14:30:00"
}
```

**참고사항**
- `location.address`: 사용자가 입력한 위치 메모 (locationLabel). 미입력 시 역지오코딩 주소가 저장됨.

**Status Codes**
- `200 OK`: 조회 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 비공개 아카이브에 대한 접근 권한 없음
- `404 Not Found`: 존재하지 않는 아카이브 ID

---

### 4. 주변 아카이브 조회 (GIS)

현재 위치 기준 반경 내의 아카이브를 조회합니다.

**Endpoint**
```
GET /api/v1/archives/nearby
```

**인증 필요**: ✅ Yes (Bearer Token)

**Query Parameters**
- `latitude` (BigDecimal, required): 위도
- `longitude` (BigDecimal, required): 경도
- `radius` (Double, optional, default: 50.0): 반경 (km)

**Request Example**
```http
GET /api/v1/archives/nearby?latitude=37.5665&longitude=126.9780&radius=10 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
[
  {
    "archiveId": 456,
    "emotion": "HAPPY",
    "contentPreview": "오늘 정말 행복한 하루였다!",
    "latitude": 37.5665,
    "longitude": 126.9780,
    "address": "서울특별시 중구 세종대로 110",
    "createdAt": "2026-02-15T14:30:00",
    "likeCount": 5,
    "isLiked": false,
    "isScraped": false,
    "writer": {
      "userId": 123,
      "nickname": "길동이"
    }
  }
]
```

**Status Codes**
- `200 OK`: 조회 성공 (결과 없으면 빈 배열 반환)
- `400 Bad Request`: 위도/경도 파라미터 누락 또는 형식 오류
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

**참고사항**
- 기본 반경은 50km입니다
- GIS 공간 쿼리를 사용하여 성능 최적화되어 있습니다
- 반환되는 아카이브는 모두 공개(PUBLIC) 상태입니다

---

### 5. 내 아카이브 목록 조회

본인이 작성한 아카이브 목록을 조회합니다 (비공개 글 포함).

**Endpoint**
```
GET /api/v1/archives/me
```

**인증 필요**: ✅ Yes (Bearer Token)

**Query Parameters**
- `page` (int, optional, default: 1): 페이지 번호 (1부터 시작)
- `size` (int, optional, default: 20): 페이지 크기
- `emotion` (string, optional): 감정 필터 (`HAPPY | SAD | ANXIOUS | ANGRY | CALM | EXCITED | LONELY | GRATEFUL | TIRED`)
- `keyword` (string, optional): 내용 검색 키워드
- `sortType` (string, optional, default: `LATEST`): 정렬 기준 (`LATEST` | `OLDEST` | `POPULAR` | `VIEWS`)

**Request Example**
```http
GET /api/v1/archives/me?page=1&size=10&emotion=HAPPY&sortType=LATEST HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
응답 형식은 아카이브 목록 조회와 동일 (ArchiveSummaryResponse Page)

**Status Codes**
- `200 OK`: 조회 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

---

### 6. 아카이브 상태 변경 (공개/비공개)

아카이브의 공개 상태(visibility)를 변경합니다.

**Endpoint**
```
PATCH /api/v1/archives/{archiveId}/status
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `archiveId` (Long, required): 아카이브 ID

**Request Body**
```json
{
  "visibility": "PUBLIC | PRIVATE (required)"
}
```

**Request Example**
```http
PATCH /api/v1/archives/456/status HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "visibility": "PRIVATE"
}
```

**Response (200 OK)**
```http
200 OK
```

**Status Codes**
- `200 OK`: 상태 변경 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인이 작성한 아카이브가 아님
- `404 Not Found`: 존재하지 않는 아카이브 ID

---

### 7. 아카이브 수정

자신이 작성한 아카이브를 수정합니다.

**Endpoint**
```
PATCH /api/v1/archives/{id}
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 아카이브 ID

**Request Body**
```json
{
  "emotion": "HAPPY | SAD | ANXIOUS | ANGRY | CALM | EXCITED | LONELY | GRATEFUL | TIRED (required)",
  "content": "string (required)",
  "visibility": "PUBLIC | PRIVATE (required)",
  "location": {
    "latitude": "number (BigDecimal, optional)",
    "longitude": "number (BigDecimal, optional)",
    "locationLabel": "string (optional) - 사용자 메모 또는 역지오코딩 주소"
  },
  "imageIds": [1, 2, 3]
}
```

**Validation Rules**
- `emotion`, `content`, `visibility`: 필수
- `location`: 선택 (생략 시 위치 정보 유지)
- `imageIds`: 선택 (최종 연결할 이미지 ID 목록. 생략 시 기존 이미지 유지. 빈 배열([]) 전달 시 모든 이미지 제거)

**이미지 수정 플로우 (지연 연결 방식)**
1. 신규 추가 이미지를 먼저 `POST /archives/{id}/images`로 업로드하여 ID 획득
2. 기존 유지할 imageId + 신규 imageId를 합산한 목록을 PATCH 요청에 포함
3. 백엔드 `syncImages()`가 최종 목록 기준으로 이미지 연결/삭제 일괄 처리

**Request Example**
```http
PATCH /api/v1/archives/456 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "emotion": "CALM",
  "content": "수정된 내용입니다.",
  "visibility": "PRIVATE",
  "imageIds": [1, 3]
}
```

**Response (200 OK)**
```json
{
  "archiveId": 456,
  "emotion": "CALM",
  "content": "수정된 내용입니다.",
  "visibility": "PRIVATE",
  "location": {
    "address": "서울시청",
    "latitude": 37.5665,
    "longitude": 126.9780
  },
  "images": [
    {
      "id": 1,
      "url": "/api/v1/archives/456/images/1"
    }
  ],
  "likeCount": 5,
  "isOwner": true,
  "isLiked": false,
  "isScraped": false,
  "writer": {
    "userId": 123,
    "nickname": "길동이"
  },
  "createdAt": "2026-02-15T14:30:00",
  "updatedAt": "2026-02-19T10:00:00"
}
```

**Status Codes**
- `200 OK`: 수정 성공 (수정된 아카이브 상세 반환)
- `400 Bad Request`: 유효성 검증 실패 (필수 필드 누락)
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인이 작성한 아카이브가 아님
- `404 Not Found`: 존재하지 않는 아카이브 ID

---

### 8. 아카이브 삭제 (Soft Delete)

자신이 작성한 아카이브를 삭제합니다 (논리적 삭제).

**Endpoint**
```
DELETE /api/v1/archives/{id}
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 아카이브 ID

**Request Example**
```http
DELETE /api/v1/archives/456 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (204 No Content)**
```http
204 No Content
```

**Status Codes**
- `204 No Content`: 삭제 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인이 작성한 아카이브가 아님
- `404 Not Found`: 존재하지 않는 아카이브 ID

**참고사항**
- Soft Delete 방식으로 `deletedAt` 필드만 업데이트됩니다
- 물리적 삭제는 배치 작업으로 처리됩니다

---

### 9. 아카이브 이미지 업로드

아카이브에 이미지를 업로드합니다 (최대 5개).

**Endpoint**
```
POST /api/v1/archives/{id}/images
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 아카이브 ID

**Request Headers**
```http
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data)**
```
images: [파일1, 파일2, ...] (최대 5개)
```

**제약사항**
- 파일당 최대 크기: 5MB
- 전체 파일 크기: 최대 20MB
- 최대 개수: 5개
- 허용 형식: 이미지 파일 (JPEG, PNG 등)

**Request Example**
```http
POST /api/v1/archives/456/images HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="images"; filename="photo1.jpg"
Content-Type: image/jpeg

[이미지 바이너리 데이터]
------WebKitFormBoundary
Content-Disposition: form-data; name="images"; filename="photo2.jpg"
Content-Type: image/jpeg

[이미지 바이너리 데이터]
------WebKitFormBoundary--
```

**Response (200 OK)**
```json
[
  {
    "id": 1,
    "url": "/api/v1/archives/456/images/1"
  },
  {
    "id": 2,
    "url": "/api/v1/archives/456/images/2"
  }
]
```

**Status Codes**
- `200 OK`: 업로드 성공
- `400 Bad Request`: 파일 크기 초과, 개수 초과, 형식 오류
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인이 작성한 아카이브가 아님
- `404 Not Found`: 존재하지 않는 아카이브 ID
- `413 Payload Too Large`: 파일 크기 초과

**Error Example (400)**
```json
{
  "message": "이미지는 최대 5개까지 업로드할 수 있습니다.",
  "status": 400
}
```

---

### 10. 아카이브 이미지 삭제

아카이브의 특정 이미지를 삭제합니다.

**Endpoint**
```
DELETE /api/v1/archives/{archiveId}/images/{imageId}
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `archiveId` (Long, required): 아카이브 ID
- `imageId` (Long, required): 이미지 ID

**Request Example**
```http
DELETE /api/v1/archives/456/images/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (204 No Content)**
```http
204 No Content
```

**Status Codes**
- `204 No Content`: 삭제 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인이 작성한 아카이브가 아님
- `404 Not Found`: 존재하지 않는 아카이브 또는 이미지 ID

---

### 11. 아카이브 이미지 다운로드

아카이브의 이미지를 다운로드합니다.

**Endpoint**
```
GET /api/v1/archives/{archiveId}/images/{imageId}
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `archiveId` (Long, required): 아카이브 ID
- `imageId` (Long, required): 이미지 ID

**Request Example**
```http
GET /api/v1/archives/456/images/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```http
200 OK
Content-Type: image/jpeg
Content-Length: 1024000
Content-Disposition: inline; filename="photo1.jpg"

[이미지 바이너리 데이터]
```

**Status Codes**
- `200 OK`: 다운로드 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 비공개 아카이브에 대한 접근 권한 없음
- `404 Not Found`: 존재하지 않는 아카이브 또는 이미지 ID

---

## 좋아요/스크랩 (Like/Scrap)

### 1. 좋아요

아카이브에 좋아요를 추가합니다.

**Endpoint**
```
POST /api/v1/archives/{id}/like
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 아카이브 ID

**Request Example**
```http
POST /api/v1/archives/456/like HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```http
200 OK
```

**Status Codes**
- `200 OK`: 좋아요 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `404 Not Found`: 존재하지 않는 아카이브 ID

**참고사항**
- 본인이 작성한 아카이브에도 좋아요 가능
- 이미 좋아요한 아카이브에 재요청 시 무시됨

---

### 2. 좋아요 취소

아카이브의 좋아요를 제거합니다.

**Endpoint**
```
DELETE /api/v1/archives/{id}/like
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 아카이브 ID

**Request Example**
```http
DELETE /api/v1/archives/456/like HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```http
200 OK
```

**Status Codes**
- `200 OK`: 좋아요 취소 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `404 Not Found`: 존재하지 않는 아카이브 ID

---

### 3. 스크랩

아카이브를 스크랩합니다.

**Endpoint**
```
POST /api/v1/archives/{id}/scrap
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 아카이브 ID

**Request Example**
```http
POST /api/v1/archives/456/scrap HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```http
200 OK
```

**Status Codes**
- `200 OK`: 스크랩 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `404 Not Found`: 존재하지 않는 아카이브 ID

**참고사항**
- 본인이 작성한 아카이브도 스크랩 가능
- 이미 스크랩한 아카이브에 재요청 시 무시됨

---

### 4. 스크랩 취소

아카이브의 스크랩을 제거합니다.

**Endpoint**
```
DELETE /api/v1/archives/{id}/scrap
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 아카이브 ID

**Request Example**
```http
DELETE /api/v1/archives/456/scrap HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR유cCI6IkpXVCJ9...
```

**Response (200 OK)**
```http
200 OK
```

**Status Codes**
- `200 OK`: 스크랩 취소 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `404 Not Found`: 존재하지 않는 아카이브 ID

---

### 5. 내 스크랩 목록 조회

본인이 스크랩한 아카이브 목록을 조회합니다.

**Endpoint**
```
GET /api/v1/archives/scraps
```

**인증 필요**: ✅ Yes (Bearer Token)

**Query Parameters**
- `page` (int, optional, default: 1): 페이지 번호 (1부터 시작)
- `size` (int, optional, default: 20): 페이지 크기

**Request Example**
```http
GET /api/v1/archives/scraps?page=1&size=10 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
{
  "content": [
    {
      "archiveId": 456,
      "emotion": "HAPPY",
      "contentPreview": "오늘 정말 행복한 하루였다!",
      "latitude": 37.5665,
      "longitude": 126.9780,
      "address": "서울특별시 중구 세종대로 110",
      "createdAt": "2026-02-15T14:30:00",
      "likeCount": 5,
      "isLiked": false,
      "isScraped": true,
      "writer": {
        "userId": 123,
        "nickname": "길동이"
      }
    }
  ],
  "pageNo": 1,
  "pageSize": 10,
  "totalElements": 15,
  "totalPages": 2,
  "last": true
}
```

**Status Codes**
- `200 OK`: 조회 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

---

## 타임캡슐 (TimeCapsule)

### 1. 타임캡슐 작성

미래에 열릴 타임캡슐을 작성합니다.

**Endpoint**
```
POST /api/v1/time-capsule
```

**인증 필요**: ✅ Yes (Bearer Token)

**Request Body**
```json
{
  "emotion": "HAPPY | SAD | ANXIOUS | ANGRY | CALM | EXCITED | LONELY | GRATEFUL | TIRED (required)",
  "content": "string (required)",
  "openAt": "string (required, ISO 8601 datetime, 미래 시각)",
  "location": {
    "latitude": "number (BigDecimal, optional)",
    "longitude": "number (BigDecimal, optional)",
    "locationLabel": "string (optional)"
  }
}
```

**Request Example**
```http
POST /api/v1/time-capsule HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "emotion": "HAPPY",
  "content": "1년 후의 나에게...",
  "openAt": "2027-02-15T00:00:00",
  "location": {
    "latitude": 37.5665,
    "longitude": 126.9780,
    "locationLabel": "서울시청"
  }
}
```

**Response (201 Created)**
```http
201 Created
Location: /api/v1/time-capsule/789
```

**Status Codes**
- `201 Created`: 작성 성공
- `400 Bad Request`: 유효성 검증 실패 (과거 날짜, 감정 누락 등)
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

**참고사항**
- 작성 후 30분 이내에만 수정 가능
- 30분 후에는 완전 잠금 (수정/삭제 불가)
- `openAt` 시점이 되면 자동으로 열람 가능 및 알림 발송

---

### 2. 내 타임캡슐 목록 조회

본인이 작성한 타임캡슐 목록을 조회합니다.

**Endpoint**
```
GET /api/v1/time-capsule
```

**인증 필요**: ✅ Yes (Bearer Token)

**Request Example**
```http
GET /api/v1/time-capsule HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters**
- `page` (int, optional, default: 1): 페이지 번호 (1부터 시작)
- `size` (int, optional, default: 20): 페이지 크기
- `status` (string, optional): 상태 필터 (`LOCKED` | `OPENED`)

**Response (200 OK)**
```json
{
  "content": [
    {
      "id": 789,
      "emotion": "HAPPY",
      "contentPreview": "1년 후의 나에게...",
      "location": {
        "address": "서울시청",
        "latitude": 37.5665,
        "longitude": 126.9780
      },
      "status": "LOCKED",
      "openAt": "2027-02-15T00:00:00",
      "createdAt": "2026-02-15T10:00:00"
    }
  ],
  "pageNo": 1,
  "pageSize": 20,
  "totalElements": 5,
  "totalPages": 1,
  "last": true
}
```

**Status Codes**
- `200 OK`: 조회 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

---

### 3. 타임캡슐 상세 조회

타임캡슐의 상세 정보를 조회합니다.

**Endpoint**
```
GET /api/v1/time-capsule/{id}
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 타임캡슐 ID

**Request Example**
```http
GET /api/v1/time-capsule/789 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK) - 열림 상태 (status: OPENED)**
```json
{
  "id": 789,
  "emotion": "HAPPY",
  "content": "1년 후의 나에게... 오늘의 감정을 기록해둔다.",
  "images": [
    {
      "id": 1,
      "url": "/api/v1/time-capsule/789/images/1"
    }
  ],
  "location": {
    "address": "서울시청",
    "latitude": 37.5665,
    "longitude": 126.9780
  },
  "status": "OPENED",
  "openAt": "2027-02-15T00:00:00",
  "createdAt": "2026-02-15T10:00:00"
}
```

**Response (200 OK) - 잠금 상태 (status: LOCKED)**
```json
{
  "id": 789,
  "emotion": "HAPPY",
  "content": null,
  "images": [],
  "location": null,
  "status": "LOCKED",
  "openAt": "2027-02-15T00:00:00",
  "createdAt": "2026-02-15T10:00:00"
}
```

**Status Codes**
- `200 OK`: 조회 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인이 작성한 타임캡슐이 아님
- `404 Not Found`: 존재하지 않는 타임캡슐 ID

**참고사항**
- 잠금 상태(`status: LOCKED`)에서는 `content`가 `null`로 반환됩니다
- `openAt`: 타임캡슐이 열리는 예정 시각 (작성 시 지정한 공개 일시)

---

### 4. 타임캡슐 수정

타임캡슐을 수정합니다 (30분 이내만 가능).

**Endpoint**
```
PUT /api/v1/time-capsule/{id}
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 타임캡슐 ID

**Request Body**
```json
{
  "emotion": "HAPPY | SAD | ... (required)",
  "content": "string (required)",
  "openAt": "string (required, ISO 8601 datetime, 미래 시각)",
  "location": {
    "latitude": "number (BigDecimal, optional)",
    "longitude": "number (BigDecimal, optional)",
    "locationLabel": "string (optional)"
  }
}
```

**Request Example**
```http
PUT /api/v1/time-capsule/789 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "content": "수정된 내용"
}
```

**Response (200 OK)**
```http
200 OK
```

**Status Codes**
- `200 OK`: 수정 성공
- `400 Bad Request`: 수정 불가 (30분 경과, 이미 잠금 상태)
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인이 작성한 타임캡슐이 아님
- `404 Not Found`: 존재하지 않는 타임캡슐 ID

**Error Example (400)**
```json
{
  "message": "타임캡슐은 작성 후 30분 이내에만 수정할 수 있습니다.",
  "status": 400
}
```

---

### 5. 타임캡슐 삭제

타임캡슐을 삭제합니다 (작성 후 30분 이내 + LOCKED 상태만 가능).

**Endpoint**
```
DELETE /api/v1/time-capsule/{id}
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 타임캡슐 ID

**Request Example**
```http
DELETE /api/v1/time-capsule/789 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```http
200 OK
```

**Status Codes**
- `200 OK`: 삭제 성공
- `400 Bad Request`: 삭제 불가 (30분 경과 또는 OPENED 상태)
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인이 작성한 타임캡슐이 아님
- `404 Not Found`: 존재하지 않는 타임캡슐 ID

---

### 6. 타임캡슐 이미지 업로드

타임캡슐에 이미지를 업로드합니다 (최대 5개).

**Endpoint**
```
POST /api/v1/time-capsule/{id}/images
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 타임캡슐 ID

**Request Headers**
```http
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data)**
```
images: [파일1, 파일2, ...] (최대 5개)
```

**제약사항**
- 파일당 최대 크기: 5MB
- 최대 개수: 5개
- 허용 형식: 이미지 파일 (JPEG, PNG 등)

**Request Example**
```http
POST /api/v1/time-capsule/789/images HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="images"; filename="photo.jpg"
Content-Type: image/jpeg

[이미지 바이너리 데이터]
------WebKitFormBoundary--
```

**Response (200 OK)**
```json
[
  {
    "id": 1,
    "url": "/api/v1/time-capsule/789/images/1"
  }
]
```

**Status Codes**
- `200 OK`: 업로드 성공 (Location 헤더에 이미지 URL 포함)
- `400 Bad Request`: 파일 개수 초과, 형식 오류
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인이 작성한 타임캡슐이 아님
- `404 Not Found`: 존재하지 않는 타임캡슐 ID

---

### 7. 타임캡슐 이미지 삭제

타임캡슐의 특정 이미지를 삭제합니다.

**Endpoint**
```
DELETE /api/v1/time-capsule/{timeCapsuleId}/images/{imageId}
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `timeCapsuleId` (Long, required): 타임캡슐 ID
- `imageId` (Long, required): 이미지 ID

**Request Example**
```http
DELETE /api/v1/time-capsule/789/images/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (204 No Content)**
```http
204 No Content
```

**Status Codes**
- `204 No Content`: 삭제 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인이 작성한 타임캡슐이 아님
- `404 Not Found`: 존재하지 않는 타임캡슐 또는 이미지 ID

---

### 8. 타임캡슐 이미지 다운로드

타임캡슐의 이미지를 다운로드합니다. JWT 인증이 필요하므로 브라우저 `<img>` 태그 대신 JS fetch로 처리해야 합니다.

**Endpoint**
```
GET /api/v1/time-capsule/{timeCapsuleId}/images/{imageId}
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `timeCapsuleId` (Long, required): 타임캡슐 ID
- `imageId` (Long, required): 이미지 ID

**Request Example**
```http
GET /api/v1/time-capsule/789/images/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```http
200 OK
Content-Type: image/jpeg
Content-Length: 1024000
Content-Disposition: inline; filename="photo.jpg"

[이미지 바이너리 데이터]
```

**Status Codes**
- `200 OK`: 다운로드 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인이 작성한 타임캡슐이 아님 (타임캡슐은 본인만 조회 가능)
- `404 Not Found`: 존재하지 않는 타임캡슐 또는 이미지 ID

**참고사항**
- 타임캡슐 이미지는 인증이 필수이므로, `<img src>` 태그로 직접 불러올 수 없습니다
- 프론트엔드에서 `fetch` + `URL.createObjectURL()`로 처리해야 합니다 (AuthImage 컴포넌트)

---

## 알림 (Notification)

### 1. 알림 목록 조회

사용자의 알림 목록을 조회합니다 (페이지네이션 지원).

**Endpoint**
```
GET /api/v1/notifications
```

**인증 필요**: ✅ Yes (Bearer Token)

**Query Parameters**
- `page` (int, optional, default: 0): 페이지 번호
- `size` (int, optional, default: 20): 페이지 크기
- `sort` (string, optional, default: "createdAt,desc"): 정렬 기준
- `isRead` (boolean, optional): 읽음/안읽음 필터
  - `true`: 읽은 알림만
  - `false`: 읽지 않은 알림만
  - 생략: 전체 알림

**Request Example**
```http
GET /api/v1/notifications?page=0&size=20&isRead=false HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
{
  "content": [
    {
      "id": 123,
      "title": "타임캡슐이 열렸습니다!",
      "content": "1년 전에 작성한 타임캡슐을 확인해보세요.",
      "notificationType": "TIME_CAPSULE_OPENED",
      "relatedId": 789,
      "isRead": false,
      "createdAt": "2026-02-15T10:00:00",
      "readAt": null
    },
    {
      "id": 122,
      "title": "타임캡슐이 열렸습니다!",
      "content": "6개월 전에 작성한 타임캡슐을 확인해보세요.",
      "notificationType": "TIME_CAPSULE_OPENED",
      "relatedId": 788,
      "isRead": false,
      "createdAt": "2026-02-14T15:30:00",
      "readAt": null
    }
  ],
  "pageNo": 1,
  "pageSize": 20,
  "totalElements": 15,
  "totalPages": 1,
  "last": true
}
```

**Status Codes**
- `200 OK`: 조회 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

**참고사항**
- 무한 스크롤 페이지네이션에 적합
- `isRead=false`로 읽지 않은 알림만 조회하여 뱃지 카운트 계산 가능
- 기본 정렬: 최신순 (createdAt DESC)

---

### 2. 개별 알림 읽음 처리

특정 알림을 읽음 상태로 변경합니다.

**Endpoint**
```
PATCH /api/v1/notifications/{id}/read
```

**인증 필요**: ✅ Yes (Bearer Token)

**Path Parameters**
- `id` (Long, required): 알림 ID

**Request Example**
```http
PATCH /api/v1/notifications/123/read HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```http
200 OK
```

**Status Codes**
- `200 OK`: 읽음 처리 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음
- `403 Forbidden`: 본인의 알림이 아님
- `404 Not Found`: 존재하지 않는 알림 ID

**참고사항**
- 읽음 처리 시 `isRead`가 `true`로, `readAt`이 현재 시각으로 자동 업데이트됩니다
- 이미 읽은 알림을 다시 호출해도 성공 (멱등성 보장)

---

### 3. 전체 알림 읽음 처리

모든 읽지 않은 알림을 읽음 상태로 일괄 변경합니다.

**Endpoint**
```
PATCH /api/v1/notifications/read-all
```

**인증 필요**: ✅ Yes (Bearer Token)

**Request Example**
```http
PATCH /api/v1/notifications/read-all HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```http
200 OK
```

**Status Codes**
- `200 OK`: 전체 읽음 처리 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

**참고사항**
- 현재 사용자의 읽지 않은 알림(`isRead=false`)만 일괄 업데이트됩니다
- 업데이트된 알림의 `isRead`는 `true`로, `readAt`은 현재 시각으로 설정됩니다
- 읽지 않은 알림이 없어도 성공 응답 반환

---

### 4. SSE 구독 (실시간 알림 수신)

SSE(Server-Sent Events)를 통해 타임캡슐 공개 알림을 실시간으로 수신합니다.

**Endpoint**
```
GET /api/v1/notifications/subscribe
```

**인증 필요**: ✅ Yes (Bearer Token)

**Request Example**
```http
GET /api/v1/notifications/subscribe HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: text/event-stream
```

**Response Headers**
```http
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Response Events**

연결 수립 시 (즉시):
```
event: connect
data: {"message": "connected"}
```

하트비트 (30초마다):
```
event: heartbeat
data: {}
```

타임캡슐 공개 알림:
```
event: notification
data: {
  "notificationId": 123,
  "title": "타임캡슐이 열렸습니다!",
  "content": "1년 전에 작성한 타임캡슐을 확인해보세요.",
  "notificationType": "TIME_CAPSULE_OPENED",
  "relatedId": 789,
  "createdAt": "2026-02-17T10:00:00"
}
```

**Status Codes**
- `200 OK`: SSE 스트림 연결 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

**참고사항**
- 하나의 연결로 `connect`, `heartbeat`, `notification` 이벤트를 모두 수신
- 연결이 끊기면 브라우저 `EventSource`가 자동으로 재연결 시도
- 탭 닫기 또는 로그아웃 시 연결 자동 종료
- 하트비트는 브라우저/프록시의 유휴 연결 자동 종료를 방지하기 위해 30초마다 전송

---

## 이메일 알림 설정 (Email Notification Settings)

### 1. 이메일 알림 수신 설정 변경

사용자의 타임캡슐 이메일 알림 수신 여부를 변경합니다.

**Endpoint**
```
PATCH /api/v1/users/me/settings/email-notification
```

**인증 필요**: ✅ Yes (Bearer Token)

**Request Body**
```json
{
  "enabled": "boolean (required)"
}
```

**Validation Rules**
- `enabled`: boolean 타입, 필수
  - `true`: 이메일 알림 수신
  - `false`: 이메일 알림 수신 안함

**Request Example**
```http
PATCH /api/v1/users/me/settings/email-notification HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "enabled": false
}
```

**Response (200 OK)**
```http
200 OK
```

**Status Codes**
- `200 OK`: 설정 변경 성공
- `400 Bad Request`: 유효성 검증 실패 (enabled 필드 누락 또는 타입 오류)
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

**참고사항**
- 이 설정은 타임캡슐 공개 시 이메일 발송 여부를 제어합니다
- 인앱(웹) 알림은 이 설정과 무관하게 항상 발송됩니다
- 기본값은 `true` (이메일 알림 수신)입니다
- 설정 변경 시 즉시 적용됩니다

**Error Example (400)**
```json
{
  "message": "enabled 필드는 필수입니다.",
  "status": 400
}
```

---

## 감정 날씨 (Emotion Weather)

### 1. 오늘의 감정 날씨 조회

오늘 가장 많이 기록된 감정 Top 3를 조회합니다. 프론트엔드는 5분 주기로 폴링하여 헤더 ticker에 표시합니다.

**Endpoint**
```
GET /api/v1/emotions/ranking
```

**인증 필요**: ✅ Yes (Bearer Token)

**Request Example**
```http
GET /api/v1/emotions/ranking HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
[
  { "rank": 1, "emotion": "HAPPY",   "count": 42 },
  { "rank": 2, "emotion": "CALM",    "count": 35 },
  { "rank": 3, "emotion": "EXCITED", "count": 28 }
]
```

**참고사항**
- 당일 기록이 없으면 빈 배열 `[]` 반환
- Redis ZSet (`emotion:ranking:{yyyyMMdd}`)에서 조회하며 자정에 자동 만료
- `emotion` 필드는 Emotion enum 값 (HAPPY, SAD, ANXIOUS, ANGRY, CALM, EXCITED, LONELY, GRATEFUL, TIRED)
- 프론트엔드 폴링 주기: 5분 (React Query `refetchInterval`)

**Status Codes**
- `200 OK`: 조회 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

---

## 리포트 (Report)

### 1. 월간 리포트 조회

특정 월의 감정 기록 통계를 조회합니다.

**Endpoint**
```
GET /api/v1/reports/monthly
```

**인증 필요**: ✅ Yes (Bearer Token)

**Query Parameters**
- `year` (int, required): 연도 (예: 2026)
- `month` (int, required): 월 (1-12)

**Request Example**
```http
GET /api/v1/reports/monthly?year=2026&month=2 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
{
  "year": 2026,
  "month": 2,
  "totalCount": 15,
  "emotionDistribution": {
    "HAPPY": 5,
    "SAD": 3,
    "CALM": 4,
    "EXCITED": 3
  },
  "dailyRecords": [
    {
      "date": "2026-02-01",
      "count": 2,
      "emotions": ["HAPPY", "CALM"]
    },
    {
      "date": "2026-02-02",
      "count": 1,
      "emotions": ["SAD"]
    }
  ]
}
```

**Status Codes**
- `200 OK`: 조회 성공
- `400 Bad Request`: 유효하지 않은 연도/월 파라미터
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

---

### 2. 감정 분포 통계 조회

전체 기간의 감정 분포를 조회합니다.

**Endpoint**
```
GET /api/v1/reports/emotions
```

**인증 필요**: ✅ Yes (Bearer Token)

**Request Example**
```http
GET /api/v1/reports/emotions HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
{
  "totalCount": 100,
  "emotionDistribution": {
    "HAPPY": 25,
    "SAD": 15,
    "ANXIOUS": 10,
    "ANGRY": 5,
    "CALM": 20,
    "EXCITED": 15,
    "LONELY": 5,
    "GRATEFUL": 5
  }
}
```

**Status Codes**
- `200 OK`: 조회 성공
- `401 Unauthorized`: 인증 토큰 없음 또는 유효하지 않음

---

## 공통 사항

### 에러 응답 형식

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "message": "에러 메시지",
  "status": 400
}
```

**공통 에러 코드**
- `400 Bad Request`: 잘못된 요청 (유효성 검증 실패)
- `401 Unauthorized`: 인증 실패 (토큰 없음, 만료, 유효하지 않음)
- `403 Forbidden`: 권한 없음 (본인 리소스가 아님)
- `404 Not Found`: 리소스 없음
- `409 Conflict`: 리소스 충돌 (중복 이메일 등)
- `413 Payload Too Large`: 요청 크기 초과
- `500 Internal Server Error`: 서버 내부 오류

---

### 페이지네이션

페이지네이션이 지원되는 엔드포인트는 다음 쿼리 파라미터를 사용합니다:

**Query Parameters**
- `page` (int, optional, default: 1): 페이지 번호 (**1부터 시작**)
- `size` (int, optional, default: 20): 페이지당 항목 수
- `sort` (string, optional): 정렬 기준 (예: `createdAt,desc`)

**응답 형식 (PagingResponse)**
```json
{
  "content": [...],
  "pageNo": 1,
  "pageSize": 20,
  "totalElements": 100,
  "totalPages": 5,
  "last": false
}
```

---

### Enum 값 정의

#### Emotion (감정)
```
HAPPY      행복
SAD        슬픔
ANXIOUS    불안함
ANGRY      화난
CALM       차분한
EXCITED    신난
LONELY     외로운
GRATEFUL   감사한
PEACEFUL   평온
THRILLED   설렘
NOSTALGIC  그리움
```

#### Gender (성별)
```
MALE    남성
FEMALE  여성
```

#### Visibility (공개 설정)
```
PUBLIC   공개
PRIVATE  비공개
```

---

### 인증 토큰 수명

- **Access Token**: 1시간 (3600초)
- **Refresh Token**: 7일 (604800초)

**토큰 갱신 시나리오**
1. Access Token 만료 시 `401 Unauthorized` 응답
2. 클라이언트는 Refresh Token으로 `/api/v1/token/reIssue` 호출
3. 새로운 Access Token과 Refresh Token 발급
4. 새 Access Token으로 재요청

---

### 파일 업로드 제약사항

**이미지 업로드** (`/api/v1/archives/{id}/images`)
- 파일당 최대 크기: **5MB**
- 전체 파일 크기: **20MB**
- 최대 개수: **5개**
- 허용 형식: 이미지 파일 (JPEG, PNG, GIF 등)

---

## 변경 이력

### 2026-02-18 (2차)
- Emotion Weather: `GET /api/v1/emotions/ranking` (오늘의 감정 날씨 Top 3 조회) 추가
- Emotion Weather: 응답 포맷 수정 — `{date, rankings:[]}` → `[{rank, emotion, count}]` (배열 직반환)
- Emotion Weather: SSE 구독 방식 → 5분 폴링 방식으로 변경 (SSE 엔드포인트 미구현)

### 2026-02-18
- Archive: `GET /api/v1/archives/me` (내 아카이브 목록) 추가
- Archive: `PATCH /api/v1/archives/{archiveId}/status` (상태 변경) 추가
- TimeCapsule: `PUT /api/v1/time-capsule/{id}` - 수정 메서드 PATCH → PUT 수정
- TimeCapsule: `DELETE /api/v1/time-capsule/{id}` (삭제) 추가
- TimeCapsule: `POST /api/v1/time-capsule/{id}/images` (이미지 업로드) 추가
- TimeCapsule: `DELETE /api/v1/time-capsule/{id}/images/{imageId}` (이미지 삭제) 추가
- TimeCapsule: `GET /api/v1/time-capsule/{id}/images/{imageId}` (이미지 다운로드) 추가

### 2026-02-15
- 초안 작성
- 인증, 회원, 아카이브, 좋아요/스크랩, 타임캡슐, 리포트 API 문서화
- 실제 백엔드 구현 기반 Request/Response 스키마 정의
