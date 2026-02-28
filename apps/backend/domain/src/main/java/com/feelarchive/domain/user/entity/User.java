package com.feelarchive.domain.user.entity;

import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.user.entity.vo.BirthDate;
import com.feelarchive.domain.user.entity.vo.Email;
import com.feelarchive.domain.user.entity.vo.Nickname;
import com.feelarchive.domain.user.entity.vo.Password;
import com.feelarchive.domain.user.entity.vo.Phone;
import com.feelarchive.domain.user.exception.UserExceptionCode;
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
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Getter
@DynamicInsert
@DynamicUpdate
@NoArgsConstructor
@Table(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
@SQLRestriction("status = 'ACTIVE'")
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

  @Column(name = "email_notification_enabled", nullable = false)
  boolean emailNotificationEnabled;

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
      throw new FeelArchiveException(UserExceptionCode.NAME_REQUIRED);
    }
  }

  private void validateGender(Gender gender) {
    if (gender == null) {
      throw new FeelArchiveException(UserExceptionCode.GENDER_REQUIRED);
    }
  }

  public void updatePassword(String newPassword) {
    this.password = new Password(newPassword);
  }

  public void updateEmailNotification(boolean value) {
    this.emailNotificationEnabled = value;
  }

  public void withdraw() {
    this.status = Status.WITHDRAWN;
  }
}
