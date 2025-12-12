package com.feeleats.api.user.infra.jpa;

import com.feeleats.api.user.domain.User;
import com.feeleats.api.user.domain.repository.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserJpaRepository extends JpaRepository<User, Long>, UserRepository {

}
