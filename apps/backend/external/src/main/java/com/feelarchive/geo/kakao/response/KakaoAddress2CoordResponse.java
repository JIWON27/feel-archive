package com.feelarchive.geo.kakao.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class KakaoAddress2CoordResponse {
  Meta meta;
  List<Document> documents;

  @Getter
  @NoArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
  public static class Meta {
    Integer totalCount;
    Integer pageableCount;
    Boolean isEnd;
  }

  @Getter
  @NoArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
  public static class Document {
    String addressName;
    String y;                 // 위도
    String x;                 // 경도
    AddressType addressType;
    Address address;
    RoadAddress roadAddress;
  }

  @Getter
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public enum AddressType {
    REGION("지명"),
    ROAD("도로명"),
    REGION_ADDR("지번 주소"),
    ROAD_ADDR("도로명 주소"),
    ;

    final String description;

    AddressType(String description) {
      this.description = description;
    }
  }

  @Getter
  @NoArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
  public static class Address {
    String addressName;

    @JsonProperty("region_1depth_name")
    String region1DepthName;

    @JsonProperty("region_2depth_name")
    String region2DepthName;

    @JsonProperty("region_3depth_name")
    String region3DepthName;

    @JsonProperty("region_3depth_h_name")
    String region3DepthHName;

    @JsonProperty("h_code")
    String hCode;            // 행정동 코드

    @JsonProperty("b_code")
    String bCode;            // 법정동 코드
    String mountainYn;
    String mainAddressNo;
    String subAddressNo;
    String x;                 // 경도
    String y;                 // 위도
  }

  @Getter
  @NoArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
  public static class RoadAddress {
    String addressName;

    @JsonProperty("region_1depth_name")
    String region1DepthName;

    @JsonProperty("region_2depth_name")
    String region2DepthName;

    @JsonProperty("region_3depth_name")
    String region3DepthName;

    String roadName;
    String undergroundYn;
    String mainBuildingNo;
    String subBuildingNo;
    String buildingName;
    String zoneNo;           // 우편번호
    String y;                 // 위도
    String x;                 // 경도
  }
}

