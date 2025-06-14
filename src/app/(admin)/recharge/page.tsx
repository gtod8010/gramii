"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ArrowRightIcon } from '@/icons';
import RechargeModal from '@/components/recharge/RechargeModal';

// deposit_requests 테이블의 구조에 맞게 인터페이스 수정
interface RechargeHistoryItem {
  id: number;
  paymentMethod: string; // API에서 '무통장입금'으로 고정 또는 다른 값
  amount: number;
  status: string; // 'pending', 'completed', 'failed' 등
  depositDate: string; // requested_at (요청일시)
  accountNumber?: string; // 계좌번호 필드 추가
  // depositorName?: string; // 필요하다면 추가 (API 응답에 포함되어야 함)
}

// API 응답 전체를 위한 인터페이스 (페이지네이션 정보 포함)
interface DepositsApiResponse {
  deposits: RechargeHistoryItem[];
  totalPages: number;
  currentPage: number;
  totalDeposits: number;
}

const ITEMS_PER_PAGE = 5; // API 요청 시 limit으로 사용될 값 (필요시 API와 동기화)

export default function RechargePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false); // 카드 결제 모달 상태

  const [rechargeHistory, setRechargeHistory] = useState<RechargeHistoryItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedPage, setLastFetchedPage] = useState(0); // 새로고침을 위한 상태

  const fetchRechargeHistory = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/deposits?page=${page}&limit=${ITEMS_PER_PAGE}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '충전 내역을 불러오는데 실패했습니다.');
      }
      const data: DepositsApiResponse = await response.json();
      setRechargeHistory(data.deposits);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage); // API에서 현재 페이지를 반환하므로 동기화
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching recharge history.');
      }
      setRechargeHistory([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRechargeHistory(currentPage);
  }, [currentPage, fetchRechargeHistory, lastFetchedPage]); // lastFetchedPage 의존성 추가

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      // fetchRechargeHistory가 currentPage를 사용하므로, 여기서는 setCurrentPage만 호출
      setCurrentPage(page);
    }
  };

  // 날짜 포맷 함수
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    }).replace(/\./g, '-').replace(/ /g, ' ').replace(/-(?=[^\-]*$)/, ' ');
    // YYYY-MM-DD HH:mm:ss 형태로 근사하게 맞춤
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 섹션: 충전하기 및 내역 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-1">충전하기</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">원하는 결제 수단을 선택 후 충전해주세요.</p>
            
            {/* 충전 요청 내역 테이블 */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">요청번호</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">결제수단</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">요청금액</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">요청일자</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">계좌번호</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">상태</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        충전 요청 내역을 불러오는 중...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-red-500">
                        오류: {error}
                      </td>
                    </tr>
                  ) : rechargeHistory.length > 0 ? (
                    rechargeHistory.map((item) => (
                    <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {item.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(item.depositDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.accountNumber || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${item.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                              item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                            {item.status === 'pending' ? '확인중' : item.status === 'completed' ? '충전완료' : item.status === 'failed' ? '처리실패' : item.status}
                          </span>
                        </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        충전 요청 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 결제 버튼 영역 */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => setIsRechargeModalOpen(true)}
                    className="w-full sm:w-auto flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    무통장 입금
                </button>
                <button
                    onClick={() => setIsCardModalOpen(true)}
                    className="w-full sm:w-auto flex-1 bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                    카드 결제 (준비중)
                </button>
            </div>

            {/* 페이지네이션 */}
            {!isLoading && !error && totalPages > 1 && (
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
        <RechargeModal 
          isOpen={isRechargeModalOpen} 
          onClose={() => {
            setIsRechargeModalOpen(false);
            // 모달이 닫힐 때 충전 내역 새로고침
            setLastFetchedPage(prev => prev + 1); // 강제로 useEffect 재실행
          }} 
        />
      )}

      {/* 카드 결제 모달 */}
      {isCardModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
            <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-6">카드 결제</h2>
            <div className="text-center text-gray-600 dark:text-gray-300">
              <p>카드 결제 기능은 현재 준비 중입니다.</p>
              <p>빠른 시일 내에 찾아뵙겠습니다.</p>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsCardModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
