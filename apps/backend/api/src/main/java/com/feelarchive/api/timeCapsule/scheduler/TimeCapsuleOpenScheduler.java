package com.feelarchive.api.timeCapsule.scheduler;

import com.feelarchive.api.timeCapsule.service.TimeCapsuleService;
import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.capsule.entity.TimeCapsule;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TimeCapsuleOpenScheduler {

  @Value("${app.time-capsule.batch-size}")
  private int batchSize;

  private final TimeCapsuleService timeCapsuleService;

  @Scheduled(cron = "0 * * * * *")
  public void notificationTimeCapsule() {
    Slice<TimeCapsule> timeCapsules = timeCapsuleService.openPendingCapsules(
        LocalDateTime.now(),
        PageRequest.of(0, batchSize)
    );
    for (TimeCapsule capsule : timeCapsules) {
      try {
        if (capsule.getUser().isEmailNotificationEnabled()) {
          timeCapsuleService.openOneCapsule(capsule.getId());
        }
      } catch (FeelArchiveException e) {
        log.warn("타임캡슐 오픈 실패 (ID: {}): {}", capsule.getId(), e.getMessage());
      } catch (Exception e) {
        log.error("알 수 없는 오류 발생 (ID: {})", capsule.getId(), e);
      }
    }
  }
}
