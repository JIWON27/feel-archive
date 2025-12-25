package com.feelarchive.api.archive.controller.response;

import com.feelarchive.api.common.file.FileMeta;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArchiveImageDownloadResponse {
  FileMeta fileMeta;
  Resource resource;

  public static ArchiveImageDownloadResponse of(FileMeta fileMeta, Resource resource) {
    return new ArchiveImageDownloadResponse(fileMeta, resource);
  }
}
