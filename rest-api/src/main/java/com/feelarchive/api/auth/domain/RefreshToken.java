package com.feelarchive.api.auth.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@AllArgsConstructor
@RedisHash(value = "refreshToken", timeToLive = 604800) // timeToLive yml 파일이랑 맞출 수 있나
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshToken {
  @Id
  String refreshToken;
  Long userId;
}
