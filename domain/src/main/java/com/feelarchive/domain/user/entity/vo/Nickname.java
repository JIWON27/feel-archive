package com.feelarchive.domain.user.entity.vo;

import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.user.exception.UserExceptionCode;
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
      throw new FeelArchiveException(UserExceptionCode.NICKNAME_REQUIRED);
    }
    if (nickname.length() < 2 || nickname.length() > 10) {
      throw new FeelArchiveException(UserExceptionCode.NICKNAME_LENGTH_INVALID);
    }
    // TODO 닉네임 추가 정책
  }

}
