package com.feelarchive.api.archive.service;


import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.ALREADY_SCRAPPED;
import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.ARCHIVE_SCRAP_NOT_FOUND;

import com.feelarchive.api.archive.controller.response.ArchiveSummaryResponse;
import com.feelarchive.api.common.response.PagingResponse;
import com.feelarchive.api.user.service.UserReader;
import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.archive.entity.Archive;
import com.feelarchive.domain.archive.entity.ArchiveScrap;
import com.feelarchive.domain.archive.repository.ArchiveLikeRepository;
import com.feelarchive.domain.archive.repository.ArchiveRepository;
import com.feelarchive.domain.archive.repository.ArchiveScrapQueryRepository;
import com.feelarchive.domain.archive.repository.ArchiveScrapRepository;
import com.feelarchive.domain.user.entity.User;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ArchiveScrapService {

  private final ArchiveScrapRepository archiveScrapRepository;
  private final ArchiveLikeRepository archiveLikeRepository;
  private final ArchiveScrapQueryRepository archiveScrapQueryRepository;
  private final ArchiveRepository archiveRepository;
  private final ArchiveMapper archiveMapper;
  private final ArchiveReader archiveReader;
  private final UserReader userReader;

  @Transactional
  public void scrap(Long archiveId, Long userId) {
    Archive archive = archiveReader.getById(archiveId);

    if (archiveScrapRepository.existsByUser_IdAndArchive_Id(userId, archiveId)) {
      throw new FeelArchiveException(ALREADY_SCRAPPED);
    }

    User user = userReader.getById(userId);
    archiveScrapRepository.save(ArchiveScrap.builder()
        .archive(archive)
        .user(user)
        .build());

    archiveRepository.increaseScrapCount(archiveId);
  }

  @Transactional
  public void unScrap(Long archiveId, Long userId) {
    ArchiveScrap archiveScrap = archiveScrapRepository.findByUser_IdAndArchive_Id(userId, archiveId)
        .orElseThrow(() -> new FeelArchiveException(ARCHIVE_SCRAP_NOT_FOUND));

    archiveScrapRepository.delete(archiveScrap);
    archiveRepository.decreaseScrapCount(archiveId);
  }

  @Transactional(readOnly = true)
  public PagingResponse<ArchiveSummaryResponse> getMyScarps(Long userId, Pageable pageable) {
    Page<ArchiveScrap> pages = archiveScrapQueryRepository.getMyScraps(userId, pageable);

    List<Long> archiveIds = pages.map(ArchiveScrap::getArchive).map(Archive::getId).toList();
    Set<Long> likedIds = archiveLikeRepository.findArchiveIdsByUserIdAndArchiveIdIn(userId, archiveIds);
    Set<Long> scrapedIds = archiveScrapRepository.findArchiveIdsByUserIdAndArchiveIdIn(userId, archiveIds);

    Page<ArchiveSummaryResponse> summaryResponses = pages
        .map(ArchiveScrap::getArchive)
        .map(archive -> archiveMapper.toSummary(archive, likedIds.contains(archive.getId()), scrapedIds.contains(archive.getId())));
    return PagingResponse.of(summaryResponses);
  }
}
