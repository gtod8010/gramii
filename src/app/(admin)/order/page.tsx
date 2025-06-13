"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';

// 데이터 타입 정의 (기존 정의 유지 또는 API 응답에 맞게 조정)
interface SubServiceItem {
  id: string; // API에서 number로 온다면 string으로 변환하거나, 타입을 number로 변경
  name: string;
  pricePerUnit: number;
  custom_price?: number | null;
  minOrder: number;
  maxOrder: number;
  description: string;
}

interface ServiceType {
  id: string; // API에서 number로 온다면 string으로 변환하거나, 타입을 number로 변경
  name: string;
  subServices: SubServiceItem[];
}

interface ServiceCategory {
  id: string; // API에서 number로 온다면 string으로 변환하거나, 타입을 number로 변경
  name: string;
  serviceTypes: ServiceType[];
}

// API로부터 받는 원본 서비스 데이터 타입 (ServiceListDisplay와 동일하게 사용 가능)
interface ApiService {
  id: number;
  name: string;
  service_type_id: number;
  category_id: number; // 주문 페이지에서는 카테고리 ID도 필요
  description?: string | null;
  price_per_unit?: number | undefined;
  custom_price?: number | null;
  min_order_quantity?: number | undefined;
  max_order_quantity?: number | undefined;
  is_active: boolean;
  service_type_name?: string; 
  category_name?: string; 
}

// 하드코딩된 serviceCategoriesData 제거
// const serviceCategoriesData: ServiceCategory[] = [...];

