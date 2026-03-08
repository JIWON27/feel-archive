package com.feelarchive.api.archive.service;

import com.feelarchive.api.archive.controller.request.ArchiveRequest;
import com.feelarchive.api.archive.controller.response.ArchiveDetailResponse;
import com.feelarchive.api.archive.controller.response.ArchiveImageResponse;
import com.feelarchive.api.archive.controller.response.ArchiveSummaryResponse;
import com.feelarchive.api.archive.controller.response.CommonUserResponse;
import com.feelarchive.api.utils.DateUtils;
import com.feelarchive.domain.archive.entity.Archive;
import com.feelarchive.domain.archive.entity.vo.Location;
import com.feelarchive.domain.user.entity.User;
import com.feelarchive.domain.user.entity.vo.Nickname;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ArchiveMapper {
  Archive toArchive(User user, ArchiveRequest request);

  @Mapping(target = "archiveId", source = "archive.id")
  @Mapping(target = "writer", source = "archive.user")
  @Mapping(target = "contentPreview", source = "archive.content", qualifiedByName = "summaryContent")
  @Mapping(target = "createdAt", source = "archive.createdAt", qualifiedByName = "toKst")
  @Mapping(target = "latitude", source = "archive.location.latitude")
  @Mapping(target = "longitude", source = "archive.location.longitude")
  @Mapping(target = "address", source = "archive.location.locationLabel")
  ArchiveSummaryResponse toSummary(Archive archive, boolean isLiked, boolean isScraped);

  @Mapping(target = "archiveId", source = "archive.id")
  @Mapping(target = "writer", source = "archive.user")
  @Mapping(target = "createdAt", source = "archive.createdAt", qualifiedByName = "toKst")
  @Mapping(target = "updatedAt", source = "archive.updatedAt", qualifiedByName = "toKst")
  ArchiveDetailResponse toDetail(Archive archive, List<ArchiveImageResponse> images, boolean isOwner, boolean isLiked, boolean isScraped);

  @Mapping(target = "userId", source = "id")
  @Mapping(target = "nickname", source = "nickname", qualifiedByName = "nicknameToString")
  CommonUserResponse toUserResponse(User user);

  @Mapping(target = "address", source = "locationLabel")
  ArchiveDetailResponse.LocationDetail toLocationDetail(Location location);

  @Named("summaryContent")
  default String summaryContent(String content) {
    return (content.length() >= 100) ? content.substring(0,100) + "..." :  content;
  }

  @Named("nicknameToString")
  default String nicknameToString(Nickname nickname) {
    return nickname.getNickname();
  }

  @Named("toKst")
  default String toKst(LocalDateTime time) {
    if (Objects.isNull(time)) {
      return null;
    }
    return DateUtils.formatToDateTime(time);
  }

}
