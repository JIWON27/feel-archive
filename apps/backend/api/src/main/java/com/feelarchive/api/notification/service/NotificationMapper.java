package com.feelarchive.api.notification.service;

import com.feelarchive.api.notification.controller.response.NotificationResponse;
import com.feelarchive.api.utils.DateUtils;
import com.feelarchive.domain.notification.entity.Notification;
import java.time.LocalDateTime;
import java.util.Objects;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

  @Mapping(target = "createdAt", source = "notification.createdAt", qualifiedByName = "toKst")
  @Mapping(target = "readAt", source = "notification.readAt", qualifiedByName = "toKst")
  NotificationResponse toNotification(Notification notification);

  @Named("toKst")
  default String toKst(LocalDateTime time) {
    if (Objects.isNull(time)) {
      return null;
    }
    return DateUtils.formatToDateTime(time);
  }
}
