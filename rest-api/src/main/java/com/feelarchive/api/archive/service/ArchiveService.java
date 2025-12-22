package com.feelarchive.api.archive.service;

import com.feelarchive.api.archive.controller.request.ArchiveRequest;
import com.feelarchive.api.archive.domain.Archive;
import com.feelarchive.api.archive.repository.ArchiveRepository;
import com.feelarchive.api.user.domain.User;
import com.feelarchive.api.user.service.UserReader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ArchiveService {

  private final ArchiveRepository archiveRepository;
  private final ArchiveMapper archiveMapper;
  private final UserReader userReader;

  @Transactional
  public Long create(Long userId, ArchiveRequest request) {
    User user = userReader.getById(userId);
    Archive archive = archiveMapper.toArchive(user, request);
    Archive saved = archiveRepository.save(archive);
    return saved.getId();
  }

}
