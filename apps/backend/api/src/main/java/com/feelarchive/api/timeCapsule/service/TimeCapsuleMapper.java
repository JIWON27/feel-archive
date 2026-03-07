package com.feelarchive.api.timeCapsule.service;

import com.feelarchive.api.common.response.LocationDetail;
import com.feelarchive.api.timeCapsule.controller.request.TimeCapsuleRequest;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleDetailResponse;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleImageResponse;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleSummaryResponse;
import com.feelarchive.domain.archive.entity.vo.Location;
import com.feelarchive.domain.capsule.entity.CapsuleStatus;
import com.feelarchive.domain.capsule.entity.TimeCapsule;
import com.feelarchive.domain.user.entity.User;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface TimeCapsuleMapper {

  @Mapping(target = "openAt", source = "request.openAt", qualifiedByName = "toUtc")
  TimeCapsule toEntity(TimeCapsuleRequest request, User user);

  @Named("toUtc")
  default LocalDateTime toUtc(OffsetDateTime offsetDateTime) {
      return offsetDateTime.withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();
  }

  default TimeCapsuleSummaryResponse toSummary(TimeCapsule capsule) {
    boolean isVisible = isTimeCapsuleVisible(capsule);

    return new TimeCapsuleSummaryResponse(
        capsule.getId(),
        isVisible ? capsule.getEmotion() : null,
        isVisible ? summaryContent(capsule.getContent()) : null,
        isVisible ? convertLocation(capsule.getLocation()) : null,
        capsule.getCapsuleStatus(),
        formatDate(capsule.getOpenAt()),
        formatDate(capsule.getCreatedAt())
    );
  }

  default TimeCapsuleDetailResponse toDetail(TimeCapsule capsule,
      List<TimeCapsuleImageResponse> images) {
    boolean isVisible = isTimeCapsuleVisible(capsule);

    return new TimeCapsuleDetailResponse(
        capsule.getId(),
        isVisible ? capsule.getEmotion() : null,
        isVisible ? capsule.getContent() : null,
        isVisible ? images : Collections.emptyList(),
        isVisible ? convertLocation(capsule.getLocation()) : null,
        capsule.getCapsuleStatus(),
        formatDate(capsule.getOpenAt()),
        formatDate(capsule.getCreatedAt())
    );
  }


  default String summaryContent(String content) {
    return (content.length() >= 100) ? content.substring(100) + "..." :  content;
  }

  private LocationDetail convertLocation(Location location) {
    if (location == null) return null;
    return new LocationDetail(location.getLocationLabel(), location.getLatitude(), location.getLongitude());
  }

  private boolean isTimeCapsuleVisible(TimeCapsule capsule) {
    return capsule.getCapsuleStatus() == CapsuleStatus.OPENED || capsule.isEditable();
  }

  private String formatDate(LocalDateTime dateTime) {
    if (Objects.isNull(dateTime)) {
      return null;
    }
    return dateTime
        .atOffset(ZoneOffset.UTC)
        .withOffsetSameInstant(ZoneOffset.of("+09:00"))
        .format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
  }
}
