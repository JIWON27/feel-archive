package com.feeleats.api;

import com.feeleats.api.auth.jwt.TokenProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(TokenProperties.class)
public class RestApiApplication {
  public static void main(String[] args) {
    SpringApplication.run(RestApiApplication.class, args);
  }

}
