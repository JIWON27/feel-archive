package com.feelarchive.geo;

import java.math.BigDecimal;

public interface LocationResolver {
  Location reverseGeocode(BigDecimal lat, BigDecimal lng);
  Location geocode(String address);
}
