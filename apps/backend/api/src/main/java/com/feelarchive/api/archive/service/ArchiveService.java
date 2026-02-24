package com.feelarchive.api.archive.service;

import com.feelarchive.api.archive.controller.request.ArchiveRequest;
import com.feelarchive.api.archive.controller.request.ArchiveStatusUpdateRequest;
import com.feelarchive.api.archive.controller.request.ArchiveUpdateRequest;
import com.feelarchive.api.archive.controller.request.NearbyArchiveRequest;
import com.feelarchive.api.archive.controller.response.ArchiveDetailResponse;
import com.feelarchive.api.archive.controller.response.ArchiveImageResponse;
import com.feelarchive.api.archive.controller.response.ArchiveSummaryResponse;
import com.feelarchive.api.archive.event.ArchiveCreatedEvent;
import com.feelarchive.api.common.response.PagingResponse;
import com.feelarchive.api.user.service.UserReader;
import com.feelarchive.domain.archive.ArchiveSearchCondition;
import com.feelarchive.domain.archive.entity.Archive;
import com.feelarchive.domain.archive.entity.vo.Location;
import com.feelarchive.domain.archive.repository.ArchiveQueryRepository;
import com.feelarchive.domain.archive.repository.ArchiveRepository;
import com.feelarchive.domain.user.entity.User;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ArchiveService {

  private final ArchiveRepository archiveRepository;
  private final ArchiveQueryRepository archiveQueryRepository;
  private final ArchiveImageService archiveImageService;
  private final ArchiveMapper archiveMapper;
  private final ArchiveReader archiveReader;
  private final UserReader userReader;
  private final ApplicationEventPublisher eventPublisher;

  @Transactional
  public Long create(Long userId, ArchiveRequest request) {
    User user = userReader.getById(userId);
    Archive archive = archiveMapper.toArchive(user, request);
    Archive saved = archiveRepository.save(archive);

    eventPublisher.publishEvent(new ArchiveCreatedEvent(request.getEmotion()));
    return saved.getId();
  }

  @Transactional(readOnly = true)
  public PagingResponse<ArchiveSummaryResponse> getMyArchives(Long userId, ArchiveSearchCondition condition, Pageable pageable) {
    Page<Archive> pages = archiveQueryRepository.searchMyArchives(userId, condition, pageable);
    Page<ArchiveSummaryResponse> summaryResponses = pages.map(archiveMapper::toSummary);
    return PagingResponse.of(summaryResponses);
  }

  @Transactional(readOnly = true)
  public PagingResponse<ArchiveSummaryResponse> getPublicArchives(ArchiveSearchCondition condition, Pageable pageable) {
    Page<Archive> pages = archiveQueryRepository.searchPublic(condition, pageable);
    Page<ArchiveSummaryResponse> summaryResponses = pages.map(archiveMapper::toSummary);
    return PagingResponse.of(summaryResponses);
  }

  @Transactional(readOnly = true)
  public ArchiveDetailResponse getArchiveDetail(Long archiveId, Long userId) {
    Archive archive = archiveReader.getById(archiveId);
    archive.validateReadAuth(userId);

    List<ArchiveImageResponse> images = archiveImageService.getImages(archive);
    boolean isOwner = archive.getUser().getId().equals(userId);
    return archiveMapper.toDetail(archive, images, isOwner);
  }

  @Transactional
  public void updateStatus(Long archiveId, Long userId, ArchiveStatusUpdateRequest request) {
    Archive archive = archiveReader.getById(archiveId);
    archive.validateOwner(userId);

    archive.updateVisibility(request.getVisibility());
  }

  @Transactional
  public ArchiveDetailResponse updateArchive(Long archiveId, ArchiveUpdateRequest request, Long userId) {
    Archive archive = archiveReader.getById(archiveId);
    archive.validateOwner(userId);

    Location location = Optional.ofNullable(request.location())
        .map(req -> new Location(req.getLatitude(), req.getLongitude(), req.getLocationLabel()))
        .orElse(null);

    archive.update(
        request.emotion(),
        request.content(),
        request.visibility(),
        location
    );

    archiveImageService.syncImages(archive, request.imageIds());

    List<ArchiveImageResponse> images = archiveImageService.getImages(archive);
    return archiveMapper.toDetail(archive, images, true);
  }

  @Transactional
  public void deleteArchive(Long archiveId, Long userId) {
    Archive archive = archiveReader.getById(archiveId);
    archive.validateOwner(userId);
    archiveImageService.deleteAll(archive);
    archiveRepository.delete(archive);
  }

  @Transactional
  public List<ArchiveSummaryResponse> getNearByArchives(NearbyArchiveRequest request) {
    BigDecimal userLongitude = request.longitude();
    BigDecimal userLatitude = request.latitude();
    double radius = request.radius();
    List<Archive> archives = archiveQueryRepository.findNearbyArchives(userLongitude, userLatitude, radius);
    return archives.stream()
        .map(archiveMapper::toSummary)
        .toList();
  }
}
