package com.feelarchive.common.file;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@Embeddable
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FileMeta {

  @Column(name = "storage_key", nullable = false)
  String storageKey;

  @Column(name = "original_name", nullable = false)
  String originalName;

  @Column(name = "content_type", nullable = false)
  String contentType;

  @Column(name = "size_bytes", nullable = false)
  Long sizeBytes;

  @Column(name = "extension", nullable = false)
  String extension;

  @Builder
  public FileMeta(String storageKey, String originalName, String contentType, Long sizeBytes, String extension) {
    this.storageKey = storageKey;
    this.originalName = originalName;
    this.contentType = contentType;
    this.sizeBytes = sizeBytes;
    this.extension = extension;
  }
}
