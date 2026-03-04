package com.feelarchive.api.file.controller;

import com.feelarchive.api.archive.controller.response.ArchiveImageResponse;
import com.feelarchive.api.archive.service.ArchiveImageService;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleImageResponse;
import com.feelarchive.api.timeCapsule.service.TimeCapsuleImageService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1")
public class FileController {

  private final ArchiveImageService archiveImageService;
  private final TimeCapsuleImageService timeCapsuleImageService;

  @PostMapping(value = "/archives/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<List<ArchiveImageResponse>> uploadArchiveImages(
      @AuthenticationPrincipal Long userId,
      @RequestPart("images") List<MultipartFile> images,
      @PathVariable Long id)
  {
    List<ArchiveImageResponse> responses = archiveImageService.uploads(id, userId, images);
    return ResponseEntity.ok().body(responses);
  }

  @DeleteMapping("/archives/{archiveId}/images/{imageId}")
  public ResponseEntity<Void> deleteArchiveImages(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long archiveId,
      @PathVariable Long imageId)
  {
    archiveImageService.delete(archiveId, imageId, userId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping(value = "/time-capsule/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<List<TimeCapsuleImageResponse>> uploadTimeCapsuleImages(
      @AuthenticationPrincipal Long userId,
      @RequestPart("images") List<MultipartFile> images,
      @PathVariable Long id)
  {
    List<TimeCapsuleImageResponse> responses = timeCapsuleImageService.uploads(id, userId, images);
    return ResponseEntity.ok().body(responses);
  }

  @DeleteMapping("/time-capsule/{timeCapsuleId}/images/{imageId}")
  public ResponseEntity<Void> deleteTimeCapsuleImages(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long timeCapsuleId,
      @PathVariable Long imageId)
  {
    timeCapsuleImageService.delete(timeCapsuleId, imageId, userId);
    return ResponseEntity.noContent().build();
  }
}
