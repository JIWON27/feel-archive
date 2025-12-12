package com.feeleats.api.auth.presentaion.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginResponse {
  Long userId;
  String accessToken;
  String refreshToken;

  public static LoginResponse of(Long userId, String accessToken, String refreshToken) {
    return new LoginResponse(userId, accessToken, refreshToken);
  }
}
