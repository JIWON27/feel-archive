package com.feelarchive.api.user.controller.response;

public record MyPageResponse(
    Long id,
    String name,
    String nickname,
    String email,
    String phone,
    String gender,
    String birthDate,
    boolean emailNotificationEnabled,
    String status,
    String createdAt
) {}
