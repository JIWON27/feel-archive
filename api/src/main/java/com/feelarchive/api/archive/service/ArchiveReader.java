package com.feelarchive.api.archive.service;

import static com.feelarchive.api.archive.exception.ArchiveExceptionCode.ARCHIVE_NOT_FOUND;

import com.feelarchive.api.archive.domain.Archive;
import com.feelarchive.api.archive.repository.ArchiveRepository;
import com.feelarchive.api.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ArchiveReader {

  private final ArchiveRepository archiveRepository;

  public Archive getById(Long archiveId) {
    return archiveRepository.findById(archiveId)
        .orElseThrow(() -> new BusinessException(ARCHIVE_NOT_FOUND));
  }

}
