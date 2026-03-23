# Feel-Archive

> **공간 기반 감정 아카이빙 플랫폼** — 감정을 느낀 바로 그 순간, 그 장소를 지도 위에 기록하세요.

---
## 기술 스택

### Backend
| 분류 | 기술 |
|------|------|
| Language / Framework | Java 17, Spring Boot 3.4.x |
| Security | Spring Security + JWT (Access/Refresh Token) |
| DB | MySQL 8.4 + Spring Data JPA + QueryDSL |
| GIS | Hibernate Spatial + JTS (Java Topology Suite) |
| Cache | Redis |
| Migration | Flyway |
| External API | Kakao Maps (Spring Cloud OpenFeign) |
| Storage | AWS S3 |
| Deploy | AWS EC2 (Docker) + ECR + CodeBuild + CodeDeploy |
| Secrets | AWS SSM Parameter Store |

### Frontend
| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| State / Fetching | Zustand + TanStack Query + Axios |
| Deploy | Vercel |

---

## 백엔드 아키텍처



### 폴더 구조
```
feel-archive/                  # 모노레포 루트
├── apps/
│   ├── backend/               # Spring Boot 멀티모듈
│   │   ├── api/               # HTTP 계층
│   │   ├── domain/            # 도메인 계층
│   │   ├── common/            # 공통 예외
│   │   ├── external/          # Kakao Maps 외부 라이브러리
│   │   ├── batch/             # 배치
│   │   └── infrastructure/    # docker-compose (로컬/프로덕션)
│   └── frontend/              # Next.js 14
├── docs/
│   ├── SPEC.md                # 서비스 기획 명세
│   └── API.md                 # API 명세
├── buildspec.yml              # AWS CodeBuild 스펙
├── appspec.yml                # AWS CodeDeploy 스펙
└── scripts/deploy.sh          # EC2 배포 스크립트
```


## CI/CD 파이프라인

### Backend
```
GitHub PR (feature → develop)
  → GitHub Actions (ci.yml)
      → Gradle 테스트 실행
      → 통과 시 머지 버튼 활성화

GitHub Push (develop → main)
  → AWS CodePipeline
      → AWS CodeBuild (buildspec.yml)
          → Gradle 빌드 + Docker 이미지 빌드
          → ECR Push
      → AWS CodeDeploy (appspec.yml)
          → EC2 배포 (scripts/deploy.sh)
              → SSM Parameter Store에서 환경변수 로드
              → Docker 컨테이너 실행
```

### Frontend
```
GitHub Push (main) → Vercel 자동 배포
```

## 문서

- [서비스 기획 명세 (SPEC.md)](./docs/SPEC.md)
- [API 명세 (API.md)](./docs/API.md)
