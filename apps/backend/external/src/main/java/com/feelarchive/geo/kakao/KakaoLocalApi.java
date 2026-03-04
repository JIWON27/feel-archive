package com.feelarchive.geo.kakao;

import com.feelarchive.geo.config.OpenFeignConfig;
import com.feelarchive.geo.kakao.request.KakaoAddressQuery;
import com.feelarchive.geo.kakao.request.KakaoCoordQuery;
import com.feelarchive.geo.kakao.response.KakaoAddress2CoordResponse;
import com.feelarchive.geo.kakao.response.KakaoCoord2AddressResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.cloud.openfeign.SpringQueryMap;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
    name = "kakao-geo",
    url = "https://dapi.kakao.com/v2/local",
    configuration = OpenFeignConfig.class
)
public interface KakaoLocalApi {

  @GetMapping("/search/address.json")
  KakaoAddress2CoordResponse getAddressToCoord(@SpringQueryMap KakaoAddressQuery params);

  @GetMapping("/geo/coord2address.json")
  KakaoCoord2AddressResponse getCoordToAddress(@SpringQueryMap KakaoCoordQuery params);
}
