package com.feelarchive.api.notification.controller.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.feelarchive.domain.notification.entity.NotificationType;

public record NotificationResponse(
    Long id,
    String title,
    String content,
    NotificationType notificationType,
    Long relatedId,
    @JsonProperty("isRead")
    boolean read,
    String createdAt,
    String readAt
) {}
