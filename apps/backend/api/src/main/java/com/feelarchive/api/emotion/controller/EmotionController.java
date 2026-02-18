package com.feelarchive.api.emotion.controller;

import com.feelarchive.api.emotion.controller.response.EmotionResponse;
import com.feelarchive.api.emotion.controller.response.EmotionWeatherResponse;
import com.feelarchive.api.emotion.service.EmotionRankingRedisService;
import com.feelarchive.api.emotion.service.EmotionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/emotions")
public class EmotionController {

  private final EmotionService emotionService;
  private final EmotionRankingRedisService rankingRedisService;

  @GetMapping
  public ResponseEntity<List<EmotionResponse>> getEmotions(){
    return ResponseEntity.ok(emotionService.getEmotions());
  }

  @GetMapping("/ranking")
  public ResponseEntity<List<EmotionWeatherResponse>> getRankEmotions() {
    List<EmotionWeatherResponse> responses = rankingRedisService.getTopN(3);
    return ResponseEntity.ok(responses);
  }
}
