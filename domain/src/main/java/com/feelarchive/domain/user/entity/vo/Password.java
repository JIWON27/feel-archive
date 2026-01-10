package com.feelarchive.domain.user.domain.vo;

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
public class Password {
  @Column(name = "password", nullable = false)
  String password;

  public Password(String password) {
    validatePassword(password);
    this.password = password;
  }

  private void validatePassword(String password) {
    if (password == null || password.isBlank()) {
      throw new FeelArchiveException(UserExceptionCode.PASSWORD_REQUIRED);
    }
    if (password.length() > 255) {
      throw new FeelArchiveException(UserExceptionCode.PASSWORD_TOO_LONG);
    }
  }
}
