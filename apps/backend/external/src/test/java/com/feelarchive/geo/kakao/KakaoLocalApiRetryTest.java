package com.feelarchive.geo.kakao;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.feelarchive.geo.config.TestOpenFeignConfig;
import com.feelarchive.geo.kakao.request.KakaoAddressQuery;
import feign.Client;
import feign.RetryableException;
import java.io.IOException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@Disabled
@SpringBootTest(classes = TestOpenFeignConfig.class)
class KakaoLocalApiRetryTest {

  @Autowired
  private KakaoLocalApi api;

  @MockitoBean
  private Client client;

  @Test
  @DisplayName("네트워크 오류 발생 시 최대 횟수(3회)까지 재시도한다")
  void retryOnNetworkError() throws IOException {
    /* given */
    String address = "경기도 성남시 분당구 판교역로 166";
    KakaoAddressQuery query = KakaoAddressQuery.builder()
        .query(address)
        .build();

    given(client.execute(any(feign.Request.class), any(feign.Request.Options.class)))
        .willThrow(new IOException("테스트"));

    /* when, then */
    assertThrows(RetryableException.class, () -> api.getAddressToCoord(query));
    verify(client, times(3)).execute(any(feign.Request.class), any(feign.Request.Options.class));
  }

  @Test
  @DisplayName("네트워크 오류가 아닌 예외 발생 시 재시도하지 않는다.")
  void failOnNonRetryableException() throws IOException {
    /* given */
    String address = "경기도 성남시 분당구 판교역로 166";
    KakaoAddressQuery query = KakaoAddressQuery.builder()
        .query(address)
        .build();

    given(client.execute(any(feign.Request.class), any(feign.Request.Options.class)))
        .willThrow(new IllegalArgumentException("테스트"));

    /* when, then */
    assertThrows(IllegalArgumentException.class, () -> api.getAddressToCoord(query));
    verify(client, times(1)).execute(any(feign.Request.class), any(feign.Request.Options.class));
  }
}
