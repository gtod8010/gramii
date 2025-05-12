"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!agreedToTerms) {
      alert('이용약관에 동의해주세요.');
      return;
    }
    setIsLoading(true);
    console.log('Register attempt with:', { email, nickname, password, agreedToTerms });
    // 여기에 실제 회원가입 API 호출 로직을 추가합니다.
    // 예시:
    // try {
    //   const response = await fetch('/api/register', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, nickname, password }),
    //   });
    //   if (response.ok) {
    //     // 회원가입 성공 처리, 예: 로그인 페이지로 리디렉션 또는 자동 로그인
    //     console.log('Registration successful');
    //     alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
    //     // router.push('/login');
    //   } else {
    //     // 회원가입 실패 처리 (예: 이미 사용 중인 이메일)
    //     const errorData = await response.json();
    //     console.error('Registration failed:', errorData.message);
    //     alert(errorData.message || '회원가입 중 오류가 발생했습니다.');
    //   }
    // } catch (error) {
    //   console.error('Registration error:', error);
    //   alert('회원가입 중 오류가 발생했습니다.');
    // } finally {
    //   setIsLoading(false);
    // }
    setTimeout(() => { // 임시 비동기 처리
      alert(`회원가입 시도: ${email}, 닉네임: ${nickname}`);
      setIsLoading(false);
      // 회원가입 성공 시 다음 경로로 이동하거나 상태 업데이트
      // router.push('/login'); 
    }, 1000);
  };

  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center justify-center bg-pink-100 dark:bg-pink-700 p-3 rounded-md">
            <span className="text-3xl font-bold text-pink-600 dark:text-pink-300">LM</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          회원가입
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300">
            로그인
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={labelClass}>
                이메일 주소
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="nickname" className={labelClass}>
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={inputClass}
                placeholder="사용하실 닉네임을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 dark:border-gray-600 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                    이용약관 및 개인정보처리방침에 동의합니다. <a href="/terms" target="_blank" className="text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300">(보기)</a>
                    </label>
                </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !agreedToTerms}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 dark:bg-pink-500 dark:hover:bg-pink-600 dark:focus:ring-pink-700"
              >
                {isLoading ? '가입 중...' : '계정 만들기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 