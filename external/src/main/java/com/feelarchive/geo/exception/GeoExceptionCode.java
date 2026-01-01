package com.feelarchive.geo.exception;

import org.springframework.http.HttpStatus;

public enum GeoExceptionCode implements ExceptionCode{
  NOT_FOUND_LOCATION("G001", HttpStatus.BAD_REQUEST, "해당 주소에 대한 위치 정보를 찾을 수 없습니다."),
  ;

  final String code;
  final HttpStatus httpStatus;
  final String message;

  GeoExceptionCode(String code,HttpStatus httpStatus, String message) {
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