export default function OrderPage() {
  const { user, isLoading: userIsLoading, updateUserInStorage } = useUser();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [errorServices, setErrorServices] = useState<string | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [availableServiceTypes, setAvailableServiceTypes] = useState<ServiceType[]>([]);
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState<string>('');
  const [availableSubServices, setAvailableSubServices] = useState<SubServiceItem[]>([]);
  const [selectedSubServiceId, setSelectedSubServiceId] = useState<string>('');
  const [selectedServiceDetails, setSelectedServiceDetails] = useState<SubServiceItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<string>('');
  const [totalCost, setTotalCost] = useState<number>(0);
  const [serviceLink, setServiceLink] = useState<string>('');
  const [termsAgreement, setTermsAgreement] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAndStructureServices = useCallback(async () => {
    setIsLoadingServices(true);
    setErrorServices(null);
    console.log('[OrderPage] Fetching services...');
    try {
      // API 요청 시 X-Test-User-Id 헤더를 설정해야 custom_price가 제대로 반환될 수 있습니다.
      // 예시: const headers = { 'X-Test-User-Id': '1' }; // 사용자 ID 1로 테스트
      // const response = await fetch('/api/services', { headers });
      const response = await fetch('/api/services'); // 현재는 헤더 없이 호출
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[OrderPage] Failed to fetch services:', errorData);
        throw new Error(errorData.message || '서비스 목록을 불러오는데 실패했습니다.');
      }
      const apiServices: ApiService[] = await response.json();
      // --- API 응답 데이터 확인 로그 추가 ---
      console.log('[OrderPage] Raw API Services received (immediately after fetch):', JSON.parse(JSON.stringify(apiServices)));
      // 각 서비스의 custom_price 값 확인
      if (apiServices.length > 0) {
        console.log('[OrderPage] Checking custom_price in first few services:');
        apiServices.slice(0, 5).forEach(s => {
          console.log(`  Service ID: ${s.id}, Name: ${s.name}, Base Price: ${s.price_per_unit}, Custom Price: ${s.custom_price}`);
        });
      }
      // --- 로그 추가 완료 ---

      const activeServices = apiServices.filter(service => service.is_active);
      console.log('[OrderPage] Active Services (filtered):', JSON.parse(JSON.stringify(activeServices)));

      const structuredData: ServiceCategory[] = [];
      const categoryMap = new Map<string, ServiceCategory>();

      activeServices.forEach((service, index) => {
        console.log(`[OrderPage] Processing service ${index + 1}/${activeServices.length}:`, JSON.parse(JSON.stringify(service)));

        // category_id를 기준으로 다시 처리 (백엔드에서 category_id를 보내주므로)
        const categoryIdStr = String(service.category_id); 
        const categoryName = service.category_name || '기타 카테고리'; // category_name은 여전히 사용 가능
        
        const serviceTypeIdStr = String(service.service_type_id);
        const serviceTypeName = service.service_type_name || '기타 타입';

        console.log(`[OrderPage] Service ${index + 1} -> Category ID: ${categoryIdStr}, Name: ${categoryName}`);
        console.log(`[OrderPage] Service ${index + 1} -> Service Type ID: ${serviceTypeIdStr}, Name: ${serviceTypeName}`);

        if (!categoryMap.has(categoryIdStr)) {
          console.log(`[OrderPage] Creating new category in map. ID: ${categoryIdStr}, Name: ${categoryName}`);
          const newCategory: ServiceCategory = {
            id: categoryIdStr, // ServiceCategory의 id를 categoryIdStr로 설정
            name: categoryName,
            serviceTypes: [],
          };
          categoryMap.set(categoryIdStr, newCategory);
          structuredData.push(newCategory);
          console.log(`[OrderPage] Added new category to structuredData:`, JSON.parse(JSON.stringify(newCategory)));
        }
        
        const currentCategory = categoryMap.get(categoryIdStr)!;
        if (!currentCategory) {
            console.error(`[OrderPage] CRITICAL: Could not find category ${categoryIdStr} in map! This should not happen. Skipping service:`, service);
            return; 
        }
        console.log(`[OrderPage] Service ${index + 1} - Current Category from map: ID ${currentCategory.id}, Name: ${currentCategory.name}`);

        let currentServiceType = currentCategory.serviceTypes.find(st => st.id === serviceTypeIdStr);
        if (!currentServiceType) {
          console.log(`[OrderPage] Creating new service type for ID ${serviceTypeIdStr} (Name: ${serviceTypeName}) under category '${currentCategory.name}'`);
          currentServiceType = {
            id: serviceTypeIdStr,
            name: serviceTypeName,
            subServices: [],
          };
          currentCategory.serviceTypes.push(currentServiceType);
        } else {
          console.log(`[OrderPage] Found existing service type for ID ${serviceTypeIdStr} (Name: ${serviceTypeName}) under category '${currentCategory.name}'`);
        }

        // service.custom_price가 여기에서도 유효한지 확인
        if (index < 5) { // 처음 5개 서비스에 대해서만 로그 출력 (과도한 로그 방지)
            console.log(`[OrderPage] Structuring service ${service.id} - custom_price: ${service.custom_price}`);
        }

        currentServiceType.subServices.push({
          id: String(service.id),
          name: service.name,
          pricePerUnit: service.price_per_unit || 0,
          custom_price: service.custom_price, // custom_price 할당
          minOrder: service.min_order_quantity || 1,
          maxOrder: service.max_order_quantity || 10000,
          description: service.description || '설명이 없습니다.',
        });
      });
      
      console.log('[OrderPage] Final structuredData to be set to state (sample):', JSON.parse(JSON.stringify(structuredData.slice(0,1))));
      setServiceCategories(structuredData);
    } catch (err) {
      console.error('[OrderPage] Error in fetchAndStructureServices:', err);
      if (err instanceof Error) {
        setErrorServices(err.message);
      } else {
        setErrorServices('An unknown error occurred while fetching services.');
      }
      setServiceCategories([]);
    } finally {
      setIsLoadingServices(false);
      console.log('[OrderPage] Finished fetching and structuring services.');
    }
  }, []);

  useEffect(() => {
    fetchAndStructureServices();
  }, [fetchAndStructureServices]);


  const resetForm = () => {
    setSelectedCategoryId('');
    setAvailableServiceTypes([]);
    setSelectedServiceTypeId('');
    setAvailableSubServices([]);
    setSelectedSubServiceId('');
    setSelectedServiceDetails(null);
    setOrderQuantity('');
    setTotalCost(0);
    setServiceLink('');
    setTermsAgreement(false);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value; 
    setSelectedCategoryId(categoryId);
    setAvailableServiceTypes(categoryId ? serviceCategories.find(cat => cat.id === categoryId)?.serviceTypes || [] : []);
    setSelectedServiceTypeId('');
    setAvailableSubServices([]);
    setSelectedSubServiceId('');
    setSelectedServiceDetails(null);
    setOrderQuantity('');
  };

  const handleServiceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceTypeId = event.target.value;
    setSelectedServiceTypeId(serviceTypeId);
    setAvailableSubServices(serviceTypeId ? availableServiceTypes.find(st => st.id === serviceTypeId)?.subServices || [] : []);
    setSelectedSubServiceId('');
    setSelectedServiceDetails(null);
    setOrderQuantity('');
  };

  const handleSubServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const subServiceId = event.target.value;
    setSelectedSubServiceId(subServiceId);
    setOrderQuantity('');
    if (subServiceId) {
      const serviceDetail = availableSubServices.find(sub => sub.id === subServiceId);
      setSelectedServiceDetails(serviceDetail || null);
    } else {
      setSelectedServiceDetails(null);
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderQuantity(event.target.value);
  };

  const handleServiceLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServiceLink(event.target.value);
  };

  const handleTermsAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAgreement(event.target.checked);
  };

  useEffect(() => {
    if (selectedServiceDetails && orderQuantity) {
      const quantityNum = parseInt(orderQuantity, 10);
      if (!isNaN(quantityNum) && quantityNum > 0) {
        const priceToUse = selectedServiceDetails.custom_price !== null && selectedServiceDetails.custom_price !== undefined 
                           ? selectedServiceDetails.custom_price 
                           : selectedServiceDetails.pricePerUnit;
        const cost = priceToUse * quantityNum;
        setTotalCost(cost);
      } else {
        setTotalCost(0);
      }
    } else {
      setTotalCost(0);
    }
  }, [selectedServiceDetails, orderQuantity]);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
    setSubmitMessage(null);
    if (userIsLoading) {
      alert("사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!selectedSubServiceId || !selectedServiceDetails || !orderQuantity || totalCost <= 0 || !serviceLink || !termsAgreement) {
      setSubmitMessage({ type: 'error', text: "모든 필수 항목을 입력하고 약관에 동의해주세요."});
      return;
    }
    const quantityNum = parseInt(orderQuantity, 10);
    if (selectedServiceDetails && 
        (quantityNum < selectedServiceDetails.minOrder || quantityNum > selectedServiceDetails.maxOrder)) {
      setSubmitMessage({ type: 'error', text: `수량은 ${selectedServiceDetails.minOrder}에서 ${selectedServiceDetails.maxOrder} 사이로 입력해주세요.`});
      return;
    }
    const orderPayload = {
      userId: user.id, 
      serviceId: parseInt(selectedSubServiceId, 10),
      quantity: quantityNum, 
      totalPrice: totalCost, 
      requestDetails: serviceLink,
    };
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || '주문 생성에 실패했습니다.');
      }
      setSubmitMessage({ type: 'success', text: `주문이 성공적으로 생성되었습니다! (주문 ID: ${result.order.id})` });
      if (result.updatedUserPoints !== undefined && user) {
        updateUserInStorage({ ...user, points: result.updatedUserPoints });
      }
      resetForm(); 
    } catch (error) {
      console.error("Order submission error:", error);
      if (error instanceof Error) {
        setSubmitMessage({ type: 'error', text: error.message || '주문 처리 중 오류가 발생했습니다.' });
      } else {
        setSubmitMessage({ type: 'error', text: '주문 처리 중 알 수 없는 오류가 발생했습니다.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingServices || userIsLoading) {
    return <div className="flex items-center justify-center h-screen"><p className="text-lg dark:text-white">정보를 불러오는 중...</p></div>;
  }

  if (errorServices) {
    return <div className="flex items-center justify-center h-screen"><p className="text-lg text-red-500">오류: {errorServices}</p></div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">새로운 주문</h2>
          
          {submitMessage && (
            <div className={`p-4 rounded-md ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitMessage.text}
            </div>
          )}

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">카테고리를 먼저 선택해주세요.</label>
            <select id="category" name="category" value={selectedCategoryId} onChange={handleCategoryChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white">
              <option value="">카테고리 선택</option>
              {serviceCategories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))} 
            </select>
          </div>
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">서비스 타입을 선택해주세요.</label>
            <select id="serviceType" name="serviceType" value={selectedServiceTypeId} onChange={handleServiceTypeChange} disabled={!selectedCategoryId || availableServiceTypes.length === 0} className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700">
              <option value="">서비스 타입 선택</option>
              {availableServiceTypes.map(st => (<option key={st.id} value={st.id}>{st.name}</option>))} 
            </select>
          </div>
          <div>
            <label htmlFor="subService" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">세부 서비스를 선택해주세요.</label>
            <select id="subService" name="subService" value={selectedSubServiceId} onChange={handleSubServiceChange} disabled={!selectedServiceTypeId || availableSubServices.length === 0} className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700">
              <option value="">세부 서비스 선택</option>
              {availableSubServices.map(sub => {
                const displayPrice = sub.custom_price !== null && sub.custom_price !== undefined && sub.custom_price < sub.pricePerUnit
                  ? `${sub.custom_price.toLocaleString()}P (할인)`
                  : `${sub.pricePerUnit.toLocaleString()}P`;
                return (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} (1개당: {displayPrice}, 주문범위: {sub.minOrder}~{sub.maxOrder})
                  </option>
                );
              })} 
            </select>
          </div>

          <div>
            <label htmlFor="service-link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">서비스 링크를 입력해주세요.</label>
            <input type="url" name="service-link" id="service-link" value={serviceLink} onChange={handleServiceLinkChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white" placeholder="https://" required />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">서비스 수량을 입력해주세요.</label>
            <input type="number" name="quantity" id="quantity" value={orderQuantity} onChange={handleQuantityChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white" placeholder="수량 입력" min={selectedServiceDetails?.minOrder?.toString()} max={selectedServiceDetails?.maxOrder?.toString()} disabled={!selectedServiceDetails} required />
          </div>
          
          <div className="text-lg font-semibold text-gray-800 dark:text-white">
            총 비용: <span className="text-indigo-600 dark:text-indigo-400">{totalCost.toLocaleString()} P</span>
          </div>

          <div className="flex items-center">
            <input id="terms-agreement" name="terms-agreement" type="checkbox" checked={termsAgreement} onChange={handleTermsAgreementChange} className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500" />
            <label htmlFor="terms-agreement" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">이용약관 및 개인정보처리방침에 동의합니다.</label>
          </div>

          <button 
            type="button"
            onClick={handleSubmit} 
            disabled={isSubmitting || !termsAgreement || !selectedSubServiceId || orderQuantity === '' || serviceLink === ''}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '주문 처리 중...' : `${totalCost.toLocaleString()} P 결제하기`}
          </button>
        </div>

        {/* 오른쪽 패널 (선택한 서비스 정보 표시) */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">선택한 서비스 정보</h2>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">서비스 이름</h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100" id="service-name-display">{selectedServiceDetails?.name || '-'}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">최소 주문 수량</h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100" id="min-order-display">{selectedServiceDetails?.minOrder?.toLocaleString() || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">최대 주문 수량</h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100" id="max-order-display">{selectedServiceDetails?.maxOrder?.toLocaleString() || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">1개당 가격</h3>
              {selectedServiceDetails ? (
                selectedServiceDetails.custom_price !== null && 
                selectedServiceDetails.custom_price !== undefined && 
                selectedServiceDetails.custom_price < selectedServiceDetails.pricePerUnit ? (
                  <div className="mt-1 text-sm">
                    <span className="text-red-500 font-semibold">{selectedServiceDetails.custom_price.toLocaleString()} P</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      (기본: {selectedServiceDetails.pricePerUnit.toLocaleString()} P - 
                      {(selectedServiceDetails.pricePerUnit - selectedServiceDetails.custom_price).toLocaleString()} P 할인)
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedServiceDetails.pricePerUnit.toLocaleString()} P
                  </p>
                )
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">-</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">서비스 설명</h3>
            <p 
              className="mt-1 text-sm text-gray-900 dark:text-gray-100 h-60 overflow-y-auto border dark:border-gray-700 p-2 rounded-md whitespace-pre-wrap"
              id="service-description-display"
            >
              {selectedServiceDetails?.description || '서비스를 선택하면 여기에 설명이 표시됩니다.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
