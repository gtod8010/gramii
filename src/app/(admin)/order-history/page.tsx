"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser'; // useUser 훅 임포트
import { statusColors, statusDisplayNames } from '@/lib/constants';
import toast from 'react-hot-toast';

// API 응답으로 받는 주문 데이터 타입 (API 응답 키와 일치하도록 수정)
interface Order {
  id: number; // API는 숫자 ID를 반환
  serviceName: string;
  serviceIcon?: string; // API 응답에 따라 추가
  link: string;
  orderQuantity: number;
  orderPrice: number;
  initialQuantity?: number;
  remainingQuantity?: number;
  orderedAt: string; // ISO 문자열로 가정
  status: string; // 'pending', 'processing' 등 DB에서 오는 값
  rawStatusText?: string; // API가 rawStatusText를 직접 제공하거나, status를 기반으로 생성
}

const OrderHistoryPage = () => {
  const { user, isLoading: userIsLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialSyncing, setIsInitialSyncing] = useState(true); // 자동 동기화 추적 상태
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('전체'); // 필터는 한글 표시 이름으로 관리
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const limit = 10; // 페이지 당 항목 수

  // statusDisplayNames를 기반으로 필터 목록 생성
  const filters = ['전체', ...Object.values(statusDisplayNames)];

  // API 호출을 위한 필터 값 변환 (한글 -> 영문 key)
  const getApiFilterStatus = (filterDisplayName: string): string | undefined => {
    if (filterDisplayName === '전체') return undefined;
    const entry = Object.entries(statusDisplayNames).find(([, value]) => value === filterDisplayName);
    return entry ? entry[0] : undefined;
  };

  const fetchOrders = useCallback(async () => {
    if (!user || !user.id) {
      setIsLoading(false);
      // 사용자가 로드되지 않았거나 ID가 없는 경우, 빈 목록 또는 메시지 표시
      if(!userIsLoading) setError("사용자 정보를 가져올 수 없습니다.");
      setOrders([]);
      return;
    }
    setIsLoading(true);
    setError(null);

    const apiFilterStatus = getApiFilterStatus(activeFilter);
    
    try {
      const params = new URLSearchParams({
        userId: String(user.id),
        page: String(currentPage),
        limit: String(limit),
      });
      if (apiFilterStatus) params.append('status', apiFilterStatus);
      if (searchTerm) params.append('searchTerm', searchTerm);

      const response = await fetch(`/api/orders?${params.toString()}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || '주문 내역을 가져오는데 실패했습니다.');
      }
      const data = await response.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 0);
      setTotalOrders(data.totalOrders || 0);
      setCurrentPage(data.currentPage || 1); // API에서 현재 페이지를 반환하면 사용

    } catch (err) {
      console.error("Failed to fetch orders:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching orders.");
      }
      setOrders([]); // 오류 발생 시 주문 목록 비우기
    } finally {
      setIsLoading(false);
    }
  }, [user, userIsLoading, currentPage, activeFilter, searchTerm]);

  const handleSyncStatus = useCallback(async (isManual = false) => {
    const orderIdsToSync = orders
      .filter(order => !['completed', 'canceled', 'refunded'].includes(order.status))
      .map(order => order.id);

    if (orderIdsToSync.length === 0) {
      if (isManual) {
        toast.success('동기화할 주문이 없거나 모두 최신 상태입니다.');
      }
      return;
    }

    setIsSyncing(true);
    const toastId = isManual ? toast.loading('주문 상태를 동기화하는 중...') : null;

    try {
      const response = await fetch('/api/orders/sync-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: orderIdsToSync }),
      });
      const result = await response.json();

      if (!response.ok) { throw new Error(result.error || '상태 동기화에 실패했습니다.'); }
      
      if (isManual || result.updatedCount > 0) {
          const message = result.updatedCount > 0
            ? `${result.updatedCount}개 주문 상태가 업데이트되었습니다.`
            : '모든 주문이 최신 상태입니다.';
          
          if(toastId) toast.success(message, { id: toastId });
          else if(isManual) toast.success(message);
          else if (result.updatedCount > 0) toast.success(message);
      }
      
      await fetchOrders();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      const finalMessage = `오류: ${errorMessage}`;
      if (toastId) toast.error(finalMessage, { id: toastId });
      else if(isManual) toast.error(finalMessage);

    } finally {
      setIsSyncing(false);
    }
  }, [orders, fetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 페이지 로드 시 자동 상태 동기화를 위한 useEffect
  useEffect(() => {
    // 로딩이 끝나고, 주문이 있으며, 첫 동기화 전일 때 실행
    if (!isLoading && orders.length > 0 && isInitialSyncing) {
      setIsInitialSyncing(false); // 재실행 방지
      handleSyncStatus(false); // 수동이 아님을 알림 (isManual = false)
    }
  }, [isLoading, orders, isInitialSyncing, handleSyncStatus]);

  // 검색어 입력 시 디바운싱을 위한 useEffect (옵션)
  useEffect(() => {
    const handler = setTimeout(() => {
        // 검색어가 변경되면 첫 페이지부터 다시 검색
        if (searchTerm) setCurrentPage(1); 
        // 실제 fetch는 searchTerm을 사용하는 fetchOrders 의존성 배열에 의해 트리거됨
        // 또는 여기서 직접 fetchOrders() 호출 (단, currentPage가 즉시 반영되지 않을 수 있음)
    }, 500); // 500ms 디바운스
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (userIsLoading) {
    return <div className="p-6 text-center">사용자 정보를 불러오는 중...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        주문 처리 현황
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {filter}
              </button>
            ))}
            <button
              onClick={() => handleSyncStatus(true)}
              disabled={isSyncing || isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowPathIcon className={`h-5 w-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? '동기화 중...' : '상태 새로고침'}
            </button>
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="ID, 서비스명, 링크 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {isLoading && !orders.length ? (
          <div className="py-12 text-center">주문 내역을 불러오는 중...</div>
        ) : error ? (
          <div className="p-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 rounded-md">
            <p>오류: {error}</p>
          </div>
        ) : !orders.length && !isLoading ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            {activeFilter !== '전체' || searchTerm ? '검색된 주문 내역이 없습니다.' : '주문 내역이 없습니다.'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      주문 번호
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      주문 상세 정보
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      등록일자
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 dark:text-gray-300 max-w-md">
                        <div className="flex items-center mb-1">
                          {order.serviceIcon && <span className="mr-2"><Image src={order.serviceIcon} alt="icon" width={16} height={16} /></span>} {/* API에 serviceIcon URL이 있다면 img 태그 사용 */}
                          <span className="font-semibold text-gray-800 dark:text-gray-100">{order.serviceName}</span>
                        </div>
                        <p><span className="font-medium">주문 링크 |</span> <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400 break-all">{order.link}</a></p>
                        <p><span className="font-medium">주문 수량 |</span> {(order.initialQuantity ?? 0).toLocaleString()}</p>
                        <p><span className="font-medium">주문 금액 |</span> ₩{(order.orderPrice ?? 0).toLocaleString()}</p>
                        {order.initialQuantity !== undefined && <p><span className="font-medium">시작 수량 |</span> {(order.initialQuantity ?? 0).toLocaleString()}</p>}
                        {order.remainingQuantity !== undefined && <p><span className="font-medium">남은 수량 |</span> {(order.remainingQuantity ?? 0).toLocaleString()}</p>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(order.orderedAt).toLocaleString('ko-KR')} {/* 날짜 포맷팅 */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {statusDisplayNames[order.status] || order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 페이지네이션 UI */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  총 {totalOrders}건 중 { (currentPage - 1) * limit + 1 } - { Math.min(currentPage * limit, totalOrders) } 표시
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 dark:text-gray-300 dark:border-gray-600"
                  >
                    이전
                  </button>
                  {/* 페이지 번호 직접 선택 (간단한 예시) */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(pageNumber => 
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                    )
                    .map((pageNumber, index, arr) => (
                      <React.Fragment key={pageNumber}>
                        {index > 0 && arr[index-1] + 1 < pageNumber && <span className="px-1 py-1 dark:text-gray-400">...</span>}
                        <button 
                          onClick={() => handlePageChange(pageNumber)} 
                          className={`px-3 py-1 text-sm border rounded-md ${currentPage === pageNumber ? 'bg-blue-600 text-white border-blue-600' : 'dark:text-gray-300 dark:border-gray-600'}`}
                        >
                          {pageNumber}
                        </button>
                      </React.Fragment>
                  ))}
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 dark:text-gray-300 dark:border-gray-600"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage; 
