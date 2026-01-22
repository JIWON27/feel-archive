package com.feelarchive.api.config.auth;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@ConfigurationProperties(prefix = "security.cookie")
public class CookieProperties {
  private final boolean refreshSecure;
  private final String refreshSamesite;

  public CookieProperties(boolean refreshSecure, String refreshSamesite) {
    this.refreshSecure = refreshSecure;
    this.refreshSamesite = refreshSamesite;
  }
}
