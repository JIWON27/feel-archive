package com.feelarchive.api.timeCapsule.controller.response;

import com.feelarchive.api.common.response.LocationDetail;
import com.feelarchive.domain.capsule.entity.CapsuleStatus;
import com.feelarchive.domain.emotion.entity.Emotion;

public record TimeCapsuleSummaryResponse(
    Long id,
    Emotion emotion,
    String contentPreview,
    LocationDetail location,
    CapsuleStatus status,
    String openAt,
    String createdAt
){}
