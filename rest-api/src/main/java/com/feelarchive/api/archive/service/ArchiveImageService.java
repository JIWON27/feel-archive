package com.feelarchive.api.archive.service;

import static com.feelarchive.api.archive.exception.ArchiveExceptionCode.ARCHIVE_FORBIDDEN;
import static com.feelarchive.api.archive.exception.ArchiveExceptionCode.ARCHIVE_IMAGE_NOT_FOUND;
import static com.feelarchive.api.common.file.FileExceptionCode.FILE_NOT_FOUND;
import static com.feelarchive.api.common.file.FileExceptionCode.FILE_NOT_READABLE;

import com.feelarchive.api.archive.controller.response.ArchiveImageDownloadResponse;
import com.feelarchive.api.archive.controller.response.ArchiveImageResponse;
import com.feelarchive.api.archive.domain.Archive;
import com.feelarchive.api.archive.domain.ArchiveImage;
import com.feelarchive.api.archive.repository.ArchiveImageRepository;
import com.feelarchive.api.common.file.FileException;
import com.feelarchive.api.common.file.FileExceptionCode;
import com.feelarchive.api.common.file.FileMeta;
import com.feelarchive.api.common.file.FileProperties;
import com.feelarchive.api.common.file.FileService;
import com.feelarchive.api.exception.BusinessException;
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
public class ArchiveImageService {

  private final ArchiveReader archiveReader;
  private final FileService fileService;
  private final FileProperties fileProperties;
  private final ArchiveImageRepository archiveImageRepository;

  @Transactional
  public List<ArchiveImageResponse> uploads(Long archiveId, Long userId, List<MultipartFile> files) {
    Archive archive = archiveReader.getById(archiveId);
    checkOwner(archive, userId);

    List<ArchiveImage> archives = new ArrayList<>();

    for (MultipartFile file : files) {
      FileMeta fileMeta = fileService.upload("archive/" + archiveId, file);
      archives.add(ArchiveImage.builder()
          .archive(archive)
          .fileMeta(fileMeta)
          .build()
      );
    }
    List<ArchiveImage> archiveImages = archiveImageRepository.saveAll(archives);
    return  archiveImages.stream().map(archiveImage -> ArchiveImageResponse.of(archiveImage.getId(), generateDownloadUrl(archiveId, archiveImage))).toList();
  }

  @Transactional
  public void delete(Long archiveId, Long imageId, Long userId) {
    ArchiveImage image = getArchiveImage(archiveId, imageId);
    Archive archive = image.getArchive();
    checkOwner(archive, userId);

    archiveImageRepository.delete(image);

    FileMeta fileMeta = image.getFileMeta();
    fileService.delete(fileMeta.getStorageKey());
  }

  @Transactional
  public ArchiveImageDownloadResponse download(Long archiveId, Long imageId, Long userId) {
    ArchiveImage image = getArchiveImage(archiveId, imageId);
    Archive archive = image.getArchive();
    FileMeta fileMeta = image.getFileMeta();
    Path fullPath = fileService.getFullPath(fileMeta.getStorageKey());

    checkReadable(archive, userId);

    try {
      UrlResource resource = new UrlResource(fullPath.toUri());
      if (!resource.exists()) {
        throw new FileException(FILE_NOT_FOUND);
      }
      if (!resource.isReadable()) {
        throw new FileException(FILE_NOT_READABLE);
      }

      return ArchiveImageDownloadResponse.of(fileMeta, resource);
    } catch (MalformedURLException e) {
      throw new FileException(FileExceptionCode.INVALID_FILE_URI);
    }
  }

  private ArchiveImage getArchiveImage(Long archiveId, Long imageId) {
    return archiveImageRepository.findByIdAndArchive_Id(imageId, archiveId)
        .orElseThrow(() -> new BusinessException(ARCHIVE_IMAGE_NOT_FOUND));
  }

  private String generateDownloadUrl(Long archiveId, ArchiveImage archiveImage) {
    return fileProperties.getPublicBaseUrl() + archiveId +"/images/" + archiveImage.getId();
  }

  private void checkOwner(Archive archive, Long userId) {
    if (!archive.isOwner(userId)) {
      throw new BusinessException(ARCHIVE_FORBIDDEN);
    }
  }

  private void checkReadable(Archive archive, Long userIdOrNull) {
    if (archive.isPublic()) {
      return;
    }
    checkOwner(archive, userIdOrNull);
  }
}
