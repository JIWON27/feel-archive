package com.feelarchive.api.archive.service;

import com.feelarchive.domain.archive.repository.ArchiveLikeRepository;
import com.feelarchive.domain.archive.repository.ArchiveScrapRepository;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ArchiveInteractionReader {

  private final ArchiveLikeRepository archiveLikeRepository;
  private final ArchiveScrapRepository archiveScrapRepository;

  @Transactional(readOnly = true)
  public Set<Long> getLikedArchiveIds(Long userId, List<Long> archiveIds) {
    return archiveLikeRepository.findArchiveIdsByUserIdAndArchiveIdIn(userId, archiveIds);
  }
  @Transactional(readOnly = true)
  public Set<Long> getScrapedArchiveIds(Long userId, List<Long> archiveIds) {
    return archiveScrapRepository.findArchiveIdsByUserIdAndArchiveIdIn(userId, archiveIds);
  }

  @Transactional(readOnly = true)
  public boolean isLiked(Long userId, Long archiveId) {
    return archiveLikeRepository.existsByUser_IdAndArchive_Id(userId, archiveId);
  }

  @Transactional(readOnly = true)
  public boolean isScraped(Long userId, Long archiveId) {
    return archiveScrapRepository.existsByUser_IdAndArchive_Id(userId, archiveId);
  }
}
