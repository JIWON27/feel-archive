package com.feelarchive.api.auth.repository.redis;

import com.feelarchive.api.auth.domain.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRedisRepository extends CrudRepository<RefreshToken, String>{

}
