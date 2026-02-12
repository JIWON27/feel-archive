package com.feelarchive.api.archive.controller.request;

import java.math.BigDecimal;

public record NearbyArchiveRequest(
    BigDecimal latitude,
    BigDecimal longitude,
    double radius
) {

  public NearbyArchiveRequest {
    if (radius <= 0.0 ) {
      radius = 50.0;
    }
  }
}
