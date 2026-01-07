package com.feelarchive.common.excepion;

import org.springframework.http.HttpStatus;

public interface FeelArchiveErrorCode {
  String getCode();
  HttpStatus getStatus();
  String getMessage();
}
