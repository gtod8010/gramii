"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/lib/constants';

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
                  src={siteConfig.logoPath}
                  alt={`${siteConfig.name.en} Logo`}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>
            <p className="font-semibold text-white">{siteConfig.name.ko}</p>
            <div className="text-sm flex flex-wrap gap-x-4 gap-y-1">
                <p>주소 : {siteConfig.address}</p>
                <p>사업자등록번호 : {siteConfig.businessNumber}</p>
                <p>통신판매 : {siteConfig.mailOrderLicense}</p>
                <p>이메일 : {siteConfig.contactEmail}</p>
            </div>
            <p className="text-xs text-gray-500 pt-4">
              Copyright 2024. {siteConfig.name.en}. All rights reserved.
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
 