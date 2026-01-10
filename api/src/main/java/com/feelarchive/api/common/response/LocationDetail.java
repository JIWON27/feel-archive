package com.feelarchive.api.common.response;

public record LocationDetail(
    String address,
    Double latitude,
    Double longitude
) {}
