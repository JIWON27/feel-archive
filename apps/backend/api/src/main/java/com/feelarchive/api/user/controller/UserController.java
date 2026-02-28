package com.feelarchive.api.user.controller;

import com.feelarchive.api.user.controller.request.UpdatePasswordRequest;
import com.feelarchive.api.user.controller.request.UserRequest;
import com.feelarchive.api.user.controller.response.MyPageResponse;
import com.feelarchive.api.user.controller.response.UserResponse;
import com.feelarchive.api.user.service.UserService;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserService userService;

  @PostMapping
  public ResponseEntity<Void> registerUser(@Valid @RequestBody UserRequest userRequest) {
    Long userId = userService.registerUser(userRequest);
    return ResponseEntity.created(URI.create("/api/v1/users/" + userId)).build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserResponse> getUser(@PathVariable Long id){
    return ResponseEntity.ok(userService.getUserById(id));
  }

  @GetMapping("/me")
  public ResponseEntity<MyPageResponse> getMyInfo(@AuthenticationPrincipal Long userId){
    return ResponseEntity.ok(userService.getMyInfo(userId));
  }

  @PatchMapping("/me/password")
  public ResponseEntity<Void> updatePassword(
      @AuthenticationPrincipal Long userId,
      @RequestBody @Valid UpdatePasswordRequest request)
  {
    userService.updatePassword(userId, request);
    return ResponseEntity.ok().build();
  }
}
