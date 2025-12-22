package com.feelarchive.api.archive.controller.request;

import com.feelarchive.api.archive.domain.Visibility;
import com.feelarchive.api.emotion.domain.Emotion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArchiveRequest {
  @NotNull(message = "감정 정보는 필수입니다.")
  Emotion emotion;
  @NotBlank(message = "내용을 작성해주세요.")
  String content;
  @NotNull(message = "공개/비공개 설정해주세요.")
  Visibility visibility;
  LocationRequest location;
}
