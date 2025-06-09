"use client";

import React from 'react';
import Link from 'next/link';
import { FaPlay } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-400">
      <div className="px-[40px] py-12">
        <div className="flex flex-col md:flex-row justify-between">
          
          {/* 왼쪽 정보 영역 */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-white mb-6">
              <FaPlay />
              <span>GRAMII</span>
            </Link>
            <p className="font-semibold text-white">(주)그래미</p>
            <div className="text-sm space-y-1">
                <p>주소: 경기도 고양시 일산동구 백마로 195, SK엠시티타워 일반동 13층</p>
                <p>사업자등록번호: 813-87-01236</p>
                <p>통신판매: 제 2019-고양일산동-1344호</p>
                <p>대표번호: 1877-3570</p>
                <p>이메일: admin@gramii.co.kr</p>
            </div>
            <p className="text-xs text-gray-500 pt-4">
              Copyright 2024. GRAMII. All rights reserved.
            </p>
          </div>

          {/* 오른쪽 정책 링크 영역 */}
          <div className="mt-8 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li><Link href="/terms" className="hover:text-white">이용약관</Link></li>
              <li><Link href="/privacy" className="hover:text-white">개인정보처리방침</Link></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer; 
