package com.feelarchive.api.archive.domain;

import com.feelarchive.api.common.file.FileMeta;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
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

@Entity
@Getter
@DynamicInsert
@DynamicUpdate
@Table(name = "archive_image")
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE archive_image SET deleted_at = NOW() WHERE id = ?")
public class ArchiveImage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "archive_id", nullable = false)
  Archive archive;

  @Embedded
  FileMeta fileMeta;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false, nullable = false)
  LocalDateTime createdAt;

  @Column(name = "deleted_at")
  LocalDateTime deletedAt;

  @Builder
  public ArchiveImage(Long id, Archive archive, FileMeta fileMeta) {
    this.id = id;
    this.archive = archive;
    this.fileMeta = fileMeta;
  }
}
