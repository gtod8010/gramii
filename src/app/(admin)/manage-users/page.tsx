'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import { statusDisplayNames } from '@/lib/constants';

interface ManagedUser {
  id: number;
  name: string;
  email: string;
  phone_number?: string | null;
  role: 'user' | 'admin';
  points?: number;
  admin_referral_code?: string | null;
  referrer_id?: number | null;
  referrer_name?: string | null;     // 추천인 이름으로 변경
  created_at: string;
  updated_at: string;
}

// 주문 내역 API 응답에 맞춘 Order 타입 (필요한 필드만 우선 정의)
interface UserOrder {
  id: number;
  serviceName: string;
  initialQuantity: number;
  processedQuantity: number;
  remainingQuantity: number;
  orderPrice: number;
  orderedAt: string;
  status: string;
  link?: string | null;
}

// 포인트 내역 모달 및 포인트 거래내역 타입 추가
interface PointTransaction {
  id: number;
  transaction_type: string;
  amount: number;
  created_at: string;
  related_order_id?: number | null;
  balance_after_transaction?: number; // API 응답에 추가된 필드
}

// 통합 활동 내역 아이템 인터페이스 (수정됨)
interface ActivityItem {
  id: string; 
  type: 'order' | 'point'; 
  date: Date; 
  timestamp: string; 
  summary: string; 
  orderInfo?: {
    quantity: string; 
    price: number; 
    initialQuantity?: number;
  };
  pointChange: number; 
  balanceAfter?: number; // 이 필드에 balance_after_transaction 값을 할당
  status?: string; 
}

// 포인트 거래 유형 한글화
const pointTransactionTypeDisplayNames: { [key: string]: string } = {
  order_payment: '주문 결제',
  recharge: '충전',
  admin_adjustment: '관리자 조정',
  refund: '환불',
  signup_bonus: '가입 보너스',
  referral_bonus: '추천인 보너스',
  // 추가될 수 있는 유형들...
};

// 서비스 목록 조회 API 응답 타입 (간단히 정의)
interface ServiceListItem {
  id: number;
  name: string;
  price_per_unit: number;
  service_type_name: string; // 카테고리화를 위한 타입명 필드 (API 응답에 있어야 함)
  // ... 기타 필요한 서비스 정보
}

// 사용자별 특별 단가 항목 타입 (API 응답 기반)
interface UserServicePriceItem {
  id: number; // user_service_prices 테이블의 id
  user_id: number;
  service_id: number;
  service_name: string;
  base_price: number; // services.price_per_unit
  custom_price: number;
  created_at: string;
  updated_at: string;
}

