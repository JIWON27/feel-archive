package com.feelarchive.domain.archive;

import com.feelarchive.domain.emotion.entity.Emotion;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArchiveSearchCondition {
  @Setter
  Long userId;
  Emotion emotion;
  String keyword;
  ArchiveSortType sortType;

}
