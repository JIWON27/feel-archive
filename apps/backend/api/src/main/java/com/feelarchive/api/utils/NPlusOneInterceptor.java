package com.feelarchive.api.utils;

import com.feelarchive.monitor.QueryMetrics;
import com.feelarchive.monitor.QueryMetricsManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
@Profile("!prod")
public class NPlusOneInterceptor implements HandlerInterceptor {

  private static final int N_PLUS_ONE_THRESHOLD = 2; // 동일 쿼리 2회 이상이면 의심
  private final QueryMetricsManager queryMetricsManager;

  public NPlusOneInterceptor(QueryMetricsManager queryMetricsManager) {
    this.queryMetricsManager = queryMetricsManager;
  }

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
      throws Exception {
    System.out.println("preHandle Request URL : " + request.getRequestURI());
    queryMetricsManager.start();
    return true;
  }

  @Override
  public void afterCompletion(HttpServletRequest request,
                              HttpServletResponse response,
                              Object handler, @Nullable Exception ex) throws Exception
  {
    try {
      QueryMetrics metrics = queryMetricsManager.getCurrentMetrics();
      if (metrics == null) return;

      long duration = System.currentTimeMillis() - metrics.getStartTime();
      Map<String, Integer> counts = metrics.getSqlQueryCounts();
      boolean suspicious = counts.values().stream()
          .anyMatch(count -> count >= N_PLUS_ONE_THRESHOLD);

      if (suspicious) {
        int total = counts.values().stream().mapToInt(Integer::intValue).sum();
        log.warn("[N+1 의심] 총 {}ms | 쿼리 {}회 | URI: {}", duration, total, request.getRequestURI());

        counts.forEach((sql, count) -> {
          if (count >= N_PLUS_ONE_THRESHOLD) {
            log.warn("  → [{}회] {}", count, sql.trim());
          }
        });
      }

    } finally {
      queryMetricsManager.clear();
    }
  }
}
