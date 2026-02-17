package com.feelarchive.domain.email.exception;

import com.feelarchive.common.excepion.FeelArchiveErrorCode;
import org.springframework.http.HttpStatus;

public enum EmailLogExceptionCode implements FeelArchiveErrorCode {
  EMAIL_LOG_NOT_FOUND("EM001", HttpStatus.NOT_FOUND, "존재하지 않는 이메일 전송 로그입니다."),
  ;

  final String code;
  final HttpStatus httpStatus;
  final String message;

  EmailLogExceptionCode(String code,HttpStatus httpStatus, String message) {
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
