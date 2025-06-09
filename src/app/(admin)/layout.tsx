"use client";

import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
// Backdrop은 AppSidebar 내부에서 모바일 상태에 따라 처리되거나,
// 여기서 isMobileOpen 상태를 가져와 조건부 렌더링 할 수 있습니다.
// 지금은 단순화를 위해 일단 주석 처리하거나, 필요시 SidebarContext에서 isMobileOpen을 가져옵니다.
// import Backdrop from "@/layout/Backdrop"; 
import React from "react";
// import { useSidebar } from "@/context/SidebarContext"; // Backdrop을 위해 필요할 수 있음

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { isMobileOpen } = useSidebar(); // Backdrop을 위해 필요하다면 사용

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900"> {/* 전체 화면 flex 컨테이너 */}
      <AppSidebar /> {/* 사이드바는 자체 너비를 가짐 */}
      {/* {isMobileOpen && <Backdrop />} */}

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col"> {/* 남은 공간을 모두 차지하고, 내부 스크롤 관리 */}
        <AppHeader />
        
        {/* 실제 페이지 내용이 렌더링되는 부분 */}
        <main className="flex-grow mt-6 px-[40px]"> {/* 상단마진 1.5rem(24px), 좌우패딩 40px (예시) */}
          {/* 
            페이지 내용의 최대 너비를 제한하고 싶다면 여기에 div를 추가할 수 있습니다. 
            예: <div className="max-w-screen-2xl mx-auto"> 
          */}
          {children}
        </main>
      </div>
    </div>
  );
}
