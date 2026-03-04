'use client';

import { useState } from 'react';
import { useMyPage } from '@/hooks/use-mypage';
import { UpdatePasswordRequest, WithdrawRequest } from '@/types/user';

// 성별 한글 변환
function formatGender(gender: string) {
  if (gender === 'MALE') return '남성';
  if (gender === 'FEMALE') return '여성';
  return gender;
}

// 날짜 포맷 (YYYY-MM-DD → YYYY년 MM월 DD일)
function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${year}년 ${month}월 ${day}일`;
}

// 상태 한글 변환
function formatStatus(status: string) {
  if (status === 'ACTIVE') return '활성';
  if (status === 'WITHDRAWN') return '탈퇴';
  return status;
}

export default function MyProfilePage() {
  const {
    myInfo,
    isLoading,
    isError,
    updatePassword,
    isUpdatePasswordPending,
    updateEmailNotification,
    isUpdateEmailNotificationPending,
    withdraw,
    isWithdrawPending,
  } = useMyPage();

  // 비밀번호 변경 폼 상태
  const [passwordForm, setPasswordForm] = useState<UpdatePasswordRequest>({
    currentPassword: '',
    newPassword: '',
  });
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 회원탈퇴 모달 상태
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.newPassword !== newPasswordConfirm) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (passwordForm.newPassword.length < 8 || passwordForm.newPassword.length > 20) {
      setPasswordError('새 비밀번호는 8자 이상 20자 이하로 입력해주세요.');
      return;
    }

    updatePassword(passwordForm, {
      onSuccess: () => {
        setPasswordForm({ currentPassword: '', newPassword: '' });
        setNewPasswordConfirm('');
      },
    });
  };

  const handleEmailNotificationToggle = () => {
    if (!myInfo) return;
    updateEmailNotification({ enable: !myInfo.emailNotificationEnabled });
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const request: WithdrawRequest = { currentPassword: withdrawPassword };
    withdraw(request);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError || !myInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">정보를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>

      {/* 프로필 정보 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">내 정보</h2>
        <dl className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <dt className="text-sm text-gray-500">이름</dt>
            <dd className="text-sm font-medium text-gray-900">{myInfo.name}</dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <dt className="text-sm text-gray-500">닉네임</dt>
            <dd className="text-sm font-medium text-gray-900">{myInfo.nickname}</dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <dt className="text-sm text-gray-500">이메일</dt>
            <dd className="text-sm font-medium text-gray-900">{myInfo.email}</dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <dt className="text-sm text-gray-500">휴대폰</dt>
            <dd className="text-sm font-medium text-gray-900">{myInfo.phone}</dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <dt className="text-sm text-gray-500">성별</dt>
            <dd className="text-sm font-medium text-gray-900">{formatGender(myInfo.gender)}</dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <dt className="text-sm text-gray-500">생년월일</dt>
            <dd className="text-sm font-medium text-gray-900">{formatDate(myInfo.birthDate)}</dd>
          </div>
          <div className="flex justify-between items-center py-2">
            <dt className="text-sm text-gray-500">가입일</dt>
            <dd className="text-sm font-medium text-gray-900">{formatDate(myInfo.createdAt)}</dd>
          </div>
        </dl>
      </section>

      {/* 이메일 알림 설정 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">알림 설정</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">이메일 알림</p>
            <p className="text-xs text-gray-500 mt-0.5">
              타임캡슐 공개 시 이메일로 알림을 받습니다
            </p>
          </div>
          <button
            onClick={handleEmailNotificationToggle}
            disabled={isUpdateEmailNotificationPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
              myInfo.emailNotificationEnabled ? 'bg-primary' : 'bg-gray-200'
            }`}
            aria-label="이메일 알림 토글"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                myInfo.emailNotificationEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* 비밀번호 변경 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">비밀번호 변경</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              현재 비밀번호
            </label>
            <input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              placeholder="현재 비밀번호를 입력하세요"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호
            </label>
            <input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              placeholder="새 비밀번호 (8-20자)"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="newPasswordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호 확인
            </label>
            <input
              id="newPasswordConfirm"
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              placeholder="새 비밀번호를 다시 입력하세요"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
          <button
            type="submit"
            disabled={isUpdatePasswordPending}
            className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isUpdatePasswordPending ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </section>

      {/* 회원탈퇴 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">계정 삭제</h2>
        <p className="text-sm text-gray-500 mb-4">
          탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
        </p>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          회원탈퇴
        </button>
      </section>

      {/* 회원탈퇴 모달 */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">정말 탈퇴하시겠습니까?</h3>
            <p className="text-sm text-gray-500 mb-4">
              탈퇴 시 모든 아카이브와 데이터가 삭제되며 복구할 수 없습니다.
              비밀번호를 입력하여 본인 확인을 진행해주세요.
            </p>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <input
                type="password"
                value={withdrawPassword}
                onChange={(e) => setWithdrawPassword(e.target.value)}
                placeholder="현재 비밀번호"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawPassword('');
                  }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isWithdrawPending}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isWithdrawPending ? '처리 중...' : '탈퇴하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
