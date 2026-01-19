package com.feelarchive.common.excepion;

import lombok.Getter;

@Getter
public class FeelArchiveException extends RuntimeException {
  private final FeelArchiveErrorCode errorCode;

  public FeelArchiveException(FeelArchiveErrorCode errorCode) {
    this.errorCode = errorCode;
  }
}
