package com.feelarchive.api.user.service;

import com.feelarchive.api.user.controller.request.UserRequest;
import com.feelarchive.api.user.controller.response.UserResponse;
import com.feelarchive.api.user.domain.User;
import com.feelarchive.api.user.domain.vo.Email;
import com.feelarchive.api.user.domain.vo.Nickname;
import com.feelarchive.api.user.domain.vo.Phone;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

  @Mapping(target = "password", source = "encodedPassword")
  @Mapping(target = "role", ignore = true)
  @Mapping(target = "status", ignore = true)
  User toEntity(UserRequest userRequest, String encodedPassword);
  UserResponse toResponse(User user);

  default String emailToString(Email email) {
    return email.getEmail();
  }
  default String nicknameToString(Nickname nickname) {
    return nickname.getNickname();
  }
  default String phoneToString(Phone phone) {
    return phone.getPhone();
  }
}
