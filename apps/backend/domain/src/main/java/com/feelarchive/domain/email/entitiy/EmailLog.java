package com.feelarchive.domain.email.entitiy;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

@Entity
@Getter
@DynamicInsert
@DynamicUpdate
@Table(name = "email_log")
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE email_log SET deleted_at = NOW() WHERE id = ?")
public class EmailLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "user_id", nullable = false)
  Long userId;

  @Enumerated(EnumType.STRING)
  @Column(name = "related_type")
  RelatedType type;

  @Column(name = "related_id")
  Long relatedId;

  @Column(name = "email_address", nullable = false)
  String emailAddress;

  @Column(name = "subject", nullable = false)
  String subject;

  @Column(name = "content", nullable = false, columnDefinition = "TEXT")
  String content;

  @Enumerated(EnumType.STRING)
  @Column(name = "status")
  SendStatus status;

  @Column(name = "fail_reason",  columnDefinition = "TEXT")
  String failReason;

  @Column(name = "retry_count")
  int retryCount;

  @Column(name = "send_at")
  LocalDateTime sendAt;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false, nullable = false)
  LocalDateTime createdAt;

  @Column(name = "deleted_at")
  LocalDateTime deletedAt;

  @Builder
  public EmailLog(Long userId, RelatedType type, Long relatedId, String emailAddress, String subject, String content) {
    this.userId = userId;
    this.type = type;
    this.relatedId = relatedId;
    this.emailAddress = emailAddress;
    this.subject = subject;
    this.status = SendStatus.NONE;
    this.content = content;
  }

  public void markAsSuccess() {
    this.status = SendStatus.SUCCESS;
    this.sendAt = LocalDateTime.now();
    this.failReason = null;
  }

  public void markAsFail(String failReason) {
    this.status = SendStatus.FAIL;
    this.failReason = failReason;
  }

  public void incrementRetryCount() {
    this.retryCount++;
  }
}
