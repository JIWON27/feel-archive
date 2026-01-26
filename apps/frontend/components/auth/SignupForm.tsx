'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { signupSchema, SignupFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Gender } from '@/types/auth';

export const SignupForm: React.FC = () => {
  const { signup, isSignupLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    // passwordConfirm은 제외하고 전송
    const { passwordConfirm, ...signupData } = data;
    signup(signupData);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
        <p className="text-gray-600">새로운 계정을 만들어보세요</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="이름"
          type="text"
          placeholder="홍길동"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="이메일"
          type="email"
          placeholder="example@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="비밀번호"
          type="password"
          placeholder="8-20자 입력"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호 재입력"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />

        <Input
          label="휴대폰 번호"
          type="tel"
          placeholder="01012345678"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="닉네임"
          type="text"
          placeholder="최대 20자"
          error={errors.nickname?.message}
          {...register('nickname')}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            성별
          </label>
          <select
            className={`
              w-full px-4 py-3 rounded-lg border
              ${errors.gender ? 'border-red-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2
              ${errors.gender ? 'focus:ring-red-500' : 'focus:ring-primary'}
            `}
            {...register('gender')}
            defaultValue=""
          >
            <option value="" disabled>
              선택해주세요
            </option>
            <option value={Gender.MALE}>남성</option>
            <option value={Gender.FEMALE}>여성</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>

        <Input
          label="생년월일"
          type="date"
          error={errors.birthDate?.message}
          {...register('birthDate')}
        />

        <Button type="submit" isLoading={isSignupLoading}>
          회원가입
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};
