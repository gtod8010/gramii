"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referrerEmail, setReferrerEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!agreedToTerms) {
      setError('이용약관에 동의해주세요.');
      return;
    }
    setIsLoading(true);

    const payload = {
      name,
      email,
      phone_number: phoneNumber || undefined,
      password,
      referrer_email: referrerEmail || undefined,
    };

    console.log('Register attempt with:', payload);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        console.log('Registration successful:', data);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        console.error('Registration failed:', data);
        setError(data.message || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('회원가입 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center justify-center bg-pink-100 dark:bg-pink-700 p-3 rounded-md">
            <span className="text-3xl font-bold text-pink-600 dark:text-pink-300">GRAMII</span>
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
              <label htmlFor="name" className={labelClass}>
                이름 (실명)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="홍길동"
              />
            </div>

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
              <label htmlFor="phoneNumber" className={labelClass}>
                전화번호 <span className="text-xs text-gray-500 dark:text-gray-400">(선택)</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={inputClass}
                placeholder="010-1234-5678"
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

            <div>
              <label htmlFor="referrerEmail" className={labelClass}>
                추천인 이메일 <span className="text-xs text-gray-500 dark:text-gray-400">(선택)</span>
              </label>
              <input
                id="referrerEmail"
                name="referrerEmail"
                type="email"
                autoComplete="off"
                value={referrerEmail}
                onChange={(e) => setReferrerEmail(e.target.value)}
                className={inputClass}
                placeholder="referrer@example.com"
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}
            {successMessage && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center">{successMessage}</p>
            )}

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
                    이용약관 및 개인정보처리방침에 동의합니다. <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300">(보기)</a>
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
