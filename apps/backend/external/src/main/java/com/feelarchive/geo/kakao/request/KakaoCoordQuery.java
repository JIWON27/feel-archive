package com.feelarchive.geo.kakao.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KakaoCoordQuery {
  String x; // X(longitude), 필수
  String y; // Y(latitude), 필수
  String input_coord; // 지원 좌표계: WGS84, WCONGNAMUL, CONGNAMUL, WTM, TM (기본값: WGS84), 선택
}
