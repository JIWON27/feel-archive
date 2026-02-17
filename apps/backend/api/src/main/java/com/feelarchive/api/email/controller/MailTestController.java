package com.feelarchive.api.email.controller;


import com.feelarchive.api.email.service.MailService;
import com.feelarchive.api.timeCapsule.event.TimeCapsuleOpenedEvent;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Profile("local")
@RestController
@RequiredArgsConstructor
public class MailTestController {

  private final MailService mailService;

  @PostMapping("/test/mail/time-capsule")
  public void testTimeCapsuleMail(
      @AuthenticationPrincipal Long userId,
      @RequestParam String email,
      @RequestParam String name)
  {
    TimeCapsuleOpenedEvent fakeEvent = new TimeCapsuleOpenedEvent(
        1L,
        userId,
        name,
        email,
        LocalDateTime.now().minusMonths(3),
        LocalDateTime.now()
    );
    mailService.sendTimeCapsuleNotificationMail(fakeEvent);
  }
}
