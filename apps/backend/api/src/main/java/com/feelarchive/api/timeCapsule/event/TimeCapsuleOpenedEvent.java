package com.feelarchive.api.timeCapsule.event;

import java.time.LocalDateTime;

public record TimeCapsuleOpenedEvent(
    Long timeCapsuleId,
    Long userId,
    LocalDateTime createAt,
    LocalDateTime openedAt
) { }
