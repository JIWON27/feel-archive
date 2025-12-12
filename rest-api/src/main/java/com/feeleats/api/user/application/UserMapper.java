package com.feeleats.api.user.application;

import com.feeleats.api.user.domain.User;
import com.feeleats.api.user.domain.vo.Email;
import com.feeleats.api.user.domain.vo.Nickname;
import com.feeleats.api.user.domain.vo.Phone;
import com.feeleats.api.user.presentaion.request.UserRequest;
import com.feeleats.api.user.presentaion.response.UserResponse;
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
