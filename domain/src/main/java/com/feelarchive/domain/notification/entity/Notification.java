package com.feelarchive.domain.notification.entity;

import com.feelarchive.domain.user.entity.User;
import jakarta.persistence.Column;
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

@Entity
@Getter
@DynamicInsert
@DynamicUpdate
@Table(name = "notification")
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  User user;

  @Column(name = "title", nullable = false)
  String title;

  @Column(name = "content", nullable = false)
  String content;

  @Enumerated(EnumType.STRING)
  @Column(name="notification_type", nullable = false)
  NotificationType type;

  @Column(name = "related_id")
  Long relatedId;

  @Column(name = "is_read", nullable = false)
  boolean isRead;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false, nullable = false)
  LocalDateTime createdAt;

  @Column(name = "read_at")
  LocalDateTime readAt;

  @Builder
  public Notification(User user, String title, String content, NotificationType type, Long relatedId) {
    this.user = user;
    this.title = title;
    this.content = content;
    this.type = type;
    this.relatedId = relatedId;
    this.isRead = false;
  }

  public void markAsRead() {
    this.isRead = true;
    this.readAt = LocalDateTime.now();
  }

}
