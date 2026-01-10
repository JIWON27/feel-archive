package com.feelarchive.api.capsule.service;

import static com.feelarchive.domain.capsule.exception.TimeCapsuleExceptionCode.CAPSULE_FORBIDDEN;
import static com.feelarchive.domain.capsule.exception.TimeCapsuleExceptionCode.CAPSULE_IMAGE_NOT_FOUND;
import static com.feelarchive.domain.file.exception.FileExceptionCode.FILE_NOT_FOUND;
import static com.feelarchive.domain.file.exception.FileExceptionCode.FILE_NOT_READABLE;

import com.feelarchive.api.capsule.controller.response.TimeCapsuleImageDownloadResponse;
import com.feelarchive.api.capsule.controller.response.TimeCapsuleImageResponse;
import com.feelarchive.api.common.file.FileProperties;
import com.feelarchive.api.common.file.FileService;
import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.capsule.entity.TimeCapsule;
import com.feelarchive.domain.capsule.entity.TimeCapsuleImage;
import com.feelarchive.domain.capsule.repository.TimeCapsuleImageRepository;
import com.feelarchive.domain.file.entity.FileMeta;
import com.feelarchive.domain.file.exception.FileExceptionCode;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class TimeCapsuleImageService {

  private final TimeCapsuleReader capsuleReader;
  private final FileService fileService;
  private final FileProperties fileProperties;
  private final TimeCapsuleImageRepository timeCapsuleImageRepository;

  @Transactional
  public List<TimeCapsuleImageResponse> uploads(Long timeCapsuleId, Long userId, List<MultipartFile> files) {
    TimeCapsule timeCapsule = capsuleReader.getById(timeCapsuleId);
    checkOwner(timeCapsule, userId);

    List<TimeCapsuleImage> capsules = new ArrayList<>();

    for (MultipartFile file : files) {
      FileMeta fileMeta = fileService.upload("time-capsule/" + timeCapsuleId, file);
      capsules.add(TimeCapsuleImage.builder()
          .timeCapsule(timeCapsule)
          .fileMeta(fileMeta)
          .build());
    }
    List<TimeCapsuleImage> timeCapsuleImages = timeCapsuleImageRepository.saveAll(capsules);
    return timeCapsuleImages.stream().map(TimeCapsuleImage -> TimeCapsuleImageResponse.of(TimeCapsuleImage.getId(), generateDownloadUrl(timeCapsuleId, TimeCapsuleImage))).toList();
  }

  @Transactional
  public void delete(Long timeCapsuleId, Long imageId, Long userId) {
    TimeCapsuleImage image = getTimeCapsuleImage(imageId, timeCapsuleId);
    TimeCapsule timeCapsule = image.getTimeCapsule();
    checkOwner(timeCapsule, userId);

    timeCapsuleImageRepository.delete(image);

    FileMeta fileMeta = image.getFileMeta();
    fileService.delete(fileMeta.getStorageKey());
  }

  @Transactional
  public TimeCapsuleImageDownloadResponse download(Long timeCapsuleId, Long imageId, Long userId) {
    TimeCapsuleImage image = getTimeCapsuleImage(timeCapsuleId, imageId);
    TimeCapsule timeCapsule = image.getTimeCapsule();
    FileMeta fileMeta = image.getFileMeta();
    Path fullPath = fileService.getFullPath(fileMeta.getStorageKey());

    checkOwner(timeCapsule, userId);

    try {
      UrlResource resource = new UrlResource(fullPath.toUri());
      if (!resource.exists()) {
        throw new FeelArchiveException(FILE_NOT_FOUND);
      }
      if (!resource.isReadable()) {
        throw new FeelArchiveException(FILE_NOT_READABLE);
      }

      return TimeCapsuleImageDownloadResponse.of(fileMeta, resource);
    } catch (MalformedURLException e) {
      throw new FeelArchiveException(FileExceptionCode.INVALID_FILE_URI);
    }
  }

  @Transactional(readOnly = true)
  public List<TimeCapsuleImageResponse> getImages(TimeCapsule timeCapsule) {
    List<TimeCapsuleImage> timeCapsuleImages = timeCapsuleImageRepository.findByTimeCapsule(timeCapsule);
    return timeCapsuleImages.stream()
        .map(timeCapsuleImage -> TimeCapsuleImageResponse.of(
            timeCapsuleImage.getId(), generateDownloadUrl(timeCapsule.getId(), timeCapsuleImage)))
        .toList();
  }

  private TimeCapsuleImage getTimeCapsuleImage(Long imageId, Long timeCapsuleId) {
    return timeCapsuleImageRepository.findByIdAndTimeCapsule_Id(imageId, timeCapsuleId)
        .orElseThrow(() -> new FeelArchiveException(CAPSULE_IMAGE_NOT_FOUND));
  }

  private String generateDownloadUrl(Long timeCapsuleId, TimeCapsuleImage timeCapsuleImage) {
    return fileProperties.getPublicBaseUrl() + timeCapsuleId +"/images/" + timeCapsuleImage.getId();
  }

  private void checkOwner(TimeCapsule timeCapsule, Long userId) {
    if (!timeCapsule.isOwner(userId)) {
      throw new FeelArchiveException(CAPSULE_FORBIDDEN);
    }
  }

}
