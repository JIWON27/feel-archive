package com.feelarchive.geo.kakao;

import com.feelarchive.geo.Location;
import com.feelarchive.geo.LocationResolver;
import com.feelarchive.geo.exception.GeoExceptionCode;
import com.feelarchive.geo.exception.GeoProviderException;
import com.feelarchive.geo.kakao.request.KakaoAddressQuery;
import com.feelarchive.geo.kakao.request.KakaoCoordQuery;
import com.feelarchive.geo.kakao.response.KakaoAddress2CoordResponse;
import com.feelarchive.geo.kakao.response.KakaoCoord2AddressResponse;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KakaoLocationResolver implements LocationResolver {

  private final KakaoLocalApi api;

  @Override
  public Location reverseGeocode(BigDecimal lat, BigDecimal lng) {
    String x = lng.toPlainString();
    String y = lat.toPlainString();

    KakaoCoordQuery query = KakaoCoordQuery.builder()
        .x(x)
        .y(y)
        .build();
    KakaoCoord2AddressResponse response = api.getCoordToAddress(query);

    if (response.getDocuments() == null || response.getDocuments().isEmpty()) {
      throw new GeoProviderException(GeoExceptionCode.NOT_FOUND_LOCATION);
    }

    KakaoCoord2AddressResponse.Document document = response.getDocuments().get(0);

    return Location.builder()
        .latitude(lat)
        .longitude(lng)
        .address(document.getAddress().getAddressName())
        .build();
  }

  @Override
  public Location geocode(String address) {
    KakaoAddressQuery query = KakaoAddressQuery.builder()
        .query(address)
        .build();
    KakaoAddress2CoordResponse response = api.getAddressToCoord(query);

    if (response.getDocuments() == null || response.getDocuments().isEmpty()) {
      throw new GeoProviderException(GeoExceptionCode.NOT_FOUND_LOCATION);
    }

    KakaoAddress2CoordResponse.Document document = response.getDocuments().get(0);

    String x = document.getX();
    String y = document.getY();
    return Location.builder()
        .latitude(new BigDecimal(y))
        .longitude(new BigDecimal(x))
        .address(document.getAddress().getAddressName())
        .build();
  }
}
