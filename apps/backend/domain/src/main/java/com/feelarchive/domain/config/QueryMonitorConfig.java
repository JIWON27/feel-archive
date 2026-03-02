package com.feelarchive.domain.config;

import com.feelarchive.monitor.JpaInspector;
import com.feelarchive.monitor.QueryMetricsManager;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!prod")
public class QueryMonitorConfig {

  @Bean
  public QueryMetricsManager queryMetricsManager() {
    return new QueryMetricsManager();
  }

  @Bean
  public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(QueryMetricsManager queryMetricsManager) {
    JpaInspector inspector = new JpaInspector(queryMetricsManager);
    return properties ->
        properties.put("hibernate.session_factory.statement_inspector", inspector);
  }
}
