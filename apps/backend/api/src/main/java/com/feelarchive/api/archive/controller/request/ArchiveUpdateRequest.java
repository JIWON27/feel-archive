package com.feelarchive.api.archive.controller.request;

import com.feelarchive.domain.archive.entity.Visibility;
import com.feelarchive.domain.emotion.entity.Emotion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ArchiveUpdateRequest(
    @NotNull(message = "감정 정보는 필수입니다.")
    Emotion emotion,
    @NotBlank(message = "내용을 작성해주세요.")
    String content,
    @NotNull(message = "공개/비공개 설정해주세요.")
    Visibility visibility,
    LocationRequest location,
    List<Long> imageIds
) { }
