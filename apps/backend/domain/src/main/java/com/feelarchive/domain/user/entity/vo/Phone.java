package com.feelarchive.domain.user.entity.vo;

import static com.feelarchive.domain.user.exception.UserExceptionCode.INVALID_PHONE_FORMAT;
import static com.feelarchive.domain.user.exception.UserExceptionCode.PHONE_REQUIRED;

import com.feelarchive.common.excepion.FeelArchiveException;
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
      throw new FeelArchiveException(PHONE_REQUIRED);
    }

    if (phone.length() != 11) {
      throw new FeelArchiveException(INVALID_PHONE_FORMAT);
    }

    if (!(phone.startsWith("010"))) {
      throw new FeelArchiveException(INVALID_PHONE_FORMAT);
    }
  }
}
