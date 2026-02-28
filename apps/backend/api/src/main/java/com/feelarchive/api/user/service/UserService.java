package com.feelarchive.api.user.service;


import static com.feelarchive.domain.user.exception.UserExceptionCode.DUPLICATE_EMAIL;
import static com.feelarchive.domain.user.exception.UserExceptionCode.DUPLICATE_NICKNAME;

import com.feelarchive.api.user.controller.request.UpdateEmailNotification;
import com.feelarchive.api.user.controller.request.UpdatePasswordRequest;
import com.feelarchive.api.user.controller.request.UserRequest;
import com.feelarchive.api.user.controller.request.WithdrawRequest;
import com.feelarchive.api.user.controller.response.MyPageResponse;
import com.feelarchive.api.user.controller.response.UserResponse;
import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.user.entity.User;
import com.feelarchive.domain.user.entity.vo.Email;
import com.feelarchive.domain.user.entity.vo.Nickname;
import com.feelarchive.domain.user.exception.UserExceptionCode;
import com.feelarchive.domain.user.repository.UserRepository;
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

  @Transactional
  public void withdraw(Long id, WithdrawRequest request) {
    User user = userReader.getById(id);

    if (!passwordEncoder.matches(request.currentPassword(), user.getPassword().getPassword())) {
      throw new FeelArchiveException(UserExceptionCode.PASSWORD_MISMATCH);
    }

    user.withdraw();
  }

  @Transactional(readOnly = true)
  public UserResponse getUserById(Long id) {
    User user = userReader.getById(id);
    return userMapper.toResponse(user);
  }

  @Transactional(readOnly = true)
  public MyPageResponse getMyInfo(Long id) {
    User user = userReader.getById(id);
    return userMapper.toMyPageResponse(user);
  }

  @Transactional
  public void updateEmailNotification(Long id, UpdateEmailNotification request) {
    User user = userReader.getById(id);
    user.updateEmailNotification(request.enable());
  }

  @Transactional
  public void updatePassword(Long id, UpdatePasswordRequest request) {
    User user = userReader.getById(id);

    if (!passwordEncoder.matches(request.currentPassword(), user.getPassword().getPassword())) {
      throw new FeelArchiveException(UserExceptionCode.PASSWORD_MISMATCH);
    }

    String newPassword = passwordEncoder.encode(request.newPassword());
    user.updatePassword(newPassword);
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
