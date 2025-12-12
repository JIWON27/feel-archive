package com.feeleats.api.user.domain.repository;

import com.feeleats.api.user.domain.User;
import com.feeleats.api.user.domain.vo.Email;
import com.feeleats.api.user.domain.vo.Nickname;
import java.util.Optional;

public interface UserRepository {
  User save(User user);
  Optional<User> findById(Long id);
  Optional<User> findByEmail(Email email);
  boolean existsByEmail(Email email);
  boolean existsByNickname(Nickname nickname);
}
