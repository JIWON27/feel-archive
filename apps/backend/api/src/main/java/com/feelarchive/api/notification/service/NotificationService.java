package com.feelarchive.api.notification.service;

import com.feelarchive.api.timeCapsule.event.TimeCapsuleOpenedEvent;
import com.feelarchive.api.user.service.UserReader;
import com.feelarchive.domain.notification.entity.Notification;
import com.feelarchive.domain.notification.entity.NotificationType;
import com.feelarchive.domain.notification.repository.NotificationRepository;
import com.feelarchive.domain.user.entity.User;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService{

  private final NotificationRepository notificationRepository;
  private final UserReader userReader;

  @Transactional
  public void sendTimeCapsuleNotification(TimeCapsuleOpenedEvent event) {
    User user = userReader.getById(event.userId());

    Notification notification = Notification.builder()
        .user(user)
        .type(NotificationType.TIME_CAPSULE)
        .title("타임캡슐이 열렸습니다!")
        .content(generateNotificationContent(event.createAt(), event.openedAt()))
        .relatedId(event.timeCapsuleId())
        .build();

    notificationRepository.save(notification);

    // TODO SSE 웹 알림, 메일 알림
    log.info("[타임캡슐 알림 전송 구현체 미개발] 알림 발송 요청됨.");
  }

  private String generateNotificationContent(LocalDateTime createdAt, LocalDateTime openedAt) {
    long daysDiff = ChronoUnit.DAYS.between(createdAt, openedAt);
    if (daysDiff <= 0) {
      return "방금 전 과거의 내가 보낸 메시지를 확인하세요!";
    } else {
      return String.format("%d일 전의 내가 보낸 메시지를 확인하세요!", daysDiff);
    }
  }
}
