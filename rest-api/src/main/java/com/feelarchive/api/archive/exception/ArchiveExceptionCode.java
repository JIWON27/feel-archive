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

  ARCHIVE_NOT_FOUND("A004", HttpStatus.NOT_FOUND, "존재하지 않는 아카이브입니다."),
  ARCHIVE_IMAGE_NOT_FOUND("A005", HttpStatus.NOT_FOUND, "존재하지 않는 이미지입니다."),
  ARCHIVE_FORBIDDEN("A006", HttpStatus.FORBIDDEN, "해당 아카이브에 대한 접근권한이 없습니다."),
  ARCHIVE_IMAGE_FORBIDDEN("A007", HttpStatus.FORBIDDEN, "해당 이미지에 대한 접근권한이 없습니다."),
  ARCHIVE_LIKE_NOT_FOUND("A008", HttpStatus.NOT_FOUND, "좋아요 기록이 존재하지 않습니다."),
  ALREADY_LIKED("A009", HttpStatus.CONFLICT, "이미 좋아요를 누른 아카이브입니다."),
  ARCHIVE_SCRAP_NOT_FOUND("A008", HttpStatus.NOT_FOUND, "스크랩 기록이 존재하지 않습니다."),
  ALREADY_SCRAPPED("A009", HttpStatus.CONFLICT, "이미 스크랩한 아카이브입니다."),
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
