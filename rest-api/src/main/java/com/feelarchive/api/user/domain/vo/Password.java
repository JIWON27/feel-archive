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
public class Password {
  @Column(name = "password", nullable = false)
  String password;

  public Password(String password) {
    validatePassword(password);
    this.password = password;
  }

  private void validatePassword(String password) {
    if (password == null || password.isBlank()) {
      throw new BusinessException(UserExceptionCode.PASSWORD_REQUIRED);
    }
    if (password.length() > 255) {
      throw new BusinessException(UserExceptionCode.PASSWORD_TOO_LONG);
    }
  }
}
