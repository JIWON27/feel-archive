package com.feeleats.api.user.repository.jpa;

import com.feeleats.api.user.domain.User;
import com.feeleats.api.user.domain.vo.Email;
import com.feeleats.api.user.domain.vo.Nickname;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(Email email);
  boolean existsByEmail(Email email);
  boolean existsByNickname(Nickname nickname);
}
