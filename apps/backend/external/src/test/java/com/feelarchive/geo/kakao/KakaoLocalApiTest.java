package com.feelarchive.geo.kakao;

import static org.assertj.core.api.Assertions.assertThat;

import com.feelarchive.geo.config.TestOpenFeignConfig;
import com.feelarchive.geo.kakao.request.KakaoAddressQuery;
import com.feelarchive.geo.kakao.request.KakaoCoordQuery;
import com.feelarchive.geo.kakao.response.KakaoAddress2CoordResponse;
import com.feelarchive.geo.kakao.response.KakaoCoord2AddressResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = TestOpenFeignConfig.class)
class KakaoLocalApiTest {

  @Autowired
  private KakaoLocalApi api;

  @Test
  @DisplayName("주소 정보를 통해 좌표값을 받아온다.")
  void successGeocoding() {
    /* given */
    String address = "경기도 성남시 분당구 판교역로 166";
    KakaoAddressQuery query = KakaoAddressQuery.builder()
        .query(address)
        .build();

    /* when */
    KakaoAddress2CoordResponse response = api.getAddressToCoord(query);

    /* then */
    KakaoAddress2CoordResponse.Document document = response.getDocuments().get(0);

    String addressName = document.getAddress().getAddressName();
    String x = document.getX();
    String y = document.getY();

    assertThat(addressName).contains("경기 성남시 분당구 백현동 532");
    assertThat(x).isNotNull();
    assertThat(y).isNotNull();
  }

  @Test
  @DisplayName("좌표값을 통해 주소를 받아온다.")
  void successReverseGeocoding () {
    /* given */
    String x = "127.110449292622";
    String y = "37.3952969470752";
    KakaoCoordQuery query = KakaoCoordQuery.builder()
        .x(x)
        .y(y)
        .build();

    /* when */
    KakaoCoord2AddressResponse response = api.getCoordToAddress(query);

    /* then */
    KakaoCoord2AddressResponse.Document document = response.getDocuments().get(0);

    String addressName = document.getAddress().getAddressName();
    String roadAddressName = document.getRoadAddress().getAddressName();

    assertThat(addressName).contains("경기 성남시 분당구 백현동 532");
    assertThat(roadAddressName).contains("경기도 성남시 분당구 판교역로 166");
  }
}
