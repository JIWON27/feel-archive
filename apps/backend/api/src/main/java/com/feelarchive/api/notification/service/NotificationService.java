package com.feelarchive.api.notification.service;

import com.feelarchive.api.common.response.PagingResponse;
import com.feelarchive.api.email.service.MailService;
import com.feelarchive.api.notification.controller.response.NotificationResponse;
import com.feelarchive.api.notification.event.NotificationEvent;
import com.feelarchive.api.timeCapsule.event.TimeCapsuleOpenedEvent;
import com.feelarchive.api.user.service.UserReader;
import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.email.entitiy.EmailLog;
import com.feelarchive.domain.email.entitiy.RelatedType;
import com.feelarchive.domain.notification.entity.Notification;
import com.feelarchive.domain.notification.entity.NotificationType;
import com.feelarchive.domain.notification.exception.NotificationExceptionCode;
import com.feelarchive.domain.notification.repository.NotificationQueryRepository;
import com.feelarchive.domain.notification.repository.NotificationRepository;
import com.feelarchive.domain.user.entity.User;
import jakarta.mail.MessagingException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService{

  private final NotificationRepository notificationRepository;
  private final NotificationQueryRepository notificationQueryRepository;
  private final SseService sseService;
  private final MailService mailService;
  private final NotificationMapper mapper;
  private final UserReader userReader;

  @Transactional
  public void sendTimeCapsuleNotification(TimeCapsuleOpenedEvent event) throws MessagingException {
    User user = userReader.getById(event.userId());

    Notification notification = Notification.builder()
        .user(user)
        .type(NotificationType.TIME_CAPSULE)
        .title("타임캡슐이 열렸습니다!")
        .content(generateNotificationContent(event.createAt(), event.openedAt()))
        .relatedId(event.timeCapsuleId())
        .build();

    notificationRepository.save(notification);

    sseService.send(user.getId(), "time-capsule", new NotificationEvent(
        notification.getId(),
        NotificationType.TIME_CAPSULE.name(),
        notification.getTitle(),
        notification.getContent(),
        notification.getRelatedId(),
        notification.getCreatedAt()
    ));

    if (user.isEmailNotificationEnabled()) {
      EmailLog log = create(event);
      mailService.sendTimeCapsuleNotificationMail(event, log);
    }
  }

  private String generateNotificationContent(LocalDateTime createdAt, LocalDateTime openedAt) {
    long daysDiff = ChronoUnit.DAYS.between(createdAt, openedAt);
    if (daysDiff <= 0) {
      return "방금 전 과거의 내가 보낸 메시지를 확인하세요!";
    } else {
      return String.format("%d일 전의 내가 보낸 메시지를 확인하세요!", daysDiff);
    }
  }

  private EmailLog create(TimeCapsuleOpenedEvent event) {
    return EmailLog.builder()
        .userId(event.userId())
        .type(RelatedType.TIME_CAPSULE)
        .relatedId(event.timeCapsuleId())
        .subject("[필아카이브] 타임캡슐이 열렸습니다!")
        .content("TEMPLATE: time-capsule-noti")
        .emailAddress(event.email())
        .build();
  }

  @Transactional
  public PagingResponse<NotificationResponse> getNotifications(Long userId, Boolean isRead, Pageable pageable) {
    Page<Notification> notifications = notificationQueryRepository.findNotifications(userId, isRead, pageable);
    Page<NotificationResponse> responses = notifications.map(mapper::toNotification);
    return PagingResponse.of(responses);
  }

  @Transactional
  public void read(Long userId, Long id) {
    Notification notification = getById(id);

    if (!notification.getUser().getId().equals(userId)) {
      throw new FeelArchiveException(NotificationExceptionCode.NOTIFICATION_FORBIDDEN);
    }

    if (notification.isRead()) {
      return;
    }

    notification.markAsRead();
  }

  @Transactional
  public void readAll(Long userId) {
    notificationRepository.bulkMarkAsRead(userId, LocalDateTime.now());
  }

  private Notification getById(Long id) {
    return notificationRepository.findById(id).
        orElseThrow(() -> new FeelArchiveException(NotificationExceptionCode.NOTIFICATION_NOT_FOUND));
  }
}
