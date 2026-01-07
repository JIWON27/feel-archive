package com.feelarchive.api.user.domain;

import com.feelarchive.api.exception.BusinessException;
import com.feelarchive.api.user.domain.vo.BirthDate;
import com.feelarchive.api.user.domain.vo.Email;
import com.feelarchive.api.user.domain.vo.Nickname;
import com.feelarchive.api.user.domain.vo.Password;
import com.feelarchive.api.user.domain.vo.Phone;
import com.feelarchive.api.user.exception.UserExceptionCode;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Getter
@DynamicInsert // null인 컬럼은 INSERT SQL에서 제외해서 DB 디폴트값을 쓰게 해줌
@DynamicUpdate // 변경된 컬럼만 UPDATE SQL에 포함시켜 줌
@NoArgsConstructor
@Table(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "name", nullable = false)
  String name;

  @Embedded
  Email email;

  @Embedded
  Nickname nickname;

  @Embedded
  Password password;

  @Embedded
  Phone phone;

  @Column(name = "gender", nullable = false)
  @Enumerated(EnumType.STRING)
  Gender gender;

  @Embedded
  BirthDate birthDate;

  @Column(name = "role", nullable = false)
  @Enumerated(EnumType.STRING)
  Role role;

  @Column(name = "status")
  @Enumerated(EnumType.STRING)
  Status status;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  LocalDateTime updatedAt;

  @Builder
  public User(String name, String email, String nickname, String password, String phone, Gender gender, LocalDate birthDate, Role role, Status status) {
    validateName(name);
    validateGender(gender);

    this.name = name;
    this.email = new Email(email);
    this.nickname = new Nickname(nickname);
    this.password = new Password(password);
    this.phone = new Phone(phone);
    this.gender = gender;
    this.birthDate = new BirthDate(birthDate);
    this.role = (role == null) ? Role.USER : role;
    this.status = (status == null) ? Status.ACTIVE : status;
  }

  private void validateName(String name) {
    if (name == null || name.isBlank()) {
      throw new BusinessException(UserExceptionCode.NAME_REQUIRED);
    }
  }

  private void validateGender(Gender gender) {
    if (gender == null) {
      throw new BusinessException(UserExceptionCode.GENDER_REQUIRED);
    }
  }

  public void updatePassword(String newPassword) {
    this.password = new Password(newPassword);
  }
}
