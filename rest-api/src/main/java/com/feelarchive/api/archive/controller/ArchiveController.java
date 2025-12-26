package com.feelarchive.api.archive.controller;

import com.feelarchive.api.archive.controller.request.ArchiveRequest;
import com.feelarchive.api.archive.controller.request.ArchiveSearchCondition;
import com.feelarchive.api.archive.controller.response.ArchiveDetailResponse;
import com.feelarchive.api.archive.controller.response.ArchiveImageDownloadResponse;
import com.feelarchive.api.archive.controller.response.ArchiveImageResponse;
import com.feelarchive.api.archive.controller.response.ArchiveSummaryResponse;
import com.feelarchive.api.archive.service.ArchiveImageService;
import com.feelarchive.api.archive.service.ArchiveService;
import com.feelarchive.api.common.response.PagingResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/archives")
public class ArchiveController {

  private final ArchiveService archiveService;
  private final ArchiveImageService archiveImageService;

  @PostMapping
  public ResponseEntity<Void> createArchive(
      @AuthenticationPrincipal Long userId,
      @Valid @RequestBody ArchiveRequest archiveRequest)
  {
    Long archiveId = archiveService.create(userId, archiveRequest);
    return ResponseEntity.created(URI.create("/api/v1/archives/"+archiveId)).build();
  }

  @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<List<ArchiveImageResponse>> uploadImages(
      @AuthenticationPrincipal Long userId,
      @RequestPart("images") List<MultipartFile> images,
      @PathVariable Long id)
  {
    List<ArchiveImageResponse> responses = archiveImageService.uploads(id, userId, images);
    return ResponseEntity.ok().body(responses);
  }

  @DeleteMapping("/{archiveId}/images/{imageId}")
  public ResponseEntity<Void> deleteImages(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long archiveId,
      @PathVariable Long imageId)
  {
    archiveImageService.delete(archiveId, imageId, userId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{archiveId}/images/{imageId}")
  public ResponseEntity<Resource> downloadImages(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long archiveId,
      @PathVariable Long imageId)
  {
    ArchiveImageDownloadResponse response = archiveImageService.download(archiveId, imageId, userId);

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(response.getFileMeta().getContentType()))
        .contentLength(response.getFileMeta().getSizeBytes())
        .header(HttpHeaders.CONTENT_DISPOSITION,
            "inline; filename=\"" + response.getFileMeta().getOriginalName() + "\"")
        .body(response.getResource());
  }

  @GetMapping
  public ResponseEntity<PagingResponse<ArchiveSummaryResponse>> getPublicArchives(
      ArchiveSearchCondition archiveSearchCondition,
      Pageable pageable)
  {
    PagingResponse<ArchiveSummaryResponse> response = archiveService.getPublicArchives(archiveSearchCondition, pageable);
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
  public ResponseEntity<List<ArchiveSummaryResponse>> getMyArchives(@AuthenticationPrincipal Long userId) {
    List<ArchiveSummaryResponse> archives = archiveService.getMyArchives(userId);
    return ResponseEntity.ok().body(archives);
  }

}
