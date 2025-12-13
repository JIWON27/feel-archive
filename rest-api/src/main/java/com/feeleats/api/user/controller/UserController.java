package com.feeleats.api.user.controller;

import com.feeleats.api.user.controller.request.UserRequest;
import com.feeleats.api.user.controller.response.UserResponse;
import com.feeleats.api.user.service.UserService;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
}
