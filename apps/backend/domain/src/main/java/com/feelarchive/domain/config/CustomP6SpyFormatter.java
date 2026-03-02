package com.feelarchive.domain.config;

import com.p6spy.engine.spy.appender.MessageFormattingStrategy;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile("!prod")
@Configuration
public class CustomP6SpyFormatter implements MessageFormattingStrategy {

  @Override
  public String formatMessage(int connectionId,
                              String now,
                              long elapsed,
                              String category,
                              String prepared,
                              String sql,
                              String url)
  {
    if (sql == null || sql.trim().isEmpty()) {
      return "";
    }

    return String.format("\n[Query] %s | %dms\n%s", category, elapsed, sql.trim());
  }
}
