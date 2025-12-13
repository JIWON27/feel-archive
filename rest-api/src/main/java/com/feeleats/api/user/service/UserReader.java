package com.feeleats.api.user.service;

import static com.feeleats.api.user.exception.UserExceptionCode.USER_NOT_FOUND;

import com.feeleats.api.exception.BusinessException;
import com.feeleats.api.user.domain.User;
import com.feeleats.api.user.domain.vo.Email;
import com.feeleats.api.user.repository.jpa.UserRepository;
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
