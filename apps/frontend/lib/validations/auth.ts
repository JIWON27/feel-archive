import { z } from 'zod';
import { Gender } from '@/types/auth';

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(20, '비밀번호는 최대 20자까지 가능합니다'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// 회원가입 스키마
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, '이름을 입력해주세요')
      .max(50, '이름은 최대 50자까지 가능합니다'),
    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .email('올바른 이메일 형식이 아닙니다'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .max(20, '비밀번호는 최대 20자까지 가능합니다'),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),
    phone: z
      .string()
      .min(1, '휴대폰 번호를 입력해주세요')
      .regex(/^010\d{8}$/, '010으로 시작하는 11자리 숫자를 입력해주세요'),
    nickname: z
      .string()
      .min(1, '닉네임을 입력해주세요')
      .max(20, '닉네임은 최대 20자까지 가능합니다'),
    gender: z.nativeEnum(Gender),
    birthDate: z
      .string()
      .min(1, '생년월일을 입력해주세요')
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        '생년월일은 YYYY-MM-DD 형식이어야 합니다'
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
