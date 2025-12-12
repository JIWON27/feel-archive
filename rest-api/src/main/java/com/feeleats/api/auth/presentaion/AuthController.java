package com.feeleats.api.auth.presentaion;

import com.feeleats.api.auth.application.AuthService;
import com.feeleats.api.auth.presentaion.request.LoginRequest;
import com.feeleats.api.auth.presentaion.response.LoginResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class AuthController {

  private final AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
    LoginResponse response = authService.login(request);

    ResponseCookie cookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
        .httpOnly(true)
        .secure(false) // TODO 로컬이라 일단 False
        .sameSite("None")
        .path("/")
        .maxAge(7 * 24 * 60 * 60)
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(response);
  }

  @DeleteMapping("/logout")
  public ResponseEntity<Void> logout(@CookieValue("refreshToken") String refreshToken){
    authService.logout(refreshToken);

    ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
        .httpOnly(true)
        .secure(false) // TODO 로컬이라 일단 False
        .sameSite("None")
        .path("/")
        .maxAge(0)
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .build();
  }

  @PostMapping("/token/reIssue")
  public ResponseEntity<LoginResponse> reIssue(@CookieValue("refreshToken") String refreshToken){
    LoginResponse response = authService.reIssueToken(refreshToken);

    ResponseCookie cookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
        .httpOnly(true)
        .secure(false) // TODO 로컬이라 일단 False
        .sameSite("None")
        .path("/")
        .maxAge(7 * 24 * 60 * 60)
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(response);
  }
}
