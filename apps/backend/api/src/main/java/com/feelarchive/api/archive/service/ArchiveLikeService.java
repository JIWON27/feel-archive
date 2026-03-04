package com.feelarchive.api.archive.service;

import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.ALREADY_LIKED;
import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.ARCHIVE_LIKE_NOT_FOUND;

import com.feelarchive.api.user.service.UserReader;
import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.archive.entity.Archive;
import com.feelarchive.domain.archive.entity.ArchiveLike;
import com.feelarchive.domain.archive.repository.ArchiveLikeRepository;
import com.feelarchive.domain.archive.repository.ArchiveRepository;
import com.feelarchive.domain.user.entity.User;
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

    if (archiveLikeRepository.existsByUser_IdAndArchive_Id(userId, archiveId)) {
      throw new FeelArchiveException(ALREADY_LIKED);
    }

    User user = userReader.getById(userId);
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
        .orElseThrow(() -> new FeelArchiveException(ARCHIVE_LIKE_NOT_FOUND));

    archiveLikeRepository.delete(archiveLike);
    archiveRepository.decreaseLikeCount(archiveId);
  }
}
