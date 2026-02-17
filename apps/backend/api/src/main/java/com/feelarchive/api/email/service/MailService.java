package com.feelarchive.api.email.service;

import com.feelarchive.api.timeCapsule.event.TimeCapsuleOpenedEvent;
import com.feelarchive.api.utils.DateUtils;
import com.feelarchive.domain.email.entitiy.EmailLog;
import com.feelarchive.domain.email.repository.EmailLogRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.temporal.ChronoUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
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

  @Retryable(
      retryFor = MessagingException.class,
      maxAttempts = 3,
      backoff = @Backoff(delay = 1000, multiplier = 2)
  )
  @Transactional(propagation = Propagation.REQUIRES_NEW, noRollbackFor = {Exception.class})
  public void sendTimeCapsuleNotificationMail(TimeCapsuleOpenedEvent event, EmailLog log)
      throws MessagingException {
    MimeMessage message = mailSender.createMimeMessage();

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
    } catch (MessagingException e) {
      log.markAsFail(e.getMessage());
      log.incrementRetryCount();
      throw e;
    } catch (Exception e) {
      log.markAsFail(e.getMessage());
      throw new RuntimeException(e);
    } finally {
      emailLogRepository.save(log);
    }
  }

}
