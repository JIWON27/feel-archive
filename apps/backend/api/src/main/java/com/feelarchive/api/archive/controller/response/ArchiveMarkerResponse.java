package com.feelarchive.api.archive.controller.response;

import com.feelarchive.domain.emotion.entity.Emotion;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

public record ArchiveMarkerResponse(
    Long archiveId,
    BigDecimal latitude,
    BigDecimal longitude,
    Emotion emotion
) {
}
