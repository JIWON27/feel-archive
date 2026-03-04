package com.feelarchive.api.file.service;

import com.feelarchive.domain.file.entity.FileMeta;
import java.nio.file.Path;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
  FileMeta upload(String dir, MultipartFile file);
  void delete(String storageKey);
  void deleteAll(List<String> storageKeys);
  Path getFullPath(String storageKey);
  void validateImageConstraints(List<MultipartFile> files, int maxCount, long maxEachSize);
  String getAccessUrl(String storageKey);
}
