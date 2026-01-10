package com.feelarchive.domain.user.repository;

import com.feelarchive.domain.user.entity.User;
import com.feelarchive.domain.user.entity.vo.Email;
import com.feelarchive.domain.user.entity.vo.Nickname;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(Email email);
  boolean existsByEmail(Email email);
  boolean existsByNickname(Nickname nickname);
}
