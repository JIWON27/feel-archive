package com.feelarchive.api.user.service;

import static com.feelarchive.api.user.exception.UserExceptionCode.DUPLICATE_EMAIL;
import static com.feelarchive.api.user.exception.UserExceptionCode.DUPLICATE_NICKNAME;

import com.feelarchive.api.user.controller.request.UserRequest;
import com.feelarchive.api.user.controller.response.UserResponse;
import com.feelarchive.api.user.domain.User;
import com.feelarchive.api.user.domain.vo.Email;
import com.feelarchive.api.user.domain.vo.Nickname;
import com.feelarchive.api.user.repository.jpa.UserRepository;
import com.feelarchive.common.excepion.FeelArchiveException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;
  private final UserReader userReader;

  @Transactional
  public Long registerUser(UserRequest request) {
    validateEmail(request.getEmail());
    validateNickname(request.getNickname());
    String password = passwordEncoder.encode(request.getPassword());
    User user = userMapper.toEntity(request, password);
    User savedUser = userRepository.save(user);
    return savedUser.getId();
  }

  @Transactional(readOnly = true)
  public UserResponse getUserById(Long id) {
    User user = userReader.getById(id);
    return userMapper.toResponse(user);
  }

  private void validateEmail(String email) {
    if (userRepository.existsByEmail(new Email(email))) {
      throw new FeelArchiveException(DUPLICATE_EMAIL);
    }
  }

  private void validateNickname(String nickname) {
    if (userRepository.existsByNickname(new Nickname(nickname))) {
      throw new FeelArchiveException(DUPLICATE_NICKNAME);
    }
  }
}
