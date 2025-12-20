package com.feelarchive.api.auth.exception;

import com.feelarchive.api.exception.ExceptionCode;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum AuthExceptionCode implements ExceptionCode {
  INVALID_TOKEN("A001", HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
  NOT_FOUND_TOKEN("A002", HttpStatus.UNAUTHORIZED, "존재하지 않는 토큰입니다."),
  EMPTY_TOKEN("A003", HttpStatus.BAD_REQUEST, "토큰이 비어있습니다."),
  REISSUE_FAIL("A004", HttpStatus.UNAUTHORIZED, "토큰 재발급 과정에서 인증 실패했습니다."),
  ;

  final String code;
  final HttpStatus httpStatus;
  final String message;

  AuthExceptionCode(String code,HttpStatus httpStatus, String message) {
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
