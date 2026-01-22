package com.feelarchive.api.capsule.controller.request;

import com.feelarchive.api.archive.controller.request.LocationRequest;
import com.feelarchive.domain.emotion.entity.Emotion;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record TimeCapsuleRequest(
    @NotNull(message = "감정 정보는 필수입니다.")
    Emotion emotion,
    @NotBlank(message = "내용을 작성해주세요.")
    String content,
    @Future(message = "타임캡슐은 미래의 시간으로만 설정할 수 있습니다.")
    @NotNull(message = "오픈 시간을 입력해주세요.")
    LocalDateTime openAt,
    LocationRequest location
) {
}
