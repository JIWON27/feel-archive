package com.feelarchive.api.archive.controller.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record ArchiveDetailResponse(
  Long archiveId,
  String emotion,
  String content,
  List<ArchiveImageResponse> images,
  String visibility,
  LocationDetail location,
  String createdAt,
  String updatedAt,
  int likeCount,
  CommonUserResponse writer,
  @JsonProperty("isOwner")
  boolean isOwner,
  @JsonProperty("isLiked")
  boolean isLiked,
  @JsonProperty("isScraped")
  boolean isScraped
) {
  public record LocationDetail(
    String address,
    Double latitude,
    Double longitude
  ){}
}
