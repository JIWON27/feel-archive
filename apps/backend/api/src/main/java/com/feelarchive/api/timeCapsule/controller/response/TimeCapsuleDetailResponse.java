package com.feelarchive.api.timeCapsule.controller.response;

import com.feelarchive.api.common.response.LocationDetail;
import com.feelarchive.domain.capsule.entity.CapsuleStatus;
import com.feelarchive.domain.emotion.entity.Emotion;
import java.util.List;

public record TimeCapsuleDetailResponse(
    Long id,
    Emotion emotion,
    String content,
    List<TimeCapsuleImageResponse> images,
    LocationDetail location,
    CapsuleStatus status,
    String openAt,
    String createdAt
){}
