package com.feeleats.api.auth.infra.jwt;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@ConfigurationProperties(prefix = "security.token")
public class TokenProperties {
  private final long accessExpirationSeconds;
  private final long refreshExpirationSeconds;
  private final String secret;

  public TokenProperties(long accessExpirationSeconds, long refreshExpirationSeconds, String secret) {
    this.accessExpirationSeconds = accessExpirationSeconds;
    this.refreshExpirationSeconds = refreshExpirationSeconds;
    this.secret = secret;
  }
}
