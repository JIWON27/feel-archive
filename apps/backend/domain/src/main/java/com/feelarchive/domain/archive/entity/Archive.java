package com.feelarchive.domain.archive.entity;

import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.ARCHIVE_FORBIDDEN;

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
import org.locationtech.jts.geom.Point;

@Entity
@Getter
@DynamicInsert
@DynamicUpdate
@Table(name = "archive")
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE archive SET deleted_at = NOW() WHERE id = ?")
public class Archive {

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

  @Enumerated(EnumType.STRING)
  @Column(name = "visibility", nullable = false)
  Visibility visibility;

  @Embedded
  Location location;

  @Column(name = "location")
  Point point;

  @Column(name = "like_count")
  int likeCount;

  @Column(name = "scrap_count")
  int scrapCount;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false, nullable = false)
  LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  LocalDateTime updatedAt;

  @Column(name = "deleted_at")
  LocalDateTime deletedAt;

  @Builder
  public Archive(User user, Emotion emotion, String content, Visibility visibility, Location location) {
    this.user = user;
    this.emotion = emotion;
    this.content = content;
    this.visibility = visibility;
    this.location = location;
  }

  public boolean isOwner(Long userId) {
    return this.user.getId().equals(userId);
  }

  public boolean isPublic() {
    return visibility == Visibility.PUBLIC;
  }

  public void updateVisibility(Visibility visibility) {
    this.visibility = visibility;
  }

  public void validateReadAuth(Long userId) {
    boolean isOwner = this.getUser().getId().equals(userId);

    if (!isOwner && !this.isPublic()) {
      throw new FeelArchiveException(ARCHIVE_FORBIDDEN);
    }
  }

  public void validateOwner(Long userId) {
    if (!this.getUser().getId().equals(userId)) {
      throw new FeelArchiveException(ARCHIVE_FORBIDDEN);
    }
  }

  public void update(Emotion emotion, String content, Visibility visibility, Location location) {
    this.emotion = emotion;
    this.content = content;
    this.visibility = visibility;
    this.location = location;
  }
}
