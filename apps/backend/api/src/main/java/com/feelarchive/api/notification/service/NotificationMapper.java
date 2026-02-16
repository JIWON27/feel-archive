package com.feelarchive.api.notification.service;

import com.feelarchive.api.notification.controller.response.NotificationResponse;
import com.feelarchive.domain.notification.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
  NotificationResponse toNotification(Notification notification);

}
