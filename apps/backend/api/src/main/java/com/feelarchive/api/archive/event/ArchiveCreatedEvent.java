package com.feelarchive.api.archive.event;

import com.feelarchive.domain.emotion.entity.Emotion;

public record ArchiveCreatedEvent(
    Emotion emotion
) {
}
