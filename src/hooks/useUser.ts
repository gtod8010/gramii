"use client"; // 이 훅은 클라이언트 측에서만 실행됩니다.

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  role: 'user' | 'admin';
  points?: number; // points 필드 추가 (옵셔널)
  // DB에 있는 다른 필드들도 필요에 따라 추가 가능
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('loggedInUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          points: parsedUser.points !== undefined ? Number(parsedUser.points) : undefined,
        });
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('loggedInUser'); // 파싱 실패 시 잘못된 데이터 제거
    } finally {
      setIsLoading(false);
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  // 사용자 정보를 업데이트해야 할 경우를 위한 함수 (프로필 수정 등)
  const updateUserInStorage = (updatedUserInfo: Partial<User>) => {
    try {
      const storedUser = localStorage.getItem('loggedInUser');
      if (storedUser) {
        const currentUser = JSON.parse(storedUser) as User;
        // Ensure points are handled correctly during update if they exist in updatedUserInfo
        const newPoints = updatedUserInfo.points !== undefined 
          ? Number(updatedUserInfo.points) 
          : currentUser.points;

        const newUser = { 
          ...currentUser, 
          ...updatedUserInfo,
          points: newPoints,
        };
        localStorage.setItem('loggedInUser', JSON.stringify(newUser));
        setUser(newUser);
      }
    } catch (error) {
        console.error("Failed to update user in localStorage", error);
    }
  };

  return { user, isLoading, logout, updateUserInStorage };
};
