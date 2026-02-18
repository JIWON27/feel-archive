package com.feelarchive.api.emotion.handler;

import com.feelarchive.api.archive.event.ArchiveCreatedEvent;
import com.feelarchive.api.emotion.service.EmotionRankingRedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class EmotionEventHandler {

  private final EmotionRankingRedisService rankingRedisService;

  // 메서드명 다듬기
  @Async("emotionRankingExecutor")
  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void archiveCreatedEvent(ArchiveCreatedEvent event) {
    rankingRedisService.increment(event.emotion());
  }

}
