package com.feeleats.api.auth.service;

import static com.feeleats.api.auth.exception.AuthExceptionCode.NOT_FOUND_TOKEN;
import static com.feeleats.api.auth.exception.AuthExceptionCode.REISSUE_FAIL;
import static com.feeleats.api.user.exception.UserExceptionCode.LOGIN_FAIL;

import com.feeleats.api.auth.controller.request.LoginRequest;
import com.feeleats.api.auth.controller.response.LoginResponse;
import com.feeleats.api.auth.domain.RefreshToken;
import com.feeleats.api.auth.jwt.JwtProvider;
import com.feeleats.api.auth.repository.redis.RefreshTokenRedisRepository;
import com.feeleats.api.exception.BusinessException;
import com.feeleats.api.user.domain.User;
import com.feeleats.api.user.domain.vo.Email;
import com.feeleats.api.user.service.UserReader;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final RefreshTokenRedisRepository refreshTokenRepository;
  private final UserReader userReader;
  private final PasswordEncoder passwordEncoder;
  private final JwtProvider jwtProvider;

  @Transactional
  public LoginResponse login(LoginRequest request) {
    User user = userReader.getByEmail(new Email(request.getEmail()));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword().getPassword())) {
      throw new BusinessException(LOGIN_FAIL);
    }

    String accessToken = jwtProvider.createAccessToken(user);
    String refreshToken = jwtProvider.createRefreshToken(user);

    refreshTokenRepository.save(new RefreshToken(refreshToken, user.getId()));
    return LoginResponse.of(user.getId(), accessToken, refreshToken);
  }

  @Transactional
  public void logout(String refreshToken) {
    jwtProvider.validateAndGetUserId(refreshToken);
    refreshTokenRepository.deleteById(refreshToken);
  }

  @Transactional
  public LoginResponse reIssueToken(String refreshToken) {
    Long userId = jwtProvider.validateAndGetUserId(refreshToken);

    RefreshToken savedRefreshToken = refreshTokenRepository.findById(refreshToken)
        .orElseThrow(() -> new BusinessException(NOT_FOUND_TOKEN));

    if (!userId.equals(savedRefreshToken.getUserId())) {
      throw new BusinessException(REISSUE_FAIL);
    }

    User user = userReader.getById(userId);
    refreshTokenRepository.deleteById(refreshToken);

    String newAccessToken = jwtProvider.createAccessToken(user);
    String newRefreshToken = jwtProvider.createRefreshToken(user);

    refreshTokenRepository.save(new RefreshToken(newRefreshToken, user.getId()));
    return LoginResponse.of(user.getId(), newAccessToken, newRefreshToken);
  }
}
