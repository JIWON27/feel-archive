package com.feelarchive.api.config;

import com.feelarchive.api.utils.NPlusOneInterceptor;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  private final NPlusOneInterceptor nPlusOneInterceptor;

  public WebConfig(@Autowired(required = false) NPlusOneInterceptor nPlusOneInterceptor) {
    this.nPlusOneInterceptor = nPlusOneInterceptor;
  }

  @Override
  public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
    PageableHandlerMethodArgumentResolver resolver = new PageableHandlerMethodArgumentResolver();
    resolver.setOneIndexedParameters(true);
    resolvers.add(resolver);
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    if (nPlusOneInterceptor != null) {
      registry.addInterceptor(nPlusOneInterceptor).addPathPatterns("/api/**");
    }
  }
}
