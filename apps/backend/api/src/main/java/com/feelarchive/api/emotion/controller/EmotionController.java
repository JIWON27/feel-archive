package com.feelarchive.api.emotion.controller;

import com.feelarchive.api.emotion.controller.response.EmotionResponse;
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

  @GetMapping
  public ResponseEntity<List<EmotionResponse>> getEmotions(){
    return ResponseEntity.ok(emotionService.getEmotions());
  }
}
