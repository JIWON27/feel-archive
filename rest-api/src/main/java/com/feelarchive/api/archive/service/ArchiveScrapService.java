package com.feelarchive.api.archive.service;

import static com.feelarchive.api.archive.exception.ArchiveExceptionCode.ALREADY_SCRAPPED;
import static com.feelarchive.api.archive.exception.ArchiveExceptionCode.ARCHIVE_SCRAP_NOT_FOUND;

import com.feelarchive.api.archive.controller.response.ArchiveSummaryResponse;
import com.feelarchive.api.archive.domain.Archive;
import com.feelarchive.api.archive.domain.ArchiveScrap;
import com.feelarchive.api.archive.repository.ArchiveScrapQueryRepository;
import com.feelarchive.api.archive.repository.ArchiveScrapRepository;
import com.feelarchive.api.common.response.PagingResponse;
import com.feelarchive.api.exception.BusinessException;
import com.feelarchive.api.user.domain.User;
import com.feelarchive.api.user.service.UserReader;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ArchiveScrapService {

  private final ArchiveScrapRepository archiveScrapRepository;
  private final ArchiveScrapQueryRepository archiveScrapQueryRepository;
  private final ArchiveMapper archiveMapper;
  private final ArchiveReader archiveReader;
  private final UserReader userReader;

  @Transactional
  public void scrap(Long archiveId, Long userId) {
    Archive archive = archiveReader.getById(archiveId);
    User user = userReader.getById(userId);

    if (archiveScrapRepository.existsByUserAndArchive(user, archive)) {
      throw new BusinessException(ALREADY_SCRAPPED);
    }

    archiveScrapRepository.save(ArchiveScrap.builder()
        .archive(archive)
        .user(user)
        .build());
  }

  @Transactional
  public void unScrap(Long archiveId, Long userId) {
    Archive archive = archiveReader.getById(archiveId);
    User user = userReader.getById(userId);

    ArchiveScrap archiveScrap = archiveScrapRepository.findByUserAndArchive(user, archive)
        .orElseThrow(() -> new BusinessException(ARCHIVE_SCRAP_NOT_FOUND));

    archiveScrapRepository.delete(archiveScrap);
  }

  @Transactional(readOnly = true)
  public PagingResponse<ArchiveSummaryResponse> getMyScarps(Long userId, Pageable pageable) {
    Page<ArchiveScrap> scrapPage = archiveScrapQueryRepository.getMyScraps(userId, pageable);
    Page<ArchiveSummaryResponse> summaryResponses = scrapPage
        .map(ArchiveScrap::getArchive)
        .map(archiveMapper::toSummary);
    return PagingResponse.of(summaryResponses);
  }
}
