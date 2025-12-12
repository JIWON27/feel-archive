package com.feeleats.api.auth.infra.redis;

import com.feeleats.api.auth.domain.RefreshToken;
import com.feeleats.api.auth.domain.repository.RefreshTokenRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRedisRepository extends CrudRepository<RefreshToken, String>, RefreshTokenRepository {

}
