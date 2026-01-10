package com.feelarchive.api.emotion.exception;

import com.feelarchive.common.excepion.FeelArchiveErrorCode;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum EmotionExceptionCode implements FeelArchiveErrorCode {

  EMOTION_NOT_FOUND("E001", HttpStatus.NOT_FOUND, "존재하지 않는 감정입니다."),
  EMOTION_REQUIRED("E002", HttpStatus.BAD_REQUEST, "감정 정보는 필수값입니다.")
  ;

  final String code;
  final HttpStatus httpStatus;
  final String message;

  EmotionExceptionCode(String code,  HttpStatus status, String message) {
    this.code = code;
    this.httpStatus = status;
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
