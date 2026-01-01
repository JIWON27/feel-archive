package com.feelarchive.geo.config;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableAutoConfiguration
@EnableFeignClients(basePackages = "com.feelarchive.geo")
public class TestOpenFeignConfig {

}
