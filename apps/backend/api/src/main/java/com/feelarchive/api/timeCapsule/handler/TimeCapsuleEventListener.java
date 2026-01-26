package com.feelarchive.api.timeCapsule.handler;

import com.feelarchive.api.timeCapsule.event.TimeCapsuleOpenedEvent;
import com.feelarchive.api.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class TimeCapsuleEventListener {

  private final NotificationService notificationService;

  @Async("timeCapsuleNotificationExecutor")
  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void notificationTimeCapsule(TimeCapsuleOpenedEvent event) {
    log.info("타임캡슐 오픈 알림 이벤트 수신 - capsuleId: {}, userId: {}", event.timeCapsuleId(), event.userId());

    try {
      notificationService.sendTimeCapsuleNotification(event);
    } catch (Exception e) {
      log.error("알림 발송 실패 = ", e);
    }
  }
}
