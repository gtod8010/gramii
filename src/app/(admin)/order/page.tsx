"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { toast } from 'react-hot-toast';

// 데이터 타입 정의 (기존 정의 유지 또는 API 응답에 맞게 조정)
interface SubServiceItem {
  id: string; // API에서 number로 온다면 string으로 변환하거나, 타입을 number로 변경
  name: string;
  pricePerUnit: number;
  custom_price?: number | null;
  minOrder: number;
  maxOrder: number;
  description: string;
  type: string; // 서비스 타입을 구분하기 위한 필드 추가 (예: 'Default', 'Custom Comments')
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
  type: string; // 'Custom Comments' 등을 식별하기 위한 타입
  price_per_unit: string; // API에서 문자열로 오므로 파싱 필요
  custom_price: string | null; // user_specific_price -> custom_price로 수정 및 타입 일치
  min_order_quantity: number;
  max_order_quantity: number;
  description: string | null;
  is_active: boolean;
  category_id: number;
  service_type_id: number;
  category_name: string;
  service_type_name: string;
}

interface OrderPayload {
  userId: number;
  serviceId: number;
  quantity: number;
  totalPrice: number;
  requestDetails: string;
  comments?: string;
}

// 하드코딩된 serviceCategoriesData 제거
// const serviceCategoriesData: ServiceCategory[] = [...];

