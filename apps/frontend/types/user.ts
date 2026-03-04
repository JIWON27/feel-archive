// 마이페이지 응답
export interface MyPageResponse {
  id: number;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  emailNotificationEnabled: boolean;
  status: string;
  createdAt: string;
}

// 비밀번호 변경 요청
export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 이메일 알림 설정 변경 요청
export interface UpdateEmailNotificationRequest {
  enable: boolean;
}

// 회원탈퇴 요청
export interface WithdrawRequest {
  currentPassword: string;
}
