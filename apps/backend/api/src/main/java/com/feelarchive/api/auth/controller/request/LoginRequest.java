package com.feelarchive.api.auth.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {

  @NotBlank(message = "이메일을 입력해주세요.")
  @Email(message = "올바른 이메일 형식이 아닙니다.")
  String email;

  @NotBlank(message = "비밀번호를 입력해주세요.")
  String password;
}

