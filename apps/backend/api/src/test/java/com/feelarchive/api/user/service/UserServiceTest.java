package com.feelarchive.api.user.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.feelarchive.api.user.controller.request.UserRequest;
import com.feelarchive.api.user.fixture.UserFixture;
import com.feelarchive.common.excepion.FeelArchiveException;
import com.feelarchive.domain.user.entity.User;
import com.feelarchive.domain.user.entity.vo.Email;
import com.feelarchive.domain.user.entity.vo.Nickname;
import com.feelarchive.domain.user.exception.UserExceptionCode;
import com.feelarchive.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private UserMapper userMapper;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private UserReader userReader;

  @InjectMocks
  private UserService userService;

  @Test
  @DisplayName("실패 케이스 확인용 - 삭제 예정")
  void intentionalFail() {
    assertThat(1).isEqualTo(2);
  }

  @Nested
  @DisplayName("회원가입")
  class RegisterUser {

    @Test
    @DisplayName("성공: 정상 입력 시 userId 반환")
    void success() {
      // Given
      UserRequest request = UserFixture.createRequest();

      given(userRepository.existsByEmail(any(Email.class))).willReturn(false);
      given(userRepository.existsByNickname(any(Nickname.class))).willReturn(false);

      given(passwordEncoder.encode("password123!")).willReturn("encoded_password");

      User mockUser = mock(User.class);
      given(userMapper.toEntity(request, "encoded_password")).willReturn(mockUser);

      User savedUser = mock(User.class);
      given(savedUser.getId()).willReturn(1L);
      given(userRepository.save(mockUser)).willReturn(savedUser);

      // When
      Long userId = userService.registerUser(request);

      // Then
      assertThat(userId).isEqualTo(1L);
    }

    @Test
    @DisplayName("실패: 이메일 중복 시 DUPLICATE_EMAIL 예외")
    void fail_duplicateEmail() {
      // Given
      UserRequest request = UserFixture.createRequest();

      given(userRepository.existsByEmail(any(Email.class))).willReturn(true);

      // When & Then
      assertThatThrownBy(() -> userService.registerUser(request))
          .isInstanceOf(FeelArchiveException.class)
          .satisfies(e -> {
            FeelArchiveException ex = (FeelArchiveException) e;
            assertThat(ex.getErrorCode()).isEqualTo(UserExceptionCode.DUPLICATE_EMAIL);
          });

      verify(userRepository, never()).existsByNickname(any());
    }

    @Test
    @DisplayName("실패: 닉네임 중복 시 DUPLICATE_NICKNAME 예외")
    void fail_duplicateNickname() {
      // Given
      UserRequest request = UserFixture.createRequest();
      given(userRepository.existsByEmail(any(Email.class))).willReturn(false);
      given(userRepository.existsByNickname(any(Nickname.class))).willReturn(true);

      // When & Then
      assertThatThrownBy(() -> userService.registerUser(request))
          .isInstanceOf(FeelArchiveException.class)
          .satisfies(e -> {
            FeelArchiveException ex = (FeelArchiveException) e;
            assertThat(ex.getErrorCode()).isEqualTo(UserExceptionCode.DUPLICATE_NICKNAME);
          });
    }
  }
}
