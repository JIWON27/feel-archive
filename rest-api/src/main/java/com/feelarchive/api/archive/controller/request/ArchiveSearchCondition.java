package com.feelarchive.api.archive.controller.request;

import com.feelarchive.api.emotion.domain.Emotion;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArchiveSearchCondition {
  Emotion emotion;
  String keyword;
  ArchiveSortType sortType;
}
