package com.feeleats.api.user.service;

import static com.feeleats.api.user.exception.UserExceptionCode.DUPLICATE_EMAIL;
import static com.feeleats.api.user.exception.UserExceptionCode.DUPLICATE_NICKNAME;

import com.feeleats.api.exception.BusinessException;
import com.feeleats.api.user.controller.request.UserRequest;
import com.feeleats.api.user.controller.response.UserResponse;
import com.feeleats.api.user.domain.User;
import com.feeleats.api.user.domain.vo.Email;
import com.feeleats.api.user.domain.vo.Nickname;
import com.feeleats.api.user.repository.jpa.UserRepository;
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
      throw new BusinessException(DUPLICATE_EMAIL);
    }
  }

  private void validateNickname(String nickname) {
    if (userRepository.existsByNickname(new Nickname(nickname))) {
      throw new BusinessException(DUPLICATE_NICKNAME);
    }
  }
}
