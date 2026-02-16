package com.feelarchive.api.notification.controller;

import com.feelarchive.api.common.response.PagingResponse;
import com.feelarchive.api.notification.controller.response.NotificationResponse;
import com.feelarchive.api.notification.service.NotificationService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

  private final NotificationService notificationService;

  @GetMapping
  public ResponseEntity<PagingResponse<NotificationResponse>> getNotifications(
      @AuthenticationPrincipal Long userId,
      @RequestParam(value = "isRead", required = false) Boolean isRead,
      Pageable pageable)
  {
    PagingResponse<NotificationResponse> response = notificationService.getNotifications(userId, isRead, pageable);
    return ResponseEntity.ok().body(response);
  }

  @PatchMapping("/{id}/read")
  public ResponseEntity<Void> read(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
    notificationService.read(userId, id);
    return ResponseEntity.ok().build();
  }

}
