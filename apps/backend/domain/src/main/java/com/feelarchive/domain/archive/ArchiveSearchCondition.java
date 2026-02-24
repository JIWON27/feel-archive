package com.feelarchive.domain.archive;

import com.feelarchive.domain.emotion.entity.Emotion;

public record ArchiveSearchCondition(
    Emotion emotion,
    String keyword,
    ArchiveSortType sortType
) {}
