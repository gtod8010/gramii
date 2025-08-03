"use client";

import React, { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/constants';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('로딩 중...');
  const brandName = `${siteConfig.name.ko}(${siteConfig.name.en})`;

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch('/이용약관.txt');
        if (!response.ok) {
          throw new Error('이용약관 파일을 불러올 수 없습니다.');
        }
        let text = await response.text();
        // 브랜드 이름과 URL을 동적으로 교체
        text = text.replace(/그래미\(GRAMII\)/g, brandName)
                   .replace(/https:\/\/gramii\.co\.kr/g, siteConfig.siteUrl);
        setContent(text);
      } catch (error) {
        console.error(error);
        setContent('이용약관을 불러오는 데 실패했습니다.');
      }
    };

    if (isOpen) {
      fetchTerms();
    }
  }, [isOpen, brandName]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            이용약관 및 개인정보처리방침
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="overflow-y-auto p-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert text-gray-700 dark:text-gray-300">
            <pre className="whitespace-pre-wrap font-sans">{content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal; 
