package com.feelarchive.geo.exception;

import org.springframework.http.HttpStatus;

public interface ExceptionCode {
  String getCode();
  HttpStatus getStatus();
  String getMessage();
}
