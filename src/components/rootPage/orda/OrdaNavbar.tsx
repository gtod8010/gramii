"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/button/Button';

const OrdaNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <nav className="w-full py-4 px-6 md:px-10 bg-[#1A1033] text-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative h-12 w-28">
            <Image
              src="/images/logos/orda/1W.png"
              alt="ORDA Logo"
              fill
              sizes="112px"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/services" className="hover:text-pink-400 transition-colors">
            둘러보기
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-pink-400 transition-colors">
                서비스
              </Link>
              <Button 
                variant="primary"
                size="md"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white border-transparent"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-pink-400 transition-colors">
                로그인
              </Link>
              <Link href="/register" passHref legacyBehavior={false}>
                <Button 
                  variant="primary" 
                  size="md" 
                  className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                >
                  회원가입
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default OrdaNavbar;
