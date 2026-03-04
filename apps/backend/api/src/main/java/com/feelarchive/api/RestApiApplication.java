package com.feelarchive.api;

import com.feelarchive.api.config.auth.CookieProperties;
import com.feelarchive.api.config.auth.TokenProperties;
import com.feelarchive.api.file.service.FileProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableRetry
@EnableScheduling
@SpringBootApplication
@ComponentScan(basePackages = "com.feelarchive")
@EnableConfigurationProperties({TokenProperties.class, CookieProperties.class, FileProperties.class})
public class RestApiApplication {
  public static void main(String[] args) {
    SpringApplication.run(RestApiApplication.class, args);
  }

}
