package com.feelarchive.api.user.domain.vo;

import com.feelarchive.api.exception.BusinessException;
import com.feelarchive.api.user.exception.UserExceptionCode;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.LocalDate;
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
public class BirthDate {
  @Column(name = "birth_date", nullable = false)
  LocalDate birthDate;

  public BirthDate(LocalDate birthDate) {
    validateBirthDate(birthDate);
    this.birthDate = birthDate;
  }

  private void validateBirthDate(LocalDate birthDate) {
    if (birthDate == null) {
      throw new BusinessException(UserExceptionCode.BIRTHDATE_REQUIRED);
    }
    if (birthDate.isAfter(LocalDate.now())) {
      throw new BusinessException(UserExceptionCode.BIRTHDATE_IN_FUTURE);
    }
  }
}
