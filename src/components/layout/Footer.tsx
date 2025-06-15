"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  onOpenTermsModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenTermsModal }) => {
  return (
    <footer className="w-full bg-gray-900 text-gray-400">
      <div className="px-[40px] py-12">
        <div className="flex flex-col md:flex-row justify-between">
          
          {/* 왼쪽 정보 영역 */}
          <div className="space-y-4">
            <Link href="/" className="inline-block mb-6">
              <div className="relative h-12 w-28">
                <Image
                  src="/images/gramii_logo.png"
                  alt="GRAMII Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>
            <p className="font-semibold text-white">그래미</p>
            <div className="text-sm space-y-1">
                <p>주소 : 서울특별시 강서구 공항대로 426</p>
                <p>사업자등록번호 : 572-05-03128</p>
                <p>통신판매 : 신청중</p>
                <p>이메일 : gramii0505@gmail.com</p>
            </div>
            <p className="text-xs text-gray-500 pt-4">
              Copyright 2024. GRAMII. All rights reserved.
            </p>
          </div>

          {/* 오른쪽 정책 링크 영역 */}
          <div className="mt-8 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li>
                <button onClick={onOpenTermsModal} className="hover:text-white">
                  이용약관 및 개인정보처리방침
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer; 
 