package com.feelarchive.api.archive.service;


import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.ARCHIVE_NOT_FOUND;

import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.archive.entity.Archive;
import com.feelarchive.domain.archive.repository.ArchiveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ArchiveReader {

  private final ArchiveRepository archiveRepository;

  public Archive getById(Long archiveId) {
    return archiveRepository.findById(archiveId)
        .orElseThrow(() -> new FeelArchiveException(ARCHIVE_NOT_FOUND));
  }

}
