package com.feelarchive.api.file.service;


import static com.feelarchive.domain.file.exception.FileExceptionCode.DELETE_FAILED;
import static com.feelarchive.domain.file.exception.FileExceptionCode.INVALID_DIR_PATH;

import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.file.entity.FileMeta;
import com.feelarchive.domain.file.exception.FileExceptionCode;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@Profile("local")
@RequiredArgsConstructor
public class LocalFileService implements FileService {

  private final FileProperties fileProperties;

  @Override
  public FileMeta upload(String dir, MultipartFile file) {
    validateFile(file);

    try {
      String originalFilename = file.getOriginalFilename();
      String extension = extractExtension(Objects.requireNonNull(originalFilename));
      String storageKey = generateStorageKey(dir, extension);
      long size = file.getSize();
      String contentType = file.getContentType();

      Path baseDir = Path.of(fileProperties.getBaseDir());
      Path fullPath = baseDir.resolve(storageKey).normalize();
      Files.createDirectories(fullPath.getParent());
      file.transferTo(fullPath);
      return FileMeta.builder()
          .storageKey(storageKey)
          .originalName(originalFilename)
          .contentType(contentType)
          .sizeBytes(size)
          .extension(extension)
          .build();
    } catch (IOException e) {
      log.error("File upload failed. Dir: {}", dir, e);
      throw new FeelArchiveException(FileExceptionCode.UPLOAD_FAILED);
    }
  }

  @Override
  public void delete(String storageKey) {
    Path baseDir = Path.of(fileProperties.getBaseDir());
    Path fullPath = baseDir.resolve(storageKey);
    try {
      if (Files.exists(fullPath)) {
        Files.delete(fullPath);
      }
    } catch (IOException e) {
      log.error("File delete failed. Path: {}", fullPath, e);
      throw new FeelArchiveException(DELETE_FAILED);
    }
  }

  @Override
  public void deleteAll(List<String> storageKeys) {
    for (String storageKey : storageKeys) {
      delete(storageKey);
    }
  }

  public Path getFullPath(String storageKey) {
    Path baseDir = Path.of(fileProperties.getBaseDir());
    Path fullPath = baseDir.resolve(storageKey).normalize();
    if (!fullPath.startsWith(baseDir)) {
      throw new FeelArchiveException(INVALID_DIR_PATH);
    }
    return fullPath;
  }

  public void validateImageConstraints(List<MultipartFile> files, int maxCount, long maxEachSize) {
    if (files == null || files.isEmpty()) {
      return;
    }

    if (files.size() > maxCount) {
      throw new FeelArchiveException(FileExceptionCode.EXCEEDED_IMAGE_COUNT);
    }

    for (MultipartFile file : files) {
      if (file.getSize() > maxEachSize) {
        throw new FeelArchiveException(FileExceptionCode.EXCEEDED_FILE_SIZE);
      }
    }
  }

  @Override
  public String getAccessUrl(String storageKey) {
    return fileProperties.getApiPrefix() + storageKey;
  }

  private String generateStorageKey(String dir, String extension) {
    if (dir.endsWith("/")) {
      dir = dir.substring(0, dir.length() - 1);
    }

    if (dir.contains("..")) {
      throw new FeelArchiveException(INVALID_DIR_PATH);
    }

    return dir + "/" + UUID.randomUUID() + extension;
  }

  private String extractExtension(String originalFilename) {
    return originalFilename.substring(originalFilename.lastIndexOf("."));
  }

  private void validateFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new FeelArchiveException(FileExceptionCode.EMPTY_FILE);
    }
  }
}
