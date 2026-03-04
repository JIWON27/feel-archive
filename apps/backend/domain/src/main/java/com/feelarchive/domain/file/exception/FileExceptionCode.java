package com.feelarchive.domain.file.exception;

import com.feelarchive.common.excepion.FeelArchiveErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum FileExceptionCode implements FeelArchiveErrorCode {
  INVALID_FILE_URI("F001", HttpStatus.INTERNAL_SERVER_ERROR, "유효하지 않는 URI 입니다."),
  INVALID_DIR_PATH("F002", HttpStatus.INTERNAL_SERVER_ERROR, "허용되지 않는 저장 경로입니다."),
  FILE_NOT_FOUND("F003", HttpStatus.INTERNAL_SERVER_ERROR, "파일을 찾을 수 없습니다."),
  FILE_NOT_READABLE("F004", HttpStatus.INTERNAL_SERVER_ERROR, "파일을 읽을 수 있는 권한이 없거나 손상되었습니다."),

  INVALID_FILE_FORMAT("F005", HttpStatus.BAD_REQUEST, "잘못된 파일 형식입니다."),
  EMPTY_FILE("F006", HttpStatus.BAD_REQUEST, "파일이 비어 있습니다."),
  EXCEEDED_FILE_SIZE("F007", HttpStatus.BAD_REQUEST, "파일 용량이 제한을 초과했습니다."),
  EXCEEDED_IMAGE_COUNT("F008", HttpStatus.BAD_REQUEST, "이미지는 최대 5장까지만 업로드 가능합니다."),

  UPLOAD_FAILED("F009", HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장 중 서버 오류가 발생했습니다."),
  DELETE_FAILED("F010", HttpStatus.INTERNAL_SERVER_ERROR, "파일 삭제 중 서버 오류가 발생했습니다."),
  DIR_CREATION_FAILED("F011", HttpStatus.INTERNAL_SERVER_ERROR, "디렉토리 생성에 실패했습니다.");
  ;

  final String code;
  final HttpStatus httpStatus;
  final String message;

  FileExceptionCode(String code,HttpStatus httpStatus, String message) {
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
