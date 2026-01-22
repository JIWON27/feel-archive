package com.feelarchive.api.archive.controller.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArchiveStatusUpdateRequest {
  com.feelarchive.domain.archive.entity.Visibility visibility;
}
