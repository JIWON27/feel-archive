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
public class Email {
  @Column(name = "email", nullable = false)
  String email;

  public Email(String email) {
    validateEmail(email);
    this.email = email;
  }

  private void validateEmail(String email) {
    if (email == null || email.isBlank()) {
      throw new BusinessException(UserExceptionCode.EMAIL_REQUIRED);
    }
    // TODO 이메일 형식 검증
  }

}
