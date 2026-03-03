package com.feelarchive.api.timeCapsule.controller;

import com.feelarchive.api.common.response.PagingResponse;
import com.feelarchive.api.timeCapsule.controller.request.TimeCapsuleRequest;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleDetailResponse;
import com.feelarchive.api.timeCapsule.controller.response.TimeCapsuleSummaryResponse;
import com.feelarchive.api.timeCapsule.service.TimeCapsuleService;
import com.feelarchive.domain.capsule.entity.CapsuleStatus;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/time-capsule")
public class TimeCapsuleController {

  private final TimeCapsuleService timeCapsuleService;

  @PostMapping
  public ResponseEntity<Void> createTimeCapsule(
      @AuthenticationPrincipal Long userId,
      @Valid @RequestBody TimeCapsuleRequest request)
  {
    Long timeCapsuleId = timeCapsuleService.createTimeCapsule(userId, request);
    return ResponseEntity.created(URI.create("/api/v1/time-capsule/"+timeCapsuleId)).build();
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
}
