package com.feelarchive.api.capsule.controller.response;

import com.feelarchive.domain.file.entity.FileMeta;
import org.springframework.core.io.Resource;


public record TimeCapsuleImageDownloadResponse(
  FileMeta fileMeta,
  Resource resource
) {
  public static TimeCapsuleImageDownloadResponse of(FileMeta fileMeta, Resource resource) {
    return new TimeCapsuleImageDownloadResponse(fileMeta, resource);
  }
}
