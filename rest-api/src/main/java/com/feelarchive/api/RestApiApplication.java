package com.feelarchive.api;

import com.feelarchive.api.common.file.FileProperties;
import com.feelarchive.api.config.auth.CookieProperties;
import com.feelarchive.api.config.auth.TokenProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({TokenProperties.class, CookieProperties.class, FileProperties.class})
public class RestApiApplication {
  public static void main(String[] args) {
    SpringApplication.run(RestApiApplication.class, args);
  }

}
