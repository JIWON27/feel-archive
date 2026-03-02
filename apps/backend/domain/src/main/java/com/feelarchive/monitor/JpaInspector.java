package com.feelarchive.monitor;

import org.hibernate.resource.jdbc.spi.StatementInspector;
import org.springframework.stereotype.Component;

@Component
public class JpaInspector implements StatementInspector {

  private final QueryMetricsManager queryMetricsManager;

  public JpaInspector(QueryMetricsManager queryMetricsManager) {
    this.queryMetricsManager = queryMetricsManager;
  }

  @Override
  public String inspect(String sql) {
    QueryMetrics metrics = queryMetricsManager.getCurrentMetrics();

    if (metrics != null && sql.toLowerCase().startsWith("select")) {
      metrics.appendQuery(sql);
    }

    return sql;
  }
}
