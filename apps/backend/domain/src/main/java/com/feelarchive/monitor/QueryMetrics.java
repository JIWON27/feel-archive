package com.feelarchive.monitor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class QueryMetrics {
  private final Map<String, Integer> sqlQueryCounts = new ConcurrentHashMap<>();
  private final long startTime = System.currentTimeMillis();

  public void appendQuery(String sql) {
    sqlQueryCounts.merge(sql, 1, Integer::sum);
  }

  public Map<String, Integer> getSqlQueryCounts() {
    return sqlQueryCounts;
  }

  public long getStartTime() {
    return startTime;
  }
}

