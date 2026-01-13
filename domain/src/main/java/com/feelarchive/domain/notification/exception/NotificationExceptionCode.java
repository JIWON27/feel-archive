package com.feelarchive.domain.notification.exception;

import com.feelarchive.common.excepion.FeelArchiveErrorCode;
import org.springframework.http.HttpStatus;

public enum NotificationExceptionCode implements FeelArchiveErrorCode {
  NOTIFICATION_NOT_FOUND("N001", HttpStatus.NOT_FOUND, "존재하지 않는 알람입니다."),
  NOTIFICATION_FORBIDDEN("N002", HttpStatus.FORBIDDEN, "해당 알림에 접근 권한이 없습니다."),
  ;

  final String code;
  final HttpStatus httpStatus;
  final String message;

  NotificationExceptionCode(String code,HttpStatus httpStatus, String message) {
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
