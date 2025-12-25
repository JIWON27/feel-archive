package com.feelarchive.api.common.file;

import com.feelarchive.api.exception.ExceptionCode;
import lombok.Getter;

@Getter
public class FileException extends RuntimeException {
  private final ExceptionCode exceptionCode;

  public FileException(ExceptionCode exceptionCode) {
    this.exceptionCode = exceptionCode;
  }

}
