package com.feelarchive.api.user.fixture;

import com.feelarchive.api.user.controller.request.UserRequest;
import com.feelarchive.domain.user.entity.Gender;
import java.time.LocalDate;

public class UserFixture {

  public static UserRequest createRequest() {
    return UserRequest.builder()
        .name("테스트유저")
        .email("test@test.com")
        .password("password123!")
        .nickname("testnick")
        .gender(Gender.MALE)
        .birthDate(LocalDate.of(1995, 1, 1))
        .build();
  }

  public static UserRequest createRequestWithEmail(String email) {
    return UserRequest.builder()
        .name("테스트유저")
        .email(email)
        .password("password123!")
        .nickname("testnick")
        .gender(Gender.MALE)
        .birthDate(LocalDate.of(1995, 1, 1))
        .build();
  }
}
