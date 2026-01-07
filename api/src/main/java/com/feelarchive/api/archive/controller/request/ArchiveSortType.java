package com.feelarchive.api.archive.controller.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ArchiveSortType {
  LATEST("최신순"),
  OLDEST("오래된 순"),
  POPULAR("인기순"),
  VIEWS("조회순");

  final String description;

  ArchiveSortType(String description) {
    this.description = description;
  }
}
