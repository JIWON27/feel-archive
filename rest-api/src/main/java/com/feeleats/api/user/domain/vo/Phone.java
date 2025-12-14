package com.feeleats.api.user.domain.vo;

import static com.feeleats.api.user.exception.UserExceptionCode.INVALID_PHONE_FORMAT;
import static com.feeleats.api.user.exception.UserExceptionCode.PHONE_REQUIRED;

import com.feeleats.api.exception.BusinessException;
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
public class Phone {
  @Column(name = "phone", nullable = false)
  String phone;

  public Phone(String phone) {
    String normalized = normalize(phone);
    validatePhone(normalized);
    this.phone = normalized;
  }

  private String normalize(String rawPhone) {
    if (rawPhone == null) {
      return null;
    }
    return rawPhone.replaceAll("\\D", "");
  }

  private void validatePhone(String phone) {
    if (phone == null || phone.isBlank()) {
      throw new BusinessException(PHONE_REQUIRED);
    }

    if (phone.length() != 11) {
      throw new BusinessException(INVALID_PHONE_FORMAT);
    }

    if (!(phone.startsWith("010"))) {
      throw new BusinessException(INVALID_PHONE_FORMAT);
    }
  }
}
