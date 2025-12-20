package com.feelarchive.api.user.domain.vo;

import com.feelarchive.api.exception.BusinessException;
import com.feelarchive.api.user.exception.UserExceptionCode;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@Embeddable
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Nickname {
  @Column(name = "nickname", nullable = false)
  String nickname;

  public Nickname(String nickname) {
    validateNickname(nickname);
    this.nickname = nickname;
  }

  private void validateNickname(String nickname) {
    if (nickname == null || nickname.isBlank()) {
      throw new BusinessException(UserExceptionCode.NICKNAME_REQUIRED);
    }
    if (nickname.length() < 2 || nickname.length() > 10) {
      throw new BusinessException(UserExceptionCode.NICKNAME_LENGTH_INVALID);
    }
    // TODO 닉네임 추가 정책
  }

}
