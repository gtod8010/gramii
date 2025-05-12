"use client";

import React, { useState } from 'react';
import { ChevronLeftIcon, ArrowRightIcon } from '@/icons';
import RechargeModal from '@/components/recharge/RechargeModal';

interface RechargeHistoryItem {
  id: string;
  paymentId: string;
  method: string;
  amount: number;
  date: string;
  status?: string; // 예시 이미지에는 없지만, 상태가 있을 수 있음
}

const mockRechargeHistory: RechargeHistoryItem[] = [
  { id: '1', paymentId: '1743217494', method: '무통장', amount: 5000, date: '2025-05-12 15:43:15' },
  { id: '2', paymentId: '1688954334', method: '무통장', amount: 50000, date: '2025-05-12 15:43:15' },
  { id: '3', paymentId: '1688713638', method: '무통장', amount: 20000, date: '2025-05-12 15:43:15' },
  { id: '4', paymentId: '1674112819', method: '무통장', amount: 4000, date: '2025-05-12 15:43:15' },
  { id: '5', paymentId: '1674112541', method: '무통장', amount: 3500, date: '2025-05-12 15:43:15' },
  // 추가 데이터 예시 (페이지네이션 확인용)
  { id: '6', paymentId: '1674112542', method: '무통장', amount: 10000, date: '2025-05-13 10:20:00' },
  { id: '7', paymentId: '1674112543', method: '카드결제', amount: 25000, date: '2025-05-13 11:30:00' },
  { id: '8', paymentId: '1674112544', method: '무통장', amount: 5000, date: '2025-05-13 12:45:00' },
  { id: '9', paymentId: '1674112545', method: '무통장', amount: 15000, date: '2025-05-13 14:00:00' },
  { id: '10', paymentId: '1674112546', method: '카드결제', amount: 30000, date: '2025-05-13 15:15:00' },
  { id: '11', paymentId: '1674112547', method: '무통장', amount: 7000, date: '2025-05-13 16:30:00' },
];

const ITEMS_PER_PAGE = 5;

export default function RechargePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);

  const totalPages = Math.ceil(mockRechargeHistory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = mockRechargeHistory.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">충전하기</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 섹션: 충전하기 및 내역 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-1">충전하기</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">원하는 결제 수단을 선택 후 충전해주세요.</p>
            
            {/* 결제 수단 탭 (현재는 무통장 입금만) */}
            <div>
              <button 
                onClick={() => setIsRechargeModalOpen(true)}
                className="bg-slate-700 text-white font-semibold py-3 px-6 rounded-t-md w-full text-left"
              >
                무통장 입금
              </button>
              {/* 다른 결제 수단이 있다면 여기에 추가 */}
            </div>

            {/* 충전 내역 테이블 */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 border-t-0 rounded-b-md">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">결제번호</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">결제수단</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">결제금액</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">결제일자</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.paymentId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {item.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.date}</td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        충전 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md text-sm font-medium
                      ${currentPage === page 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 섹션: 유의사항 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">유의사항</h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="mr-2 mt-1 block w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400 flex-shrink-0"></span>
                <span>결제 금액과 입금자명이 동일하여야 합니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 block w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400 flex-shrink-0"></span>
                <span>충전 신청 후 입금해주셔야 정상적으로 처리됩니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 block w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400 flex-shrink-0"></span>
                <span>세금계산서나 현금영수증은 충전 시 같이 신청해주세요.</span>
              </li>
              {/* 추가 유의사항 */}
            </ul>
          </div>
        </div>
      </div>

      {/* 톡상담 버튼 */}
      <button
        className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-5 rounded-full shadow-lg flex items-center"
        onClick={() => alert("톡상담 기능 구현 예정")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.832 8.832 0 01-4.33-1.223L3.418 17.46A1 1 0 012.53 16.53l1.222-2.254A6.983 6.983 0 013 10c0-3.866 3.582-7 8-7s8 3.134 8 7zm-2.828-2.828A6.002 6.002 0 005.172 7.172 6.002 6.002 0 0010 15.002a6.002 6.002 0 007.172-7.828A6.002 6.002 0 0015.172 7.172z" clipRule="evenodd" />
          <path d="M6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h2a1 1 0 100-2H7z" />
        </svg>
        톡상담
      </button>

      {isRechargeModalOpen && (
        <RechargeModal isOpen={isRechargeModalOpen} onClose={() => setIsRechargeModalOpen(false)} />
      )}
    </div>
  );
} 