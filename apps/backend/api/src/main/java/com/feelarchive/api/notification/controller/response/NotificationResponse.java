package com.feelarchive.api.notification.controller.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.feelarchive.domain.notification.entity.NotificationType;
import java.time.LocalDateTime;

public record NotificationResponse(
    Long id,
    String title,
    String content,
    NotificationType notificationType,
    Long relatedId,
    @JsonProperty("isRead")
    boolean read,
    LocalDateTime createdAt,
    LocalDateTime readAt
) {}
