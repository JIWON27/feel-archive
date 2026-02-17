package com.feelarchive.api.email.controller;


import com.feelarchive.api.email.service.MailService;
import com.feelarchive.api.timeCapsule.event.TimeCapsuleOpenedEvent;
import com.feelarchive.domain.email.entitiy.EmailLog;
import com.feelarchive.domain.email.entitiy.RelatedType;
import jakarta.mail.MessagingException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Profile("local")
@RestController
@RequiredArgsConstructor
public class MailTestController {

  private final MailService mailService;
  private final ApplicationEventPublisher eventPublisher;

  @PostMapping("/test/mail/time-capsule")
  public void testTimeCapsuleMail(
      @AuthenticationPrincipal Long userId,
      @RequestParam String email,
      @RequestParam String name) throws MessagingException {
    TimeCapsuleOpenedEvent fakeEvent = new TimeCapsuleOpenedEvent(
        1L,
        userId,
        name,
        email,
        LocalDateTime.now().minusMonths(3),
        LocalDateTime.now()
    );
    EmailLog log = EmailLog.builder()
        .userId(fakeEvent.userId())
        .type(RelatedType.TIME_CAPSULE)
        .relatedId(fakeEvent.timeCapsuleId())
        .subject("[필아카이브] 타임캡슐이 열렸습니다!")
        .content("TEMPLATE: time-capsule-noti")
        .emailAddress(fakeEvent.email())
        .build();
    mailService.sendTimeCapsuleNotificationMail(fakeEvent, log);
  }

  @Transactional
  @PostMapping("/test/mail/time-capsule-event")
  public void testTimeCapsuleMailEventPublish(
      @AuthenticationPrincipal Long userId,
      @RequestParam String email,
      @RequestParam String name)
  {
    eventPublisher.publishEvent(new TimeCapsuleOpenedEvent(
        1L, userId, name, email,
        LocalDateTime.now().minusMonths(3),
        LocalDateTime.now()
    ));
  }
}
