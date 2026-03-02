package com.feelarchive.monitor;

public class QueryMetricsManager {
  private final ThreadLocal<QueryMetrics> threadLocal = new ThreadLocal<>();

  public void start() {
    threadLocal.set(new QueryMetrics());
  }

  public QueryMetrics getCurrentMetrics() {
    return threadLocal.get();
  }

  public void clear() {
    threadLocal.remove();
  }
}
