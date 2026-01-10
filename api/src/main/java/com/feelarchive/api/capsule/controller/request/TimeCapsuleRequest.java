package com.feelarchive.api.capsule.controller.request;

import com.feelarchive.domain.emotion.entity.Emotion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record TimeCapsuleRequest(
    @NotNull(message = "감정 정보는 필수입니다.")
    Emotion emotion,
    @NotBlank(message = "내용을 작성해주세요.")
    String content,
    @NotNull(message = "오픈 시간을 입력해주세요.")
    LocalDateTime openAt
) {
}
