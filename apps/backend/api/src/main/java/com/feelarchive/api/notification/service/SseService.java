package com.feelarchive.api.notification.service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
@RequiredArgsConstructor
public class SseService {

  private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

  private static final long TIMEOUT = 30 * 60 * 1000L;

  public SseEmitter connect(Long userId) {
    SseEmitter emitter = new SseEmitter(TIMEOUT);

    emitter.onCompletion(() -> remove(userId));
    emitter.onTimeout(() -> remove(userId));
    emitter.onError(e -> remove(userId));

    emitters.put(userId, emitter);

    sendToEmitter(emitter, userId, "connect", "connected");
    return emitter;
  }

  public void send(Long userId, String eventName, Object data) {
    SseEmitter emitter = emitters.get(userId);
    if (emitter == null) return;
    sendToEmitter(emitter, userId, eventName, data);
  }

  public void sendToEmitter(SseEmitter emitter, Long userId, String eventName, Object data) {
    try {
      emitter.send(SseEmitter.event()
              .name(eventName)
              .data(data, MediaType.APPLICATION_JSON));
    } catch (IOException e) {
      remove(userId);
      throw new RuntimeException(e);
    }
  }

  private void remove(Long userId) {
    emitters.remove(userId);
  }

  @Scheduled(fixedDelay = 30_000)
  public void heartBeat() {
    emitters.forEach((userId, emitter) -> {
      try {
        emitter.send(SseEmitter.event()
            .comment("heartbeat"));
      } catch (IOException e) {
        remove(userId);
      }
    });
  }

}

