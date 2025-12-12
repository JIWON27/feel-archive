package com.feeleats.api.auth.filter;

import com.feeleats.api.auth.infra.jwt.JwtProvider;
import com.feeleats.api.user.application.UserReader;
import com.feeleats.api.user.domain.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter extends OncePerRequestFilter {

  private final JwtProvider jwtProvider;
  private final UserReader userReader;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain) throws ServletException, IOException
  {
    String accessToken = extractAuthorizationHeader(request);

    if (Objects.isNull(accessToken)) {
      filterChain.doFilter(request, response);
      return;
    }

    Long userId = jwtProvider.validateAndGetUserId(accessToken);

    User user = userReader.getById(userId);
    String roleName = user.getRole().name(); // 'USER', 'ADMIN'
    Collection<? extends GrantedAuthority> authorities =
        List.of(new SimpleGrantedAuthority("ROLE_" + roleName));

    UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(user.getId(), null, authorities);

    SecurityContextHolder.getContext().setAuthentication(authentication);

    filterChain.doFilter(request, response);
  }

  private String extractAuthorizationHeader(HttpServletRequest request) {
    String header = request.getHeader("Authorization");
    String TOKEN_PREFIX = "Bearer ";
    if  (header != null && header.startsWith(TOKEN_PREFIX)) {
      return header.substring(TOKEN_PREFIX.length());
    }
    return null;
  }
}
