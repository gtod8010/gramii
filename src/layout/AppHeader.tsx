"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import React from "react";
import { usePathname } from 'next/navigation';
import { useUser } from "@/hooks/useUser";

// 페이지 경로에 따른 타이틀 매핑
const pageTitles: { [key: string]: string } = {
  '/': '대시보드',
  '/order': '주문하기',
  '/order-history/executed': '실행주문내역',
  '/order-history/automated': '자동주문내역',
  '/services': '서비스목록',
  '/recharge': '충전하기',
  '/recommend': '추천하기',
  '/benefits': '이용해택',
  '/logout': '로그아웃'
};

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const currentPageTitle = pageTitles[pathname] || '대시보드';

  console.log("AppHeader User Debug:", { 
    isLoading, 
    user, 
    role: user?.role, 
    points: user?.points 
  });

  const handleToggleSidebar = () => {
    if (window.innerWidth >= 1024) { // lg 브레이크포인트 기준
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between w-full px-4 py-3 lg:px-6">
        {/* 왼쪽 영역: 사이드바 토글 버튼과 페이지 타이틀 */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onClick={handleToggleSidebar}
            aria-label="Toggle Sidebar"
          >
            {/* 햄버거 아이콘 (isMobileOpen 상태에 따라 X 아이콘으로 변경 가능) */}
            {isMobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90 sm:text-xl">
            {currentPageTitle}
          </h1>
        </div>

        {/* 오른쪽 영역: 테마 토글, 사용자 드롭다운 */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggleButton className="mr-2" />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
