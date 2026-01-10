package com.feelarchive.api.common.response;

import java.math.BigDecimal;

public record LocationDetail(
    String address,
    BigDecimal latitude,
    BigDecimal longitude
) {}
