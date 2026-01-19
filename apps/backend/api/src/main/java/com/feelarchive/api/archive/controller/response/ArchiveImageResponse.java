package com.feelarchive.api.archive.controller.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArchiveImageResponse {
  Long id;
  String url;

  public static ArchiveImageResponse of(Long id, String url) {
    return new ArchiveImageResponse(id, url);
  }
}
