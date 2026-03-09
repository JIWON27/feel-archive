package com.feelarchive.api.user.service;

import com.feelarchive.api.user.controller.request.UserRequest;
import com.feelarchive.api.user.controller.response.MyPageResponse;
import com.feelarchive.api.user.controller.response.UserResponse;
import com.feelarchive.api.utils.DateUtils;
import com.feelarchive.domain.user.entity.User;
import com.feelarchive.domain.user.entity.vo.BirthDate;
import com.feelarchive.domain.user.entity.vo.Email;
import com.feelarchive.domain.user.entity.vo.Nickname;
import com.feelarchive.domain.user.entity.vo.Phone;
import java.time.LocalDateTime;
import java.util.Objects;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UserMapper {

  @Mapping(target = "password", source = "encodedPassword")
  @Mapping(target = "role", ignore = true)
  @Mapping(target = "status", ignore = true)
  User toEntity(UserRequest userRequest, String encodedPassword);
  UserResponse toResponse(User user);

  @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "toKst")
  MyPageResponse toMyPageResponse(User user);

  default String emailToString(Email email) {
    return email.getEmail();
  }
  default String nicknameToString(Nickname nickname) {
    return nickname.getNickname();
  }
  default String phoneToString(Phone phone) {
    return phone.getPhone();
  }
  default String birthDateToString(BirthDate birthDate) {
    return birthDate.getBirthDate().toString();
  }

  @Named("toKst")
  default String toKst(LocalDateTime time) {
    if (Objects.isNull(time)) {
      return null;
    }
    return DateUtils.formatToDateTime(time);
  }
}
