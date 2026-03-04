package com.feelarchive.api.archive.controller.request;

import java.math.BigDecimal;

public record NearbyArchiveRequest(
    BigDecimal latitude,
    BigDecimal longitude,
    Double radius
) {

  public NearbyArchiveRequest {
    if (radius == null || radius <= 0.0) {
      radius = 50.0;
    }
  }
}
