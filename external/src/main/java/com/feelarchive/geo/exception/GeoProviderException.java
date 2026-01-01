package com.feelarchive.geo.exception;

import lombok.Getter;

@Getter
public class GeoProviderException extends RuntimeException {
  private final ExceptionCode exceptionCode;

  public GeoProviderException(ExceptionCode exceptionCode) {
    this.exceptionCode = exceptionCode;
  }
}
