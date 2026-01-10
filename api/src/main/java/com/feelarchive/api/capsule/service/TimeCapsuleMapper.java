package com.feelarchive.api.capsule.service;

import com.feelarchive.api.capsule.controller.request.TimeCapsuleRequest;
import com.feelarchive.api.capsule.controller.response.TimeCapsuleDetailResponse;
import com.feelarchive.api.capsule.controller.response.TimeCapsuleImageResponse;
import com.feelarchive.api.capsule.controller.response.TimeCapsuleSummaryResponse;
import com.feelarchive.api.common.response.LocationDetail;
import com.feelarchive.domain.archive.entity.vo.Location;
import com.feelarchive.domain.capsule.entity.TimeCapsule;
import com.feelarchive.domain.user.entity.User;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface TimeCapsuleMapper {

  TimeCapsule toEntity(TimeCapsuleRequest timeCapsuleRequest, User user);

  @Mapping(target = "id", source = "id")
  @Mapping(target = "contentPreview", source = "content", qualifiedByName = "summaryContent")
  @Mapping(target = "address", source = "timeCapsule.location.locationLabel")
  @Mapping(target = "status", source = "capsuleStatus")
  @Mapping(target = "openAt", source = "openAt", dateFormat = "yyyy.MM.dd")
  @Mapping(target = "createdAt", source = "createdAt", dateFormat = "yyyy.MM.dd")
  TimeCapsuleSummaryResponse toSummary(TimeCapsule timeCapsule);

  @Mapping(target = "id", source = "timeCapsule.id")
  @Mapping(target = "status", source = "timeCapsule.capsuleStatus")
  @Mapping(target = "openAt", source = "timeCapsule.openAt", dateFormat = "yyyy.MM.dd")
  @Mapping(target = "createdAt", source = "timeCapsule.createdAt", dateFormat = "yyyy.MM.dd")
  TimeCapsuleDetailResponse toDetail(TimeCapsule timeCapsule, List<TimeCapsuleImageResponse> images);

  @Mapping(target = "address", source = "locationLabel")
  LocationDetail toLocationDetail(Location location);

  @Named("summaryContent")
  default String summaryContent(String content) {
    return (content.length() >= 100) ? content.substring(100) + "..." :  content;
  }
}