const ManageUsersPage = () => {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState<ManagedUser | null>(null);
  
  const [currentUserActivities, setCurrentUserActivities] = useState<ActivityItem[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [errorActivities, setErrorActivities] = useState<string | null>(null);

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingPoints, setEditingPoints] = useState<string>("");

  // --- 특별 단가 관리 모달 관련 상태 --- 
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedUserForPriceModal, setSelectedUserForPriceModal] = useState<ManagedUser | null>(null);
  const [userServicePrices, setUserServicePrices] = useState<UserServicePriceItem[]>([]);
  const [isLoadingUserServicePrices, setIsLoadingUserServicePrices] = useState(false);
  const [errorUserServicePrices, setErrorUserServicePrices] = useState<string | null>(null);
  const [allServices, setAllServices] = useState<ServiceListItem[]>([]);
  const [isLoadingAllServices, setIsLoadingAllServices] = useState(false);

  // --- 특별 단가 추가/수정 폼 상태 --- 
  const [editingSpecificPrice, setEditingSpecificPrice] = useState<UserServicePriceItem | null>(null);
  const [selectedServiceForNewPrice, setSelectedServiceForNewPrice] = useState<string>("");
  const [newCustomPrice, setNewCustomPrice] = useState<string>("");

  // --- 카테고리별 서비스 목록 상태 ---
  const [categorizedServices, setCategorizedServices] = useState<Record<string, ServiceListItem[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setErrorUsers(null);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원 목록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      if (err instanceof Error) {
        setErrorUsers(err.message);
      } else {
        setErrorUsers('An unknown error occurred');
      }
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (!userLoading && user?.role === 'admin') {
      fetchUsers();
    } else if (!userLoading && user?.role !== 'admin') {
      router.replace('/');
    }
  }, [user, userLoading, router, fetchUsers]);

  const handleSavePoints = async (targetUserId: number) => {
    const amount = parseInt(editingPoints, 10);
    if (isNaN(amount)) {
        alert('유효한 숫자 형태의 포인트를 입력해주세요.');
        return;
    }
    
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return;
    const currentPoints = targetUser.points || 0;
    const diffAmount = amount - currentPoints;

    try {
      const response = await fetch(`/api/users/${targetUserId}/points`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: diffAmount }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || '포인트 저장에 실패했습니다.');
      }
      alert(result.message || '포인트가 성공적으로 저장되었습니다.');
      fetchUsers(); 
      setEditingUserId(null);
      setEditingPoints("");
    } catch (err) {
      console.error('Error saving points:', err);
      if (err instanceof Error) {
        alert(`오류: ${err.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  const openActivityModal = (targetUser: ManagedUser) => {
    setSelectedUserForModal(targetUser);
    setIsActivityModalOpen(true);
  };

  const closeActivityModal = () => {
    setIsActivityModalOpen(false);
    setSelectedUserForModal(null);
    setCurrentUserActivities([]); 
    setErrorActivities(null);
  };
  
  useEffect(() => {
    if (isActivityModalOpen && selectedUserForModal) {
      const fetchAndCombineActivities = async () => {
        setIsLoadingActivities(true);
        setErrorActivities(null);
        
        try {
          const ordersResponse = await fetch(`/api/orders?userId=${selectedUserForModal.id}&limit=50`);
          if (!ordersResponse.ok) {
            const errorData = await ordersResponse.json();
            throw new Error(errorData.message || errorData.error || '사용자 주문 내역 로딩 실패');
          }
          const ordersData = await ordersResponse.json();
          const userOrders: UserOrder[] = ordersData.orders || [];
          
          const orderActivities: ActivityItem[] = userOrders.map(order => ({
            id: `order-${order.id}`,
            type: 'order',
            date: new Date(order.orderedAt),
            timestamp: order.orderedAt,
            summary: order.serviceName,
            orderInfo: {
              quantity: `${order.processedQuantity} / ${order.initialQuantity}`,
              price: order.orderPrice,
              initialQuantity: order.initialQuantity,
            },
            pointChange: -order.orderPrice, 
            status: statusDisplayNames[order.status] || order.status,
          }));         

          const pointsResponse = await fetch(`/api/users/${selectedUserForModal.id}/point-transactions`); 
          if (!pointsResponse.ok) {
            const errorData = await pointsResponse.json();
            throw new Error(errorData.message || '포인트 내역 로딩 실패');
          }
          const pointsData: PointTransaction[] = await pointsResponse.json();
          
          let tempCombinedActivities: ActivityItem[] = [...orderActivities];

          const pointActivities: ActivityItem[] = pointsData
            .map(tx => {
              if (tx.transaction_type === 'order_payment' && tx.related_order_id) {
                const relatedOrderActivity = tempCombinedActivities.find(act => act.type === 'order' && act.id === `order-${tx.related_order_id}`);
                if (relatedOrderActivity) {
                  relatedOrderActivity.balanceAfter = tx.balance_after_transaction;
                }
              }
              if (tx.transaction_type === 'order_payment') return null; 

              return {
                id: `tx-${tx.id}`,
                type: 'point',
                date: new Date(tx.created_at),
                timestamp: tx.created_at,
                summary: pointTransactionTypeDisplayNames[tx.transaction_type] || tx.transaction_type,
                pointChange: tx.amount,
                balanceAfter: tx.balance_after_transaction, 
              };
            }).filter(item => item !== null) as ActivityItem[];
          
          tempCombinedActivities = [...tempCombinedActivities, ...pointActivities];
          tempCombinedActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
          setCurrentUserActivities(tempCombinedActivities);

        } catch (err) {
          if (err instanceof Error) {
            setErrorActivities(err.message);
          } else {
            setErrorActivities('An unknown error occurred');
          }
          setCurrentUserActivities([]);
        } finally {
          setIsLoadingActivities(false);
        }
      };

      fetchAndCombineActivities();
    }
  }, [isActivityModalOpen, selectedUserForModal]);

  // allServices가 변경될 때 카테고리별로 그룹화
  useEffect(() => {
    if (allServices.length > 0) {
      const groupedServices: Record<string, ServiceListItem[]> = allServices.reduce((acc, service) => {
        const category = service.service_type_name || '기타'; // 타입명이 없는 경우 '기타'로 분류
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(service);
        return acc;
      }, {} as Record<string, ServiceListItem[]>);
      setCategorizedServices(groupedServices);
    } else {
      setCategorizedServices({});
    }
  }, [allServices]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };
  
  const handleSelectServiceForNewPrice = (serviceId: string) => {
    if (!editingSpecificPrice) { // 수정 중일 때는 서비스 변경 불가
      setSelectedServiceForNewPrice(serviceId);
    }
  };

  // --- 특별 단가 관리 모달 함수 --- 
  const fetchAllServicesForModal = async () => {
    setIsLoadingAllServices(true);
    try {
      const response = await fetch('/api/services?limit=1000&include_type_name=true'); // include_type_name 파라미터 추가 (API에서 지원해야 함)
      if (!response.ok) throw new Error('전체 서비스 목록을 불러오는데 실패했습니다.');
      const data = await response.json();
      // API 응답이 { services: [] } 형태인지, 아니면 바로 [] 형태인지 확인 필요
      const servicesArray = data.services || data || []; 
      // 각 서비스 객체에 service_type_name이 있는지 확인
      if (servicesArray.length > 0 && servicesArray[0].service_type_name === undefined) {
        console.warn("API 응답의 서비스 객체에 'service_type_name' 필드가 없습니다. 카테고리화가 제대로 동작하지 않을 수 있습니다.");
        // 필요하다면, 여기서 사용자에게 알림을 주거나 대체 로직을 수행할 수 있습니다.
        // 예: 모든 서비스를 '기타' 카테고리로 묶기
        // servicesArray.forEach(s => s.service_type_name = '기타');
      }
      setAllServices(servicesArray);
    } catch (err) {
      console.error("Error fetching all services:", err);
      setAllServices([]);
      // 사용자에게 오류 표시 (예: 토스트 메시지)
    } finally {
      setIsLoadingAllServices(false);
    }
  };

  const fetchUserServicePricesForModal = async (userId: number) => {
    setIsLoadingUserServicePrices(true);
    setErrorUserServicePrices(null);
    try {
      const response = await fetch(`/api/users/${userId}/service-prices`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '사용자 특별 단가 목록을 불러오는데 실패했습니다.');
      }
      const data: UserServicePriceItem[] = await response.json();
      setUserServicePrices(data);
    } catch (err) {
      if (err instanceof Error) {
        setErrorUserServicePrices(err.message);
      } else {
        setErrorUserServicePrices('An unknown error occurred');
      }
      setUserServicePrices([]);
    } finally {
      setIsLoadingUserServicePrices(false);
    }
  };

  const openPriceModal = (targetUser: ManagedUser) => {
    setSelectedUserForPriceModal(targetUser);
    setIsPriceModalOpen(true);
    fetchUserServicePricesForModal(targetUser.id);
    if (allServices.length === 0) { // 전체 서비스 목록이 아직 로드되지 않았다면 로드
        fetchAllServicesForModal();
    }
  };

  const closePriceModal = () => {
    setIsPriceModalOpen(false);
    setSelectedUserForPriceModal(null);
    setUserServicePrices([]);
    setErrorUserServicePrices(null);
    // allServices는 계속 유지해도 됨 (캐싱 효과)
  };

  const handleStartEditSpecificPrice = (priceItem: UserServicePriceItem) => {
    setEditingSpecificPrice(priceItem);
    setSelectedServiceForNewPrice(priceItem.service_id.toString());
    setNewCustomPrice(priceItem.custom_price.toString());
  };

  const handleCancelEditSpecificPrice = () => {
    setEditingSpecificPrice(null);
    setSelectedServiceForNewPrice("");
    setNewCustomPrice("");
  };

  const handleSubmitSpecificPrice = async () => {
    if (!selectedUserForPriceModal || !selectedServiceForNewPrice || newCustomPrice === "") {
      alert("서비스를 선택하고 특별 단가를 입력해주세요.");
      return;
    }
    const serviceId = parseInt(selectedServiceForNewPrice, 10);
    const customPrice = parseFloat(newCustomPrice);

    if (isNaN(serviceId) || isNaN(customPrice) || customPrice < 0) {
      alert("유효한 서비스 또는 가격을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${selectedUserForPriceModal.id}/service-prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          service_id: serviceId, 
          custom_price: customPrice 
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '특별 단가 저장에 실패했습니다.');
      }
      alert(editingSpecificPrice ? '특별 단가가 성공적으로 수정되었습니다.' : '특별 단가가 성공적으로 추가되었습니다.');
      fetchUserServicePricesForModal(selectedUserForPriceModal.id);
      handleCancelEditSpecificPrice();
    } catch (err) {
      if (err instanceof Error) {
        alert(`오류: ${err.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  const handleDeleteSpecificPrice = async (serviceId: number) => {
    if (!selectedUserForPriceModal || !confirm('정말로 이 특별 단가 설정을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/users/${selectedUserForPriceModal.id}/service-prices/${serviceId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '특별 단가 삭제에 실패했습니다.');
      }
      alert('특별 단가가 성공적으로 삭제되었습니다.');
      fetchUserServicePricesForModal(selectedUserForPriceModal.id);
    } catch (err) {
      if (err instanceof Error) {
        alert(`오류: ${err.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  if (userLoading || !user || user?.role !== 'admin') {
    return <div className="flex items-center justify-center h-screen"><p>Loading or unauthorized...</p></div>;
  }
  
  const buttonClassName = "px-3 py-1.5 text-xs";

  return (
    <>
      <PageBreadCrumb pageTitle="회원 관리" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">회원 관리</h1>
        
        {isLoadingUsers && <p>회원 목록을 불러오는 중...</p>}
        {errorUsers && <p className="text-red-500">오류: {errorUsers}</p>}
        {!isLoadingUsers && users.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">등록된 회원이 없습니다.</p>
        )}

        {!isLoadingUsers && users.length > 0 && (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">이름</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">이메일</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">전화번호</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">역할</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">예치금</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">추천인코드</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">추천인</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">가입일</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 align-middle">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{u.id}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{u.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{u.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{u.phone_number || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{u.role}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {editingUserId === u.id ? (
                        <div className="flex items-center space-x-1">
                          <input 
                            type="number" 
                            value={editingPoints}
                            onChange={(e) => setEditingPoints(e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                          <Button size="sm" className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white" onClick={() => handleSavePoints(u.id)}>저장</Button>
                          <Button size="sm" className="px-2 py-1 text-xs bg-gray-300 hover:bg-gray-400 text-gray-700" onClick={() => setEditingUserId(null)}>취소</Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>{u.points?.toLocaleString() || 0} P</span>
                          <button onClick={() => { setEditingUserId(u.id); setEditingPoints((u.points || 0).toString()); }} className="text-blue-500 hover:text-blue-700 text-xs">변경</button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{u.admin_referral_code || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{u.referrer_name || (u.referrer_id ? `ID: ${u.referrer_id}` : '-')}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium space-x-1">
                      <Button variant="outline" size="sm" className={buttonClassName} onClick={() => openActivityModal(u)}>
                        활동 내역
                      </Button>
                      <Button variant="outline" size="sm" className={`${buttonClassName} ml-1`} onClick={() => openPriceModal(u)}>
                        특별 단가
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 통합 활동 내역 모달 (컬럼 UI 수정됨) */}
      {isActivityModalOpen && selectedUserForModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative p-6 bg-white dark:bg-gray-800 w-full max-w-5xl mx-auto rounded-lg shadow-xl"> {/* max-w-5xl로 너비 증가 */} 
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedUserForModal.name} ({selectedUserForModal.email})님의 활동 내역
                </h3>
                <Button onClick={closeActivityModal} variant="outline" size="sm" className="px-2 py-1 text-xs">
                    X
                </Button>
            </div>
            
            {isLoadingActivities && <p>활동 내역을 불러오는 중...</p>}
            {errorActivities && <p className="text-red-500">오류: {errorActivities}</p>}
            {!isLoadingActivities && currentUserActivities.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">활동 내역이 없습니다.</p>
            )}
            {!isLoadingActivities && currentUserActivities.length > 0 && (
              <div className="overflow-y-auto max-h-[70vh]">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">일시</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">유형</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">내용</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">주문량 (개당 가격)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">변동 포인트</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">사용후 잔액</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentUserActivities.map(activity => {
                      let orderInfoText = '-';
                      if (activity.type === 'order' && activity.orderInfo) {
                        const { price, initialQuantity } = activity.orderInfo;
                        const requestedQty = initialQuantity || 0;
                        const unitPrice = requestedQty > 0 ? price / requestedQty : 0;
                        orderInfoText = `${requestedQty} (${unitPrice.toLocaleString()}P)`;
                      }
                      return (
                        <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-50/5">
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400" title={activity.timestamp}>
                            {new Date(activity.date).toLocaleString()} 
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold 
                            ${activity.type === 'order' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`}>
                            {activity.type === 'order' ? '주문' : '포인트'}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 dark:text-gray-200 max-w-xs truncate" title={activity.summary}>
                            {activity.summary}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                            {orderInfoText}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-xs 
                            ${activity.pointChange > 0 ? 'text-green-500' : (activity.pointChange < 0 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400')}`}>
                            {activity.pointChange !== 0 ? `${activity.pointChange > 0 ? '+':''}${activity.pointChange.toLocaleString()} P` : '-'}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                            {activity.balanceAfter?.toLocaleString() || '-'}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                            {activity.type === 'order' ? activity.status : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 특별 단가 관리 모달 */}
      {isPriceModalOpen && selectedUserForPriceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative p-6 bg-white dark:bg-gray-800 w-full max-w-3xl mx-auto rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedUserForPriceModal.name} ({selectedUserForPriceModal.email})님 특별 단가 관리
              </h3>
              <Button onClick={closePriceModal} variant="outline" size="sm" className="px-2 py-1 text-xs">
                X
              </Button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"> {/* 스크롤 및 패딩 추가 */} 
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                  {editingSpecificPrice ? "특별 단가 수정" : "새 특별 단가 추가"}
                </h4>
                {isLoadingAllServices && <p>서비스 목록 로딩 중...</p>}
                {!isLoadingAllServices && Object.keys(categorizedServices).length === 0 && allServices.length > 0 && (
                   <p className="text-sm text-gray-500 dark:text-gray-400">서비스 카테고리 정보를 불러오지 못했습니다. 서비스 목록에 <code className="text-xs bg-gray-200 dark:bg-gray-600 p-1 rounded">service_type_name</code> 필드가 필요합니다.</p>
                )}
                {!isLoadingAllServices && Object.keys(categorizedServices).length > 0 && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        서비스 선택 {editingSpecificPrice ? `(현재: ${editingSpecificPrice.service_name})` : ''}
                      </label>
                      <div className="border border-gray-300 dark:border-gray-600 rounded-md max-h-60 overflow-y-auto">
                        {Object.entries(categorizedServices).map(([category, servicesInCategory]) => (
                          <div key={category}>
                            <button
                              onClick={() => toggleCategory(category)}
                              disabled={!!editingSpecificPrice} // 수정 중에는 카테고리 토글 비활성화 (선택 사항)
                              className="w-full flex justify-between items-center px-3 py-2 text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none disabled:opacity-70"
                            >
                              <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{category} ({servicesInCategory.length})</span>
                              <span className={`transform transition-transform duration-200 ${expandedCategories.has(category) ? "rotate-180" : ""}`}>
                                ▼
                              </span>
                            </button>
                            {expandedCategories.has(category) && !editingSpecificPrice && ( // 수정 중이 아닐 때만 서비스 목록 표시
                              <ul className="pl-3 pr-1 py-1 bg-white dark:bg-gray-800">
                                {servicesInCategory.map(service => (
                                  <li key={service.id}>
                                    <button
                                      onClick={() => handleSelectServiceForNewPrice(service.id.toString())}
                                      disabled={!!editingSpecificPrice} // 수정 중일 때 선택 불가
                                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed
                                        ${selectedServiceForNewPrice === service.id.toString() 
                                          ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200 font-semibold' 
                                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                                    >
                                      {service.name} (기본: {service.price_per_unit.toLocaleString()}P)
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                       {editingSpecificPrice && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">특별 단가 수정 시에는 서비스를 변경할 수 없습니다.</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="custom-price-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">특별 단가 (P)</label>
                      <input
                        type="number"
                        id="custom-price-input"
                        value={newCustomPrice}
                        onChange={(e) => setNewCustomPrice(e.target.value)}
                        placeholder="예: 700"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="flex items-end space-x-2 mt-4">
                      <Button onClick={handleSubmitSpecificPrice} className="h-10 flex-grow" disabled={!editingSpecificPrice && !selectedServiceForNewPrice}>
                        {editingSpecificPrice ? "수정 완료" : "추가"}
                      </Button>
                      {editingSpecificPrice && (
                        <Button onClick={handleCancelEditSpecificPrice} variant="outline" className="h-10">
                          취소
                        </Button>
                      )}
                    </div>
                  </>
                )}
                {!isLoadingAllServices && allServices.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">추가할 서비스가 없거나 불러오지 못했습니다. 먼저 서비스를 등록해주세요.</p>
                )}
              </div>

              {/* --- 현재 설정된 특별 단가 목록 --- */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">현재 설정된 특별 단가 ({userServicePrices.length}개)</h4>
                {isLoadingUserServicePrices && <p>목록 로딩 중...</p>}
                {errorUserServicePrices && <p className="text-red-500">오류: {errorUserServicePrices}</p>}
                {!isLoadingUserServicePrices && !errorUserServicePrices && userServicePrices.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">이 사용자에게 설정된 특별 단가가 없습니다.</p>
                )}
                {!isLoadingUserServicePrices && !errorUserServicePrices && userServicePrices.length > 0 && (
                  <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">서비스명</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">기본 단가</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">특별 단가</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">관리</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {userServicePrices.map(priceItem => (
                          <tr key={priceItem.id}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{priceItem.service_name}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{priceItem.base_price.toLocaleString()} P</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">{priceItem.custom_price.toLocaleString()} P</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="px-2 py-1 text-xs"
                                onClick={() => handleStartEditSpecificPrice(priceItem)}
                                disabled={!!editingSpecificPrice && editingSpecificPrice.id === priceItem.id}
                              >
                                {editingSpecificPrice && editingSpecificPrice.id === priceItem.id ? "수정중..." : "수정"}
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm" 
                                className="px-2 py-1 text-xs"
                                onClick={() => handleDeleteSpecificPrice(priceItem.service_id)}
                                disabled={!!editingSpecificPrice}
                              >
                                삭제
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ManageUsersPage; 
 