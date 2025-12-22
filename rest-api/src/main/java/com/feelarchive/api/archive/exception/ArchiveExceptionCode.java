package com.feelarchive.api.archive.exception;

import com.feelarchive.api.exception.ExceptionCode;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ArchiveExceptionCode implements ExceptionCode {
  LATITUDE_OUT_OF_RANGE("A001", HttpStatus.BAD_REQUEST, "위도는 -90 이상 90 이하여야 합니다."),
  LONGITUDE_OUT_OF_RANGE("A002", HttpStatus.BAD_REQUEST, "경도는 -180 이상 180 이하여야 합니다."),
  LOCATION_COORDINATES_REQUIRED("A003", HttpStatus.BAD_REQUEST, "위치 정보는 위도와 경도가 함께 필요합니다."),
  ;

  final String code;
  final HttpStatus httpStatus;
  final String message;

  ArchiveExceptionCode(String code,HttpStatus httpStatus, String message) {
    this.code = code;
    this.httpStatus = httpStatus;
    this.message = message;
  }

  @Override
  public String getCode() {
    return code;
  }

  @Override
  public HttpStatus getStatus() {
    return httpStatus;
  }

  @Override
  public String getMessage() {
    return message;
  }

}
