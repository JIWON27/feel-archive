package com.feelarchive.domain.user.exception;

import com.feelarchive.common.excepion.FeelArchiveErrorCode;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum UserExceptionCode implements FeelArchiveErrorCode {

  USER_NOT_FOUND("U001", HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."),
  DUPLICATE_EMAIL("U002", HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."),
  DUPLICATE_NICKNAME("U003", HttpStatus.CONFLICT, "이미 존재하는 닉네임입니다."),
  LOGIN_FAIL("U004", HttpStatus.BAD_REQUEST, "이메일 또는 비밀번호가 올바르지 않습니다."),

  NAME_REQUIRED("U005", HttpStatus.BAD_REQUEST, "이름은 필수입니다."),
  EMAIL_REQUIRED("U006", HttpStatus.BAD_REQUEST, "이메일은 필수입니다."),
  NICKNAME_REQUIRED("U007", HttpStatus.BAD_REQUEST, "닉네임은 필수입니다."),
  NICKNAME_LENGTH_INVALID("U008", HttpStatus.BAD_REQUEST, "닉네임은 2자 이상 10자 이하로 입력해야 합니다."),

  PASSWORD_REQUIRED("U009", HttpStatus.BAD_REQUEST, "암호화된 비밀번호는 필수입니다."),
  PASSWORD_TOO_LONG("U010", HttpStatus.BAD_REQUEST, "암호화된 비밀번호 길이가 너무 깁니다."),

  PHONE_REQUIRED("U011", HttpStatus.BAD_REQUEST, "번호를 입력해주세요."),
  INVALID_PHONE_FORMAT("U012", HttpStatus.BAD_REQUEST, "핸드폰 번호 형식이 잘못되었습니다."),

  GENDER_REQUIRED("U013", HttpStatus.BAD_REQUEST, "성별을 선택해주세요."),
  BIRTHDATE_REQUIRED("U014", HttpStatus.BAD_REQUEST, "생년월일을 입력해주세요."),
  BIRTHDATE_IN_FUTURE("U015", HttpStatus.BAD_REQUEST, "생년월일은 오늘 이후일 수 없습니다."),
  ROLE_REQUIRED("U016", HttpStatus.BAD_REQUEST, "회원 권한은 필수입니다."),

  PASSWORD_MISMATCH("U017", HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다."),
  ;

  final String code;
  final HttpStatus httpStatus;
  final String message;

  UserExceptionCode(String code,HttpStatus httpStatus, String message) {
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
