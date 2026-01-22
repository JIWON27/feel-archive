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
public class KakaoCoord2AddressResponse {

  Meta meta;
  List<Document> documents;

  @Getter
  @NoArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
  public static class Meta {
    Integer totalCount;
  }

  @Getter
  @NoArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
  public static class Document {
    RoadAddress roadAddress;
    Address address;
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
    String zoneNo;
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

    String mountainYn;
    String mainAddressNo;
    String subAddressNo;
  }
}

