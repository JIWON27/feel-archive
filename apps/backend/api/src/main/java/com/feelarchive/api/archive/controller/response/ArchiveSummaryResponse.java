package com.feelarchive.api.archive.controller.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record ArchiveSummaryResponse(
  Long archiveId,
  String emotion,
  String contentPreview,
  BigDecimal latitude,
  BigDecimal longitude,
  String address,
  String createdAt,
  int likeCount,
  @JsonProperty("isLiked")
  boolean isLiked,
  @JsonProperty("isScraped")
  boolean isScraped,
  CommonUserResponse writer
) {}
