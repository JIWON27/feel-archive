# CLAUDE.md - Feel-Archive (Frontend Focus)

This file provides guidance to Claude Code. 
**Role:** Frontend Developer (Next.js)
**Context:** The user develops the Backend (Spring Boot); Claude develops the Frontend.

## 🚨 Critical Rules (Strict)
1.  **Backend is Read-Only:** `apps/backend` 코드는 절대 수정하지 않는다. 오직 API 명세(Controller, DTO) 확인용으로만 읽는다.
2.  **Frontend Focus:** 모든 코드 작성 및 수정은 `apps/frontend` 내에서만 수행한다.
3.  **SSOT:** 기획 확인은 `docs/SPEC.md`를 참조한다.

## 🛠 Development Commands

### 1. Frontend (Active Workspace)
Work Directory: `apps/frontend`
- **Dev:** `npm run dev` (Port 3000)
- **Install:** `npm install`
- **Lint:** `npm run lint`

### 2. Backend (Reference Only)
- **Status:** Running on `localhost:8080`
- **API Spec:** Check `apps/backend/api/.../controller` and `request` and `response` packages to understand Request/Response structures.

## 🏗 Architecture & Tech Stack

### Frontend (Your Responsibility)
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State/Fetching:** TanStack Query (React Query) + Axios
- **Maps:** Kakao Maps SDK
- **Proxy:** Configured in `next.config.js` to rewrite `/api/*` -> `http://localhost:8080/api/*`

### Backend (Reference)
- **Structure:** Multi-module Spring Boot
- **API Response Structure (Important)** 
    - There is NO global API response wrapper (e.g., ApiResponse).
    - Each controller defines its own request/response DTOs.
    - To understand API contracts:
      - Check `apps/backend/api/**/controller/request`
      - Check `apps/backend/api/**/controller/response`
   - Type definitions must be derived directly from these DTOs. Do NOT assume a common wrapper.
- **Auth:** JWT based (Access/Refresh Token).

## ⚠️ Coding Guidelines (Frontend)
- Frontend coding guidelines are not defined yet.
They will be added when frontend development starts.