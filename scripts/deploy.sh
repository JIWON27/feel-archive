#!/bin/bash

set -euo pipefail

echo "Feel Archive 배포 스크립트 실행."

export AWS_DEFAULT_REGION=ap-northeast-2
# Account ID 동적으로 가져오기
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# SSM에서 값 가져오기
DB_URL=$(aws ssm get-parameter --name "DB_URL" --with-decryption --query Parameter.Value --output text)
DB_USERNAME=$(aws ssm get-parameter --name "DB_USERNAME" --with-decryption --query Parameter.Value --output text)
DB_PASSWORD=$(aws ssm get-parameter --name "DB_PASSWORD" --with-decryption --query Parameter.Value --output text)
REDIS_HOST=$(aws ssm get-parameter --name "REDIS_HOST" --query Parameter.Value --output text)
REDIS_PORT=$(aws ssm get-parameter --name "REDIS_PORT" --query Parameter.Value --output text)
JWT_SECRET=$(aws ssm get-parameter --name "JWT_SECRET" --with-decryption --query Parameter.Value --output text)
MAIL_USERNAME=$(aws ssm get-parameter --name "MAIL_USERNAME" --query Parameter.Value --output text)
MAIL_PASSWORD=$(aws ssm get-parameter --name "MAIL_PASSWORD" --with-decryption --query Parameter.Value --output text)
KAKAO_REST_API_KEY=$(aws ssm get-parameter --name "KAKAO_REST_API_KEY" --with-decryption --query Parameter.Value --output text)
APP_SERVER_URL=$(aws ssm get-parameter --name "APP_SERVER_URL" --query Parameter.Value --output text)
APP_CLIENT_URL=$(aws ssm get-parameter --name "APP_CLIENT_URL" --query Parameter.Value --output text)
AWS_S3_BUCKET=$(aws ssm get-parameter --name "S3_BUCKET" --query Parameter.Value --output text)

# ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com

# 기존 컨테이너 중지 및 삭제
docker stop feel-archive || true
docker rm feel-archive || true

# 새 이미지 pull
docker pull $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com/feel-archive:latest

# 새 컨테이너 실행
docker run -d \
  --name feel-archive \
  --network feel-archive-net \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=$DB_URL \
  -e DB_USERNAME=$DB_USERNAME \
  -e DB_PASSWORD=$DB_PASSWORD \
  -e REDIS_HOST=$REDIS_HOST \
  -e REDIS_PORT=$REDIS_PORT \
  -e JWT_SECRET=$JWT_SECRET \
  -e MAIL_USERNAME=$MAIL_USERNAME \
  -e MAIL_PASSWORD=$MAIL_PASSWORD \
  -e KAKAO_REST_API_KEY=$KAKAO_REST_API_KEY \
  -e APP_SERVER_URL=$APP_SERVER_URL \
  -e APP_CLIENT_URL=$APP_CLIENT_URL \
  -e AWS_S3_BUCKET=$AWS_S3_BUCKET \
  $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com/feel-archive:latest
