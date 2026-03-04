package com.feelarchive.api.file.service;

import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.file.entity.FileMeta;
import com.feelarchive.domain.file.exception.FileExceptionCode;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Slf4j
@Service
@Profile("prod")
@RequiredArgsConstructor
public class S3FileService implements FileService{

  private final S3Client s3Client;

  @Value("${spring.cloud.aws.s3.bucket}")
  private String bucket;

  @Value("${spring.cloud.aws.s3.region}")
  private String region;

  @Override
  public FileMeta upload(String dir, MultipartFile file) {
    validateFile(file);
    String storageKey = generateStorageKey(dir, file.getOriginalFilename());

    try {
      s3Client.putObject(
          PutObjectRequest.builder()
              .bucket(bucket)
              .key(storageKey)
              .contentType(file.getContentType())
              .build(),
          RequestBody.fromInputStream(file.getInputStream(), file.getSize())
      );

      return FileMeta.builder()
          .storageKey(storageKey)
          .originalName(file.getOriginalFilename())
          .contentType(file.getContentType())
          .sizeBytes(file.getSize())
          .extension(extractExtension(Objects.requireNonNull(file.getOriginalFilename())))
          .build();
    } catch (IOException e) {
      log.error("File S3 upload failed. Dir: {}", dir, e);
      throw new FeelArchiveException(FileExceptionCode.UPLOAD_FAILED);
    }
  }

  @Override
  public void delete(String storageKey) {
    try {
      s3Client.deleteObject(DeleteObjectRequest.builder()
              .bucket(bucket)
              .key(storageKey)
              .build());
    } catch (Exception e) {
      log.error("S3 삭제 실패: storageKey={}", storageKey, e);
      throw new FeelArchiveException(FileExceptionCode.DELETE_FAILED);
    }
  }

  @Override
  public void deleteAll(List<String> storageKeys) {
    if (storageKeys == null || storageKeys.isEmpty()) return;

    List<ObjectIdentifier> objects = storageKeys.stream()
        .map(key -> ObjectIdentifier.builder().key(key).build())
        .toList();

    s3Client.deleteObjects(
        DeleteObjectsRequest.builder()
            .bucket(bucket)
            .delete(Delete.builder().objects(objects).build())
            .build()
    );
  }

  @Override
  public Path getFullPath(String storageKey) {
    String url = String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, storageKey);
    return Path.of(url);
  }

  @Override
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
    return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, storageKey);
  }

  private String generateStorageKey(String dir, String originalFilename) {
    return dir + "/" + UUID.randomUUID() + extractExtension(originalFilename);
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
