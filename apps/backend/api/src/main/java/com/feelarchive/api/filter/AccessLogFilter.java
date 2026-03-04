package com.feelarchive.api.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class AccessLogFilter extends OncePerRequestFilter {

  private static final Logger logger = LoggerFactory.getLogger("HTTP_ACCESS");

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    long start = System.currentTimeMillis();

    String method = request.getMethod();
    String requestURI = request.getRequestURI();
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String userId = (authentication != null && authentication.getPrincipal() instanceof Long id)
        ? String.valueOf(id) : "anonymous";
    String userAgent = request.getHeader("User-Agent");

    filterChain.doFilter(request, response);

    long elapsed = System.currentTimeMillis() - start;

    logger.info("[HTTP] {} {} | userId={} | status={} | {}ms | agent={} ",
        method, requestURI, userId,response.getStatus(), elapsed, userAgent);
  }
}
