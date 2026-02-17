package com.feelarchive.api.notification.event;

import java.time.LocalDateTime;

public record NotificationEvent(
    Long notificationId,
    String type,
    String title,
    String content,
    Long relatedId,
    LocalDateTime createdAt
) {}
