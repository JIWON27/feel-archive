package com.feelarchive.api.config;

import java.lang.reflect.Method;
import java.util.concurrent.Executor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@EnableAsync
@Configuration
public class AsyncConfig implements AsyncConfigurer {

  @Bean(name = "timeCapsuleNotificationExecutor")
  public ThreadPoolTaskExecutor asyncTaskExecutor() {
    int processors = Runtime.getRuntime().availableProcessors();
    int corePoolSize = processors * 2;

    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(corePoolSize);
    executor.setMaxPoolSize(corePoolSize * 2);
    executor.setQueueCapacity(50);
    executor.setThreadNamePrefix("time-capsule-");
    executor.initialize();
    return executor;
  }

  @Override
  public Executor getAsyncExecutor() {
    return asyncTaskExecutor();
  }

  @Override
  public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
    return new AsyncExceptionHandler();
  }

  @Slf4j
  private static class AsyncExceptionHandler implements AsyncUncaughtExceptionHandler {
    @Override
    public void handleUncaughtException(Throwable ex, Method method, Object... params) {
      log.error("[Async Error] Method Name: {}", method.getName());
      for (int i = 0; i < params.length; i++) {
        log.error("   - Parameter[{}]: {}", i, params[i]);
      }
      log.error("   - Exception Message: {}", ex.getMessage());
      log.error("   - Stack Trace: ", ex);
    }
  }
}
