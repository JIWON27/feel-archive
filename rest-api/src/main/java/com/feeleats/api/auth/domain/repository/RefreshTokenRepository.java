package com.feeleats.api.auth.domain.repository;

import com.feeleats.api.auth.domain.RefreshToken;
import java.util.Optional;

public interface RefreshTokenRepository {
  RefreshToken save(RefreshToken refreshToken);
  void deleteById(String refreshToken);
  Optional<RefreshToken> findById(String refreshToken);
}
