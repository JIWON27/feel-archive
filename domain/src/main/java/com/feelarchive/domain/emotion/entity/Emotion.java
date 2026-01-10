package com.feelarchive.domain.emotion.domain;

import static com.feelarchive.domain.emotion.exception.EmotionExceptionCode.EMOTION_REQUIRED;

import com.feelarchive.common.excepion.FeelArchiveException;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum Emotion {
  HAPPY("행복한", 1),
  SAD("슬픈", 2),
  ANXIOUS("불안한", 3),
  ANGRY("화난",4),
  CALM("차분한",5),
  EXCITED("신난", 6),
  LONELY("외로운", 7),
  GRATEFUL("감사한", 8),
  ;

  final String label;
  final int sortOrder;

  Emotion(String label, int sortOrder) {
    this.label = label;
    this.sortOrder = sortOrder;
  }

  public static Emotion fromLabel(String label) {
    if (Objects.isNull(label) || label.isEmpty()) {
      throw new FeelArchiveException(EMOTION_REQUIRED);
    }
    return Emotion.valueOf(label.toUpperCase());
  }
}