export default function OrderPage() {
  const { user, isLoading: userIsLoading } = useUser();
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
  const [comments, setComments] = useState<string[]>(['', '', '']);

  const fetchAndStructureServices = useCallback(async () => {
    setIsLoadingServices(true);
    setErrorServices(null);
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('인증 토큰이 없습니다.');

      const response = await fetch('/api/services', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('서비스 목록을 불러오는데 실패했습니다.');
      
      const services: ApiService[] = await response.json();
      
      const activeServices = services.filter(s => s.is_active);

      const structuredCategoriesMap = new Map<string, ServiceCategory>();

      for (const service of activeServices) {
        const categoryId = service.category_id.toString();
        const categoryName = service.category_name;
        
        if (!structuredCategoriesMap.has(categoryId)) {
          structuredCategoriesMap.set(categoryId, { id: categoryId, name: categoryName, serviceTypes: [] });
        }
        
        const category = structuredCategoriesMap.get(categoryId)!;
        
        const serviceTypeId = service.service_type_id.toString();
        const serviceTypeName = service.service_type_name;
        
        let serviceType = category.serviceTypes.find(st => st.id === serviceTypeId);
        if (!serviceType) {
          serviceType = { id: serviceTypeId, name: serviceTypeName, subServices: [] };
          category.serviceTypes.push(serviceType);
        }
        
        serviceType.subServices.push({
          id: service.id.toString(),
          name: service.name,
          pricePerUnit: parseFloat(service.price_per_unit),
          minOrder: service.min_order_quantity,
          maxOrder: service.max_order_quantity,
          description: service.description || '',
          custom_price: service.custom_price ? parseFloat(service.custom_price) : null,
          type: service.type || 'Default',
        });
      }

      const structuredCategories = Array.from(structuredCategoriesMap.values());
      
      // 카테고리 및 서비스 타입 정렬 (옵션)
      structuredCategories.sort((a, b) => a.name.localeCompare(b.name));
      structuredCategories.forEach(c => c.serviceTypes.sort((a, b) => a.name.localeCompare(b.name)));

      setServiceCategories(structuredCategories);

    } catch (err) {
      if (err instanceof Error) {
        setErrorServices(err.message);
      } else {
        setErrorServices('An unknown error occurred while fetching services.');
      }
      setServiceCategories([]);
    } finally {
      setIsLoadingServices(false);
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
    setComments(['', '', '']);
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
    setComments(['', '', '']);
  };

  const handleServiceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceTypeId = event.target.value;
    setSelectedServiceTypeId(serviceTypeId);
    setAvailableSubServices(serviceTypeId ? availableServiceTypes.find(st => st.id === serviceTypeId)?.subServices || [] : []);
    setSelectedSubServiceId('');
    setSelectedServiceDetails(null);
    setOrderQuantity('');
    setComments(['', '', '']);
  };

  const handleSubServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const subServiceId = event.target.value;
    setSelectedSubServiceId(subServiceId);
    
    if (subServiceId) {
      const serviceDetail = availableSubServices.find(sub => sub.id === subServiceId);
      setSelectedServiceDetails(serviceDetail || null);
      
      // 댓글 서비스일 경우, 수량을 최소 주문 수량으로 초기화
      if (serviceDetail && serviceDetail.type === 'Custom Comments') {
        const minOrder = serviceDetail.minOrder;
        setOrderQuantity(minOrder.toString());
        setComments(Array(minOrder).fill(''));
      } else {
        setOrderQuantity('');
        setComments([]);
      }
    } else {
      setSelectedServiceDetails(null);
      setOrderQuantity('');
      setComments([]);
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

  const handleCommentChange = (index: number, value: string) => {
    const newComments = [...comments];
    newComments[index] = value;
    setComments(newComments);
  };

  const handleQuantityChangeForComment = (change: number) => {
    if (!selectedServiceDetails) return;
  
    const currentQuantity = parseInt(orderQuantity, 10) || 0;
    const newQuantity = currentQuantity + change;
  
    if (newQuantity >= selectedServiceDetails.minOrder && newQuantity <= selectedServiceDetails.maxOrder) {
      setOrderQuantity(newQuantity.toString());
      const newComments = [...comments];
      if (change > 0) {
        // 수량 증가
        newComments.push('');
      } else {
        // 수량 감소
        newComments.pop();
      }
      setComments(newComments);
    } else {
      toast.error(`주문 수량은 ${selectedServiceDetails.minOrder}에서 ${selectedServiceDetails.maxOrder} 사이여야 합니다.`);
    }
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
    
    if (!selectedSubServiceId || !orderQuantity || !serviceLink || !termsAgreement || !selectedServiceDetails) {
      toast.error('모든 필수 항목을 입력하고 약관에 동의해주세요.');
      return;
    }
    const quantityNum = parseInt(orderQuantity, 10);

    if (selectedServiceDetails?.type === 'Custom Comments' && comments.slice(0, quantityNum).some(c => c.trim() === '')) {
      toast.error('모든 댓글을 입력해주세요.');
      return;
    }
    
    if (isNaN(quantityNum) || quantityNum < selectedServiceDetails.minOrder || quantityNum > selectedServiceDetails.maxOrder) {
      toast.error(`주문 수량은 ${selectedServiceDetails.minOrder}에서 ${selectedServiceDetails.maxOrder} 사이여야 합니다.`);
      return;
    }
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    if ((user.points || 0) < totalCost) {
      toast.error('포인트가 부족합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: OrderPayload = {
        userId: user.id,
        serviceId: parseInt(selectedSubServiceId, 10),
        quantity: quantityNum,
        totalPrice: totalCost,
        requestDetails: serviceLink,
      };

      if (selectedServiceDetails?.type === 'Custom Comments') {
        formData.comments = comments.slice(0, quantityNum).join('\\n');
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '주문 생성에 실패했습니다.');
      }
      
      toast.success('주문이 성공적으로 완료되었습니다!');
      
      // Dispatch a global event to notify all components to update user info
      document.dispatchEvent(new CustomEvent('forceUserUpdate'));
      
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
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
                const isDiscounted = sub.custom_price !== null && sub.custom_price !== undefined && sub.custom_price < sub.pricePerUnit;
                const displayPrice = isDiscounted
                  ? `${sub.custom_price!.toLocaleString()}P (할인)`
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

          {selectedServiceDetails?.type === 'Custom Comments' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  댓글 목록 (총 {orderQuantity}개)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <button 
                    type="button" 
                    onClick={() => handleQuantityChangeForComment(-1)}
                    disabled={!selectedServiceDetails || parseInt(orderQuantity, 10) <= selectedServiceDetails.minOrder}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-md disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold">{orderQuantity}</span>
                  <button 
                    type="button" 
                    onClick={() => handleQuantityChangeForComment(1)}
                    disabled={!selectedServiceDetails || parseInt(orderQuantity, 10) >= selectedServiceDetails.maxOrder}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-md disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {comments.map((comment, index) => (
                  <input
                    key={index}
                    type="text"
                    value={comment}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
                    placeholder={`댓글 ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">서비스 수량을 입력해주세요.</label>
              <input type="number" name="quantity" id="quantity" value={orderQuantity} onChange={handleQuantityChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white" placeholder="수량 입력" min={selectedServiceDetails?.minOrder?.toString()} max={selectedServiceDetails?.maxOrder?.toString()} disabled={!selectedServiceDetails} required />
            </div>
          )}
          
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
            disabled={isSubmitting || !termsAgreement || !selectedSubServiceId || orderQuantity === ''}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '주문 처리 중...' : `${totalCost.toLocaleString()} P 결제하기`}
          </button>
        </div>

        {/* 오른쪽 패널 (선택한 서비스 정보 표시) */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col space-y-4">
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
          <div className="flex flex-col flex-grow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">서비스 설명</h3>
            <p 
              className="mt-1 text-sm text-gray-900 dark:text-gray-100 h-0 flex-grow overflow-y-auto border dark:border-gray-700 p-2 rounded-md whitespace-pre-wrap"
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
