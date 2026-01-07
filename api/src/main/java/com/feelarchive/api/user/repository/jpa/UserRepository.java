package com.feelarchive.api.user.repository.jpa;

import com.feelarchive.api.user.domain.User;
import com.feelarchive.api.user.domain.vo.Email;
import com.feelarchive.api.user.domain.vo.Nickname;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(Email email);
  boolean existsByEmail(Email email);
  boolean existsByNickname(Nickname nickname);
}
