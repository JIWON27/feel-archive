package com.feelarchive.api.archive.controller.response;

import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArchiveSummaryResponse {
  Long archiveId;
  String emotion;
  String contentPreview;
  BigDecimal latitude;
  BigDecimal longitude;
  String address;
  String createdAt;
  int likeCount;
  CommonUserResponse writer;
}
