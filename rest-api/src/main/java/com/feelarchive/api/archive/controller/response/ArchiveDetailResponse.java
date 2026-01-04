package com.feelarchive.api.archive.controller.response;

import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArchiveDetailResponse {
  Long archiveId;
  String emotion;
  String content;
  List<ArchiveImageResponse>  images;
  String visibility;
  LocationDetail location;
  String createdAt;
  String updatedAt;
  int likeCount;
  CommonUserResponse writer;
  boolean isOwner;

  @Getter
  @Builder
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class LocationDetail {
    String address;
    Double latitude;
    Double longitude;
  }

}
