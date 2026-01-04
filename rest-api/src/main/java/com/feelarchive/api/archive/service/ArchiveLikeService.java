package com.feelarchive.api.archive.service;

import static com.feelarchive.api.archive.exception.ArchiveExceptionCode.ALREADY_LIKED;
import static com.feelarchive.api.archive.exception.ArchiveExceptionCode.ARCHIVE_LIKE_NOT_FOUND;

import com.feelarchive.api.archive.domain.Archive;
import com.feelarchive.api.archive.domain.ArchiveLike;
import com.feelarchive.api.archive.repository.ArchiveLikeRepository;
import com.feelarchive.api.archive.repository.ArchiveRepository;
import com.feelarchive.api.exception.BusinessException;
import com.feelarchive.api.user.domain.User;
import com.feelarchive.api.user.service.UserReader;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArchiveLikeService {

  private final ArchiveLikeRepository archiveLikeRepository;
  private final ArchiveRepository archiveRepository;
  private final ArchiveReader archiveReader;
  private final UserReader userReader;

  @Transactional
  public void like(Long archiveId, Long userId) {
    Archive archive = archiveReader.getById(archiveId);
    User user = userReader.getById(userId);

    if (archiveLikeRepository.existsByUserAndArchive(user, archive)) {
      throw new BusinessException(ALREADY_LIKED);
    }

    archiveLikeRepository.save(ArchiveLike.builder()
        .archive(archive)
        .user(user)
        .build());

    archiveRepository.increaseLikeCount(archiveId);
  }

  @Transactional
  public void unlike(Long archiveId, Long userId) {
    Archive archive = archiveReader.getById(archiveId);
    User user = userReader.getById(userId);

    ArchiveLike archiveLike = archiveLikeRepository.findByUserAndArchive(user, archive)
        .orElseThrow(() -> new BusinessException(ARCHIVE_LIKE_NOT_FOUND));

    archiveLikeRepository.delete(archiveLike);
    archiveRepository.decreaseLikeCount(archiveId);
  }
}
