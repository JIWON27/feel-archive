package com.feelarchive.api.capsule.event;

import java.time.LocalDateTime;

public record TimeCapsuleOpenedEvent(
    Long timeCapsuleId,
    Long userId,
    LocalDateTime createAt,
    LocalDateTime openedAt
) { }
