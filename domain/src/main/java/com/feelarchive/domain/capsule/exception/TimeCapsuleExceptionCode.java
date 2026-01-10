package com.feelarchive.domain.capsule.exception;

import com.feelarchive.common.excepion.FeelArchiveErrorCode;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum TimeCapsuleExceptionCode implements FeelArchiveErrorCode {
  INVALID_OPEN_TIME("T001", HttpStatus.BAD_REQUEST, "오픈 시간은 현재 시간 이후여야 합니다."),
  OPEN_TIME_TOO_FAR("T002", HttpStatus.BAD_REQUEST, "오픈 시간은 최대 10년 이후까지만 설정할 수 있습니다."),

  CAPSULE_NOT_FOUND("T004", HttpStatus.NOT_FOUND, "존재하지 않는 타임캡슐입니다."),
  CAPSULE_FORBIDDEN("T005", HttpStatus.FORBIDDEN, "타임캡슐에 접근할 권한이 없습니다."),

  CANNOT_OPEN_CAPSULE("T006", HttpStatus.BAD_REQUEST, "아직 오픈할 수 없는 타임캡슐입니다."),
  ALREADY_OPENED_CAPSULE("T007", HttpStatus.BAD_REQUEST, "이미 오픈된 타임캡슐입니다."),
  CAPSULE_CANCELLED("T008", HttpStatus.BAD_REQUEST, "취소된 타임캡슐입니다."),

  ALREADY_DELETED_CAPSULE("T010", HttpStatus.BAD_REQUEST, "이미 삭제된 타임캡슐입니다."),

  NOTIFICATION_ALREADY_SENT("T011", HttpStatus.CONFLICT, "이미 알림이 발송된 타임캡슐입니다."),
  NOTIFICATION_SEND_FAILED("T012", HttpStatus.INTERNAL_SERVER_ERROR, "알림 발송에 실패했습니다."),

  CAPSULE_IMAGE_NOT_FOUND("T013", HttpStatus.NOT_FOUND, "존재하지 않는 이미지입니다."),
  CAPSULE_IMAGE_FORBIDDEN("T014", HttpStatus.FORBIDDEN, "해당 이미지에 대한 접근권한이 없습니다."),
  ;

  final String code;
  final HttpStatus httpStatus;
  final String message;

  TimeCapsuleExceptionCode(String code,HttpStatus httpStatus, String message) {
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
