package com.feelarchive.api.notification.controller.response;

import com.feelarchive.domain.notification.entity.NotificationType;
import java.time.LocalDateTime;

public record NotificationResponse(
    Long id,
    String title,
    String content,
    NotificationType notificationType,
    Long relatedId,
    boolean isRead,
    LocalDateTime createdAt,
    LocalDateTime readAt
) {}
