# CORS 설정 수정 필요

## 문제
프론트엔드에서 아카이브 생성 후 `Location` 헤더를 읽지 못해 ID를 0으로 추출하고 있습니다.

## 원인
`SecurityConfig.java`의 CORS 설정에서 `exposedHeaders`가 누락되어 있습니다.

## 수정 방법

### SecurityConfig.java 수정

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
  CorsConfiguration configuration = new CorsConfiguration();
  // 모든 출처 허용 (로컬 개발용)
  configuration.addAllowedOriginPattern("*");
  // 모든 HTTP 메서드 허용 (GET, POST, OPTIONS 등)
  configuration.addAllowedMethod("*");
  // 모든 헤더 허용
  configuration.addAllowedHeader("*");
  // 자격 증명(Cookie, Authorization Header 등) 허용 여부
  configuration.setAllowCredentials(true);

  // ⭐ 추가: Location 헤더 노출
  configuration.addExposedHeader("Location");

  UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
  source.registerCorsConfiguration("/**", configuration);
  return source;
}
```

## 한 줄 추가

`configuration.setAllowCredentials(true);` 다음 줄에:

```java
configuration.addExposedHeader("Location");
```

## 테스트 방법

1. 백엔드 재시작
2. 프론트엔드에서 아카이브 작성
3. 브라우저 콘솔에서 로그 확인:
   ```
   [Archive Create] Location header: /api/v1/archives/1
   [Archive Create] Extracted ID: 1
   ```
4. 정상적으로 상세 페이지로 리다이렉트됨

## 참고
- 프론트엔드 `archive-service.ts`에 디버깅 로그 추가됨
- 백엔드 수정 후 정상 작동 확인 가능
