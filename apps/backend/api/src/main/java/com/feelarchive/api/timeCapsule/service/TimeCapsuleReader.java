package com.feelarchive.api.timeCapsule.service;


import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.capsule.entity.TimeCapsule;
import com.feelarchive.domain.capsule.exception.TimeCapsuleExceptionCode;
import com.feelarchive.domain.capsule.repository.TimeCapsuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TimeCapsuleReader {

  private final TimeCapsuleRepository timeCapsuleRepository;

  public TimeCapsule getById(Long archiveId) {
    return timeCapsuleRepository.findById(archiveId)
        .orElseThrow(() -> new FeelArchiveException(TimeCapsuleExceptionCode.CAPSULE_NOT_FOUND));
  }

}
