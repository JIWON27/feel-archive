package com.feelarchive.api.archive.controller;

import com.feelarchive.api.archive.controller.request.ArchiveRequest;
import com.feelarchive.api.archive.service.ArchiveService;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/archives")
public class ArchiveController {

  private final ArchiveService archiveService;

  @PostMapping
  public ResponseEntity<Void> createArchive(
      @AuthenticationPrincipal Long userId,
      @Valid @RequestBody ArchiveRequest archiveRequest)
  {
    Long archiveId = archiveService.create(userId, archiveRequest);
    return ResponseEntity.created(URI.create("/api/v1/archives/"+archiveId)).build();
  }

}
