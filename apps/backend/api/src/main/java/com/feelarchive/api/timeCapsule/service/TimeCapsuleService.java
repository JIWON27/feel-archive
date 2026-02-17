package com.feelarchive.api.timeCapsule.service;

import static com.feelarchive.domain.capsule.exception.TimeCapsuleExceptionCode.CAPSULE_EDIT_TIME_EXPIRED;
import static com.feelarchive.domain.capsule.exception.TimeCapsuleExceptionCode.CAPSULE_NOT_FOUND;

import com.feelarchive.api.common.response.PagingResponse;
import com.feelarchive.api.timeCapsule.controller.request.TimeCapsuleRequest;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleDetailResponse;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleImageResponse;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleSummaryResponse;
import com.feelarchive.api.timeCapsule.event.TimeCapsuleOpenedEvent;
import com.feelarchive.api.user.service.UserReader;
import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.capsule.entity.CapsuleStatus;
import com.feelarchive.domain.capsule.entity.TimeCapsule;
import com.feelarchive.domain.capsule.repository.TimeCapsuleQueryRepository;
import com.feelarchive.domain.capsule.repository.TimeCapsuleRepository;
import com.feelarchive.domain.user.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TimeCapsuleService {

  private final TimeCapsuleRepository timeCapsuleRepository;
  private final TimeCapsuleQueryRepository timeCapsuleQueryRepository;
  private final TimeCapsuleImageService timeCapsuleImageService;
  private final UserReader userReader;
  private final TimeCapsuleMapper timeCapsuleMapper;
  private final ApplicationEventPublisher eventPublisher;

  @Transactional
  public void createTimeCapsule(Long userId, TimeCapsuleRequest request) {
    User user = userReader.getById(userId);
    TimeCapsule timeCapsule = timeCapsuleMapper.toEntity(request, user);
    timeCapsuleRepository.save(timeCapsule);
  }

  @Transactional(readOnly = true)
  public PagingResponse<TimeCapsuleSummaryResponse> getMyCapsules(Long userId, CapsuleStatus capsuleStatus, Pageable pageable){
    Page<TimeCapsule> capsulePage = timeCapsuleQueryRepository.getMyTimeCapsule(userId, capsuleStatus, pageable);
    Page<TimeCapsuleSummaryResponse> summaryResponses = capsulePage.map(timeCapsuleMapper::toSummary);
    return PagingResponse.of(summaryResponses);
  }

  @Transactional(readOnly = true)
  public TimeCapsuleDetailResponse getTimeCapsuleDetails(Long userId, Long timeCapsuleId){
    TimeCapsule timeCapsule = timeCapsuleRepository.findById(timeCapsuleId)
        .orElseThrow(() -> new FeelArchiveException(CAPSULE_NOT_FOUND));

    timeCapsule.validateOwner(userId);
    List<TimeCapsuleImageResponse> images = timeCapsuleImageService.getImages(timeCapsule);
    return timeCapsuleMapper.toDetail(timeCapsule, images);

  }

  @Transactional
  public void updateTimeCapsule(Long userId, Long timeCapsuleId, TimeCapsuleRequest request) {
    TimeCapsule timeCapsule = getById(timeCapsuleId);

    timeCapsule.validateOwner(userId);
    if (!timeCapsule.isEditable()) {
      throw new FeelArchiveException(CAPSULE_EDIT_TIME_EXPIRED);
    }

    timeCapsule.update(request.emotion(), request.content(), request.openAt());
  }

  @Transactional
  public void delete(Long userId, Long timeCapsuleId) {
    TimeCapsule timeCapsule = getById(timeCapsuleId);

    timeCapsule.validateOwner(userId);
    timeCapsuleRepository.delete(timeCapsule);
  }

  @Transactional(readOnly = true)
  public Slice<TimeCapsule> openPendingCapsules(LocalDateTime time, Pageable pageable) {
    return timeCapsuleRepository.findPendingCapsules(CapsuleStatus.LOCKED, time, pageable);
  }

  @Transactional
  public void openOneCapsule(Long capsuleId) {
    TimeCapsule capsule = getById(capsuleId);

    capsule.updateStatus(CapsuleStatus.OPENED);

    eventPublisher.publishEvent(new TimeCapsuleOpenedEvent(
        capsule.getId(),
        capsule.getUser().getId(),
        capsule.getUser().getName(),
        capsule.getUser().getEmail().getEmail(),
        capsule.getCreatedAt(),
        capsule.getOpenAt()
    ));
  }

  private TimeCapsule getById(Long archiveId) {
    return timeCapsuleRepository.findById(archiveId)
        .orElseThrow(() -> new FeelArchiveException(CAPSULE_NOT_FOUND));
  }
}
