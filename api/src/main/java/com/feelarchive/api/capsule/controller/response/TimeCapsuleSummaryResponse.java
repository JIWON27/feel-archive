package com.feelarchive.api.capsule.controller.response;

import com.feelarchive.domain.capsule.entity.CapsuleStatus;
import com.feelarchive.domain.emotion.entity.Emotion;

public record TimeCapsuleSummaryResponse(
    Long id,
    Emotion emotion,
    String contentPreview,
    String address,
    CapsuleStatus status,
    String openAt,
    String createdAt
){}
