package com.feelarchive.api.archive.controller;

import com.feelarchive.api.archive.controller.request.ArchiveRequest;
import com.feelarchive.api.archive.controller.request.ArchiveStatusUpdateRequest;
import com.feelarchive.api.archive.controller.request.ArchiveUpdateRequest;
import com.feelarchive.api.archive.controller.request.NearbyArchiveRequest;
import com.feelarchive.api.archive.controller.response.ArchiveDetailResponse;
import com.feelarchive.api.archive.controller.response.ArchiveSummaryResponse;
import com.feelarchive.api.archive.service.ArchiveLikeService;
import com.feelarchive.api.archive.service.ArchiveScrapService;
import com.feelarchive.api.archive.service.ArchiveService;
import com.feelarchive.api.common.response.PagingResponse;
import com.feelarchive.domain.archive.ArchiveSearchCondition;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/archives")
public class ArchiveController {

  private final ArchiveService archiveService;
  private final ArchiveLikeService archiveLikeService;
  private final ArchiveScrapService archiveScrapService;

  @PostMapping
  public ResponseEntity<Void> createArchive(
      @AuthenticationPrincipal Long userId,
      @Valid @RequestBody ArchiveRequest archiveRequest)
  {
    Long archiveId = archiveService.create(userId, archiveRequest);
    return ResponseEntity.created(URI.create("/api/v1/archives/"+archiveId)).build();
  }

  @PatchMapping("/{archiveId}")
  public ResponseEntity<ArchiveDetailResponse> updateArchive(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long archiveId,
      @RequestBody ArchiveUpdateRequest request)
  {
    ArchiveDetailResponse archives = archiveService.updateArchive(archiveId, request,userId);
    return ResponseEntity.ok().body(archives);
  }

  @DeleteMapping("/{archiveId}")
  public ResponseEntity<Void> deleteArchive(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long archiveId)
  {
    archiveService.deleteArchive(archiveId ,userId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public ResponseEntity<PagingResponse<ArchiveSummaryResponse>> getPublicArchives(
      @AuthenticationPrincipal Long userId,
      @ModelAttribute ArchiveSearchCondition condition,
      Pageable pageable)
  {
    PagingResponse<ArchiveSummaryResponse> response = archiveService.getPublicArchives(userId, condition, pageable);
    return ResponseEntity.ok().body(response);
  }

  @GetMapping("/{archiveId}")
  public ResponseEntity<ArchiveDetailResponse> getArchiveDetail(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long archiveId)
  {
    ArchiveDetailResponse archives = archiveService.getArchiveDetail(archiveId, userId);
    return ResponseEntity.ok().body(archives);
  }

  @GetMapping("/me")
  public ResponseEntity<PagingResponse<ArchiveSummaryResponse>> getMyArchives(
      @AuthenticationPrincipal Long userId,
      @ModelAttribute ArchiveSearchCondition condition,
      Pageable pageable)
  {
    PagingResponse<ArchiveSummaryResponse> response = archiveService.getMyArchives(userId, condition, pageable);
    return ResponseEntity.ok().body(response);
  }

  @PatchMapping("/{archiveId}/status")
  public ResponseEntity<Void> updateArchiveStatus(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long archiveId,
      @RequestBody @Valid ArchiveStatusUpdateRequest request
  ) {
    archiveService.updateStatus(archiveId, userId, request);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/{archiveId}/like")
  public ResponseEntity<Void> likeArchive(
      @PathVariable Long archiveId,
      @AuthenticationPrincipal Long userId
  ) {
    archiveLikeService.like(archiveId, userId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{archiveId}/like")
  public ResponseEntity<Void> unlikeArchive(
      @PathVariable Long archiveId,
      @AuthenticationPrincipal Long userId
  ) {
    archiveLikeService.unlike(archiveId, userId);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/{archiveId}/scrap")
  public ResponseEntity<Void> scrapArchive(
      @PathVariable Long archiveId,
      @AuthenticationPrincipal Long userId
  ) {
    archiveScrapService.scrap(archiveId, userId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{archiveId}/scrap")
  public ResponseEntity<Void> unScrapArchive(
      @PathVariable Long archiveId,
      @AuthenticationPrincipal Long userId
  ) {
    archiveScrapService.unScrap(archiveId, userId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/scraps")
  public ResponseEntity<PagingResponse<ArchiveSummaryResponse>> getScrapArchives(
      @AuthenticationPrincipal Long userId,
      Pageable pageable)
  {
    PagingResponse<ArchiveSummaryResponse> response = archiveScrapService.getMyScarps(userId, pageable);
    return ResponseEntity.ok().body(response);
  }

  @GetMapping("/nearby")
  public ResponseEntity<List<ArchiveSummaryResponse>> getNearByArchives(
      @AuthenticationPrincipal Long userId,
      @ModelAttribute NearbyArchiveRequest request)
  {
    List<ArchiveSummaryResponse> response = archiveService.getNearByArchives(userId, request);
    return ResponseEntity.ok().body(response);
  }
}
