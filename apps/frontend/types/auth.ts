// 인증 관련 타입 정의

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답
export interface LoginResponse {
  userId: number;
  accessToken: string;
  refreshToken: string;
}

// 회원가입 요청
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  nickname: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD 형식
}

// 사용자 정보
export interface User {
  userId: number;
  email: string;
  name: string;
  nickname: string;
}
