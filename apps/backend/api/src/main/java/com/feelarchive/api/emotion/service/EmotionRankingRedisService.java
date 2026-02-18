package com.feelarchive.api.emotion.service;

import com.feelarchive.api.emotion.controller.response.EmotionWeatherResponse;
import com.feelarchive.api.utils.DateUtils;
import com.feelarchive.domain.emotion.entity.Emotion;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations.TypedTuple;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmotionRankingRedisService {

  private final StringRedisTemplate redisTemplate;
  private final String KEY_PREFIX = "emotion:ranking:"; //emotion:ranking:20260218

  public void increment(Emotion emotion) {
    String key = getTodayKey();
    boolean isNewKey = !redisTemplate.hasKey(key);
    redisTemplate.opsForZSet().incrementScore(key, emotion.name(), 1);
    if (isNewKey) {
      redisTemplate.expireAt(key, DateUtils.getEndOfToday());
    }
  }

  public List<EmotionWeatherResponse> getTopN(int n) {
    String key = getTodayKey();
    Set<TypedTuple<String>> tuples = redisTemplate.opsForZSet()
        .reverseRangeWithScores(key, 0, n -1);

    if (tuples == null) {
      return List.of();
    }

    int rank = 1;
    List<EmotionWeatherResponse> ranks = new ArrayList<>();
    for (TypedTuple<String> tuple : tuples) {
      EmotionWeatherResponse emotionWeatherResponse = new EmotionWeatherResponse(rank,
          Emotion.valueOf(tuple.getValue()), tuple.getScore().intValue());
      ranks.add(emotionWeatherResponse);
      rank++;
    }

    return ranks;
  }

  private String getTodayKey() {
    String today = DateUtils.formatToCustomDate(LocalDateTime.now(), "yyyyMMdd");
    return KEY_PREFIX + today;
  }
}
