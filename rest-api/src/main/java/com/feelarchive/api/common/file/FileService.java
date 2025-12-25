package com.feelarchive.api.common.file;

import java.nio.file.Path;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
  FileMeta upload(String dir, MultipartFile file);
  List<FileMeta> uploadAll(String dir, List<MultipartFile> files);
  void delete(String storageKey);
  void deleteAll(List<String> storageKeys);
  Path getFullPath(String storageKey);
}
