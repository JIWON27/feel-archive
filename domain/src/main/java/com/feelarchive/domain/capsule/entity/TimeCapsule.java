package com.feelarchive.domain.capsule.entity;

import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.ARCHIVE_FORBIDDEN;
import static com.feelarchive.domain.capsule.exception.TimeCapsuleExceptionCode.CANNOT_OPEN_CAPSULE;
import static com.feelarchive.domain.capsule.exception.TimeCapsuleExceptionCode.INVALID_OPEN_TIME;

import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.archive.entity.vo.Location;
import com.feelarchive.domain.emotion.entity.Emotion;
import com.feelarchive.domain.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Getter
@DynamicInsert
@DynamicUpdate
@Table(name = "time_capsule")
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE time_capsule SET deleted_at = NOW() WHERE id = ?")
public class TimeCapsule {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  User user;

  @Enumerated(EnumType.STRING)
  @Column(name = "emotion", nullable = false)
  Emotion emotion;

  @Column(name = "content", nullable = false)
  String content;

  @Embedded
  Location location;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  CapsuleStatus capsuleStatus;

  @Column(name = "is_notification_sent", nullable = false)
  boolean isNotificationSent;

  @Column(name = "open_at", nullable = false)
  LocalDateTime openAt;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false, nullable = false)
  LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  LocalDateTime updatedAt;

  @Column(name = "deleted_at")
  LocalDateTime deletedAt;

  @Builder
  public TimeCapsule(User user, Emotion emotion, String content, Location location, LocalDateTime openAt) {
    this.user = user;
    this.emotion = emotion;
    this.content = content;
    this.location = location;
    this.capsuleStatus = CapsuleStatus.LOCKED;
    this.isNotificationSent = false;
    this.openAt = openAt;

    validateOpenTime();
  }

  public void update(Emotion emotion, String content, LocalDateTime openAt) {
    validateOpenTime();

    this.emotion = emotion;
    this.content = content;
    this.openAt = openAt;
  }

  private void validateOpenTime() {
    if (this.openAt.isBefore(LocalDateTime.now())) {
      throw new FeelArchiveException(INVALID_OPEN_TIME);
    }
  }

  public boolean isOwner(Long userId) {
    return this.user.getId().equals(userId);
  }

  public void validateOwner(Long userId) {
    if (!isOwner(userId)) {
      throw new FeelArchiveException(ARCHIVE_FORBIDDEN);
    }
  }

  public boolean canOpen() {
    return capsuleStatus == CapsuleStatus.LOCKED && LocalDateTime.now().isAfter(openAt);
  }

  public void open() {
    if (!canOpen()) {
      throw new FeelArchiveException(CANNOT_OPEN_CAPSULE);
    }
    this.capsuleStatus = CapsuleStatus.OPENED;
  }

  public void markNotificationSent() {
    this.isNotificationSent = true;
  }
}
