package com.feelarchive.api.common.file;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@ConfigurationProperties(prefix = "app.file")
public class FileProperties {
  private String baseDir;
  private String apiPrefix;

  public FileProperties(String baseDir, String apiPrefix) {
    this.baseDir = baseDir;
    this.apiPrefix = apiPrefix;
  }
}
