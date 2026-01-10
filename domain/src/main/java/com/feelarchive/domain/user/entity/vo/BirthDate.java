package com.feelarchive.domain.user.domain.vo;

import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.user.exception.UserExceptionCode;
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
      throw new FeelArchiveException(UserExceptionCode.BIRTHDATE_REQUIRED);
    }
    if (birthDate.isAfter(LocalDate.now())) {
      throw new FeelArchiveException(UserExceptionCode.BIRTHDATE_IN_FUTURE);
    }
  }
}
