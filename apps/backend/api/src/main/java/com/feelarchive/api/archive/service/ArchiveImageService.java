package com.feelarchive.api.archive.service;


import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.ARCHIVE_FORBIDDEN;
import static com.feelarchive.domain.archive.exception.ArchiveExceptionCode.ARCHIVE_IMAGE_NOT_FOUND;
import static com.feelarchive.domain.file.exception.FileExceptionCode.FILE_NOT_FOUND;
import static com.feelarchive.domain.file.exception.FileExceptionCode.FILE_NOT_READABLE;

import com.feelarchive.api.archive.controller.response.ArchiveImageDownloadResponse;
import com.feelarchive.api.archive.controller.response.ArchiveImageResponse;
import com.feelarchive.api.common.file.FileProperties;
import com.feelarchive.api.common.file.FileService;
import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.archive.entity.Archive;
import com.feelarchive.domain.archive.entity.ArchiveImage;
import com.feelarchive.domain.archive.repository.ArchiveImageRepository;
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
public class ArchiveImageService {

  private final ArchiveReader archiveReader;
  private final FileService fileService;
  private final FileProperties fileProperties;
  private final ArchiveImageRepository archiveImageRepository;

  @Transactional
  public List<ArchiveImageResponse> uploads(Long archiveId, Long userId, List<MultipartFile> files) {
    fileService.validateImageConstraints(files, 5, 5 * 1024 * 1024);

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
        throw new FeelArchiveException(FILE_NOT_FOUND);
      }
      if (!resource.isReadable()) {
        throw new FeelArchiveException(FILE_NOT_READABLE);
      }

      return ArchiveImageDownloadResponse.of(fileMeta, resource);
    } catch (MalformedURLException e) {
      throw new FeelArchiveException(FileExceptionCode.INVALID_FILE_URI);
    }
  }

  @Transactional(readOnly = true)
  public List<ArchiveImageResponse> getImages(Archive archive) {
    List<ArchiveImage> archiveImages = archiveImageRepository.findByArchive(archive);
    return archiveImages.stream()
        .map(archiveImage -> ArchiveImageResponse.of(archiveImage.getId(), generateDownloadUrl(archive.getId(), archiveImage)))
        .toList();
  }

  private ArchiveImage getArchiveImage(Long archiveId, Long imageId) {
    return archiveImageRepository.findByIdAndArchive_Id(imageId, archiveId)
        .orElseThrow(() -> new com.feelarchive.common.excepion.FeelArchiveException(ARCHIVE_IMAGE_NOT_FOUND));
  }

  private String generateDownloadUrl(Long archiveId, ArchiveImage archiveImage) {
    return fileProperties.getApiPrefix() + "archives/" + archiveId +"/images/" + archiveImage.getId();
  }

  private void checkOwner(Archive archive, Long userId) {
    if (!archive.isOwner(userId)) {
      throw new com.feelarchive.common.excepion.FeelArchiveException(ARCHIVE_FORBIDDEN);
    }
  }

  private void checkReadable(Archive archive, Long userIdOrNull) {
    if (archive.isPublic()) {
      return;
    }
    checkOwner(archive, userIdOrNull);
  }
}
