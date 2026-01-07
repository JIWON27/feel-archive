package com.feelarchive.api.archive.controller.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommonUserResponse {
    Long userId;
    String nickname;
    // TODO 프로필 이미지 추가
}
