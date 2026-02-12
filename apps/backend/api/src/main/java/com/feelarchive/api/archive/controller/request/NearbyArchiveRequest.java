package com.feelarchive.api.archive.controller.request;

import java.math.BigDecimal;

public record NearbyArchiveRequest(
    BigDecimal latitude,
    BigDecimal longitude,
    double radius
) {}
