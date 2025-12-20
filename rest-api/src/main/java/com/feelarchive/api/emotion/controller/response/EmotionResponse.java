package com.feelarchive.api.emotion.controller.response;

import com.feelarchive.api.emotion.domain.Emotion;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmotionResponse {
  String name;
  String label;
  int sortOrder;

  public static EmotionResponse from(Emotion emotion) {
    return EmotionResponse.builder()
        .name(emotion.name())
        .label(emotion.getLabel())
        .sortOrder(emotion.getSortOrder())
        .build();
  }
}
