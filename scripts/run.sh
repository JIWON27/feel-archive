#!/bin/bash

echo "Feel Archive 통합 개발 환경  실행합니다..."

ENV_PATH="./apps/backend/.env"

if [ -f "$ENV_PATH" ]; then
  echo "환경변수를 로드합니다."
  set -o allexport
  source "$ENV_PATH"
  set +o allexport
else
  echo "[경고] .env 파일이 없습니다."
  echo "(프로젝트 루트에 .env 파일이 있는지 확인하세요)"
fi

# PID를 담을 변수
BE_PID=""
FE_PID=""
LANDING_PID=""

# 종료 함수
cleanup() {
    echo ""
    echo "실행 중인 프로세스를 종료합니다..."

    # PID가 존재하면 해당 프로세스 종료
    if [ -n "$BE_PID" ]; then
        kill -TERM "$BE_PID" 2>/dev/null
    fi

    if [ -n "$FE_PID" ]; then
        kill -TERM "$FE_PID" 2>/dev/null
    fi

    exit
}

trap cleanup SIGINT EXIT

# 1. 백엔드 실행
echo "[Backend] Spring Boot 실행..."
(cd apps/backend && ./gradlew :api:bootRun --no-daemon) & BE_PID=$!

# 2. 프론트엔드 실행
echo "[Frontend] Next.js 실행..."
(cd apps/frontend && npm run dev) & FE_PID=$!

# 스크립트 종료 방지 및 대기
wait
