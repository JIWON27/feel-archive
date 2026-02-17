package com.feelarchive.api.email.service;

import com.feelarchive.api.timeCapsule.event.TimeCapsuleOpenedEvent;
import com.feelarchive.api.utils.DateUtils;
import com.feelarchive.domain.email.entitiy.EmailLog;
import com.feelarchive.domain.email.entitiy.RelatedType;
import com.feelarchive.domain.email.repository.EmailLogRepository;
import jakarta.mail.internet.MimeMessage;
import java.time.temporal.ChronoUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class MailService {

  @Value("${app.client.base-url}")
  private String baseUrl;

  private final JavaMailSender mailSender;
  private final TemplateEngine templateEngine;
  private final EmailLogRepository emailLogRepository;

  @Transactional(noRollbackFor = {Exception.class})
  public void sendTimeCapsuleNotificationMail(TimeCapsuleOpenedEvent event) {
    MimeMessage message = mailSender.createMimeMessage();

    EmailLog log = EmailLog.builder()
        .userId(event.userId())
        .type(RelatedType.TIME_CAPSULE)
        .relatedId(event.timeCapsuleId())
        .subject("[필아카이브] 타임캡슐이 열렸습니다!")
        .content("TEMPLATE: time-capsule-noti")
        .emailAddress(event.email())
        .build();

    try {
      MimeMessageHelper messageHelper = new MimeMessageHelper(message);

      String timeAgoText = String.valueOf(ChronoUnit.DAYS.between(event.createAt(), event.openedAt()));
      String viewUrl = String.format("%s/time-capsule/%d", baseUrl, event.timeCapsuleId());

      messageHelper.setTo(event.email());
      messageHelper.setSubject("[필아카이브] 타임캡슐이 열렸습니다!");

      Context context = new Context();
      context.setVariable("timeAgoText", timeAgoText);
      context.setVariable("userName", event.name());
      context.setVariable("createdAt", DateUtils.formatToDate(event.createAt()));
      context.setVariable("openedAt", DateUtils.formatToDate(event.openedAt()));
      context.setVariable("viewUrl", viewUrl);

      String htmlContent = templateEngine.process("mail/time-capsule-noti", context);
      messageHelper.setText(htmlContent, true);

      mailSender.send(message);
      log.markAsSuccess();
    } catch (Exception e) {
      log.markAsFail(e.getMessage());
      throw new RuntimeException(e);
    } finally {
      emailLogRepository.save(log);
    }
  }
}
