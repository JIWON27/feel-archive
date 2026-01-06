package com.feelarchive.api.exception;

import com.feelarchive.common.excepion.FeelArchiveErrorCode;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
  private final FeelArchiveErrorCode errorCode;

  public BusinessException(FeelArchiveErrorCode errorCode) {
    this.errorCode = errorCode;
  }
}
