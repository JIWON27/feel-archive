package com.feelarchive.geo.exception;

import lombok.Getter;

@Getter
public class LocationException extends RuntimeException {
  private final ExceptionCode exceptionCode;

  public LocationException(ExceptionCode exceptionCode) {
    this.exceptionCode = exceptionCode;
  }
}
