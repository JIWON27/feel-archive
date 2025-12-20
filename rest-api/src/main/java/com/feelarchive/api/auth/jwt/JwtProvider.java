package com.feelarchive.api.auth.jwt;

import static com.feelarchive.api.auth.exception.AuthExceptionCode.EMPTY_TOKEN;
import static com.feelarchive.api.auth.exception.AuthExceptionCode.INVALID_TOKEN;

import com.feelarchive.api.config.auth.TokenProperties;
import com.feelarchive.api.exception.BusinessException;
import com.feelarchive.api.user.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtProvider {

  private final TokenProperties tokenProperties;

  public String createAccessToken(User user) {
    return create(user, TokenType.ACCESS);
  }

  public String createRefreshToken(User user) {
    return create(user, TokenType.REFRESH);
  }

  private String create(User user, TokenType type) {
    long expirationTime = switch (type) {
      case ACCESS -> tokenProperties.getAccessExpirationSeconds();
      case REFRESH -> tokenProperties.getRefreshExpirationSeconds();
    };

    Instant now = Instant.now();
    byte[] keyBytes = tokenProperties.getSecret().getBytes(StandardCharsets.UTF_8);
    SecretKey secretKey = Keys.hmacShaKeyFor(keyBytes);

    JwtBuilder builder = Jwts.builder()
        .issuer("feel-eats")
        .claim("id", user.getId())
        .signWith(secretKey, SignatureAlgorithm.HS256)
        .expiration(Date.from(now.plusSeconds(expirationTime)))
        .issuedAt(Date.from(now));

    if (type == TokenType.ACCESS) {
      builder.claim("role", user.getRole().name()); // 'ADMIN', 'USER'
    }

    return builder.compact();
  }

  public Long validateAndGetUserId(String token) {
    byte[] keyBytes = tokenProperties.getSecret().getBytes(StandardCharsets.UTF_8);
    SecretKey secretKey = Keys.hmacShaKeyFor(keyBytes);

    try {
      Claims claims = Jwts.parser()
          .verifyWith(secretKey)
          .build()
          .parseSignedClaims(token)
          .getPayload();
      return claims.get("id", Long.class);
    }catch (JwtException e) {
      throw new BusinessException(INVALID_TOKEN);
    }catch (IllegalArgumentException e) {
      throw new BusinessException(EMPTY_TOKEN);
    }
  }
}
