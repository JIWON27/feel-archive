package com.feelarchive.api.emotion.service;

import com.feelarchive.api.emotion.controller.response.EmotionResponse;
import com.feelarchive.domain.emotion.entity.Emotion;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EmotionService {

  public List<EmotionResponse> getEmotions() {
    Emotion[] emotions = Emotion.values();
    return Arrays.stream(emotions).map(EmotionResponse::from).toList();
  }

}
