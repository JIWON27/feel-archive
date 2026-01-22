package com.feelarchive.geo.config;

import feign.Logger;
import feign.Request.Options;
import feign.RequestInterceptor;
import feign.Retryer;
import feign.Retryer.Default;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class OpenFeignConfig {

  @Value("${kakao.rest-api-key}")
  private String restApiKey;

  @Bean
  @Profile({"local", "dev"})
  Logger.Level feignLoggerLevelDev() {
    return Logger.Level.FULL;
  }

  @Bean
  @Profile("prod")
  Logger.Level feignLoggerLevelProd() {
    return Logger.Level.BASIC;
  }

  @Bean
  public Options options() {
    return new Options(
        3000, TimeUnit.MILLISECONDS,
        5000, TimeUnit.MILLISECONDS,
        true
    );
  }

  @Bean
  public Retryer retryer() {
    return new Default(100L, 1000L, 3);
  }

  @Bean
  public RequestInterceptor requestInterceptor() {
    return requestTemplate -> requestTemplate.header("Authorization", "KakaoAK " + restApiKey);
  }
}
