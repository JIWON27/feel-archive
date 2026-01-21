# Feel-Archive 서비스

## 📝 개요

Feel-Archive는 감정을 느낀 '바로 그 순간, 그 장소'를 지도 위에 기록하는 위치 기반 감정 아카이빙 서비스입니다.

복잡한 장소 검색 없이 현재 위치를 기반으로 직관적인 감정 기록을 남깁니다.
사용자는 나만의 감정 흐름을 시각적으로 회고할 수 있으며, 공유된 아카이브를 통해 타인의 감정 해소 경험을 탐색하고 공감할 수 있습니다.

위치 기록을 원치 않을 경우, 위치 정보를 제외한 순수 감정 일기로도 활용 가능합니다.

## ✨ 주요 기능

### 감정 아카이브
- 아카이브 기능
    - 텍스트, 사진과 함께 당시의 감정 상태를 기록.
    - 글 작성 시 별도의 검색 없이 현재 위치를 자동으로 기록.
    - (사용자 선택) 위치 기록 On/Off 토글 기능 제공.

### 지도 및 시각화
- 감정 지도
    - 기록을 남긴 장소마다 마커가 생성
- 히트맵 (고민)
    - 자주 감정을 기록한 지역을 색상으로 시각화.

### 소통 및 탐색 
- 주변 아카이브 글 탐색
    -  내 주변 반경 N km 안에서 다른 사람들은 어떤 이야기를 남겼는지 탐색.
    - 조회순, 인기순 등 정렬
- 공감하기
- 경험 스크랩
    - 타인의 경험이나 장소가 마음에 들 경우 스크랩하여 '가고 싶은 장소'로 저장하고, 내 지도 위에서 표출

작성중...
<br>

## 🛠️ 기술 스택

* **Language**: Java 17+
* **Framework**: Spring Boot 3.4.x
* **Security**: Spring Security
* **Batch**: Spring Batch
* **DB**: MySQL 8.4
* **ORM**: Spring Data JPA, QueryDSL
* **Migration**: Flyway
* **Cache**: Redis 
* **Message Queue**: Kafka (or SQS)
* **Infra**: AWS, Docker, Github Actions or Jenkins
* **Monitoring**: Prometheus & Grafana
* **API Docs**: Spring REST Docs or Swagger
* **기타** : 카카오 로컬 API
