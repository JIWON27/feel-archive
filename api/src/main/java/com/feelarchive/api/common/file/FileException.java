package com.feelarchive.api.common.file;

import com.feelarchive.common.excepion.FeelArchiveErrorCode;
import lombok.Getter;

@Getter
public class FileException extends RuntimeException {
  private final FeelArchiveErrorCode errorCode;

  public FileException(FeelArchiveErrorCode errorCode) {
    this.errorCode = errorCode;
  }

}
