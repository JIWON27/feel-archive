package com.feelarchive.api.timeCapsule.controller;

import com.feelarchive.api.timeCapsule.controller.request.TimeCapsuleRequest;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleDetailResponse;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleImageDownloadResponse;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleImageResponse;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleSummaryResponse;
import com.feelarchive.api.timeCapsule.service.TimeCapsuleImageService;
import com.feelarchive.api.timeCapsule.service.TimeCapsuleService;
import com.feelarchive.api.common.response.PagingResponse;
import com.feelarchive.domain.capsule.entity.CapsuleStatus;
import jakarta.validation.Valid;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/time-capsule")
public class TimeCapsuleController {

  private final TimeCapsuleService timeCapsuleService;
  private final TimeCapsuleImageService timeCapsuleImageService;

  @PostMapping
  public ResponseEntity<Void> createTimeCapsule(
      @AuthenticationPrincipal Long userId,
      @Valid @RequestBody TimeCapsuleRequest request)
  {
    timeCapsuleService.createTimeCapsule(userId, request);
    return ResponseEntity.ok().build();
  }

  @GetMapping
  public ResponseEntity<PagingResponse<TimeCapsuleSummaryResponse>> getMyTimeCapsules(
      @AuthenticationPrincipal Long userId,
      @RequestParam(name = "status", required = false) CapsuleStatus status,
      Pageable pageable
  ) {
    PagingResponse<TimeCapsuleSummaryResponse> response = timeCapsuleService.getMyCapsules(userId, status, pageable);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{timeCapsuleId}")
  public ResponseEntity<TimeCapsuleDetailResponse> getTimeCapsulesDetail(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long timeCapsuleId)
  {
    TimeCapsuleDetailResponse response = timeCapsuleService.getTimeCapsuleDetails(userId, timeCapsuleId);
    return ResponseEntity.ok(response);
  }

  @PutMapping("/{timeCapsuleId}")
  public ResponseEntity<Void> updateTimeCapsule(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long timeCapsuleId,
      @Valid @RequestBody TimeCapsuleRequest request)
  {
    timeCapsuleService.updateTimeCapsule(userId, timeCapsuleId, request);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{timeCapsuleId}")
  public ResponseEntity<Void> deleteTimeCapsule(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long timeCapsuleId)
  {
    timeCapsuleService.delete(userId, timeCapsuleId);
    return ResponseEntity.ok().build();
  }

  @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<List<TimeCapsuleImageResponse>> uploadImages(
      @AuthenticationPrincipal Long userId,
      @RequestPart("images") List<MultipartFile> images,
      @PathVariable Long id)
  {
    List<TimeCapsuleImageResponse> responses = timeCapsuleImageService.uploads(id, userId, images);
    return ResponseEntity.ok().body(responses);
  }

  @DeleteMapping("/{timeCapsuleId}/images/{imageId}")
  public ResponseEntity<Void> deleteImages(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long timeCapsuleId,
      @PathVariable Long imageId)
  {
    timeCapsuleImageService.delete(timeCapsuleId, imageId, userId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{timeCapsuleId}/images/{imageId}")
  public ResponseEntity<Resource> downloadImages(
      @AuthenticationPrincipal Long userId,
      @PathVariable Long timeCapsuleId,
      @PathVariable Long imageId)
  {
    TimeCapsuleImageDownloadResponse response = timeCapsuleImageService.download(timeCapsuleId, imageId, userId);

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(response.fileMeta().getContentType()))
        .contentLength(response.fileMeta().getSizeBytes())
        .header(HttpHeaders.CONTENT_DISPOSITION,
            "inline; filename=\"" + response.fileMeta().getOriginalName() + "\"")
        .body(response.resource());
  }
}
