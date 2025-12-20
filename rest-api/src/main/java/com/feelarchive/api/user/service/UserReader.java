package com.feelarchive.api.user.service;

import static com.feelarchive.api.user.exception.UserExceptionCode.USER_NOT_FOUND;

import com.feelarchive.api.exception.BusinessException;
import com.feelarchive.api.user.domain.User;
import com.feelarchive.api.user.domain.vo.Email;
import com.feelarchive.api.user.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserReader {

  private final UserRepository userRepository;

  public User getById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new BusinessException(USER_NOT_FOUND));
  }

  public User getByEmail(Email email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new BusinessException(USER_NOT_FOUND));
  }
}
