package com.feelarchive.geo.exception;

import com.feelarchive.common.excepion.FeelArchiveErrorCode;
import lombok.Getter;

@Getter
public class LocationException extends RuntimeException {
  private final FeelArchiveErrorCode errorCode;

  public LocationException(FeelArchiveErrorCode errorCode) {
    this.errorCode = errorCode;
  }
}
