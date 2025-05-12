"use client";

import React, { useState, useEffect } from 'react';

// 데이터 타입 정의
interface SubServiceItem {
  id: string;
  name: string;
  pricePerUnit: number;
  minOrder: number;
  maxOrder: number;
  description: string;
}

interface ServiceType {
  id: string;
  name: string;
  subServices: SubServiceItem[];
}

interface ServiceCategory {
  id: string;
  name: string;
  serviceTypes: ServiceType[];
}

// 실제 데이터 (ServiceListDisplay.tsx의 instagramLikes 데이터 반영)
const serviceCategoriesData: ServiceCategory[] = [
  {
    id: 'instagram',
    name: '인스타그램 서비스',
    serviceTypes: [
      {
        id: 'insta_likes_type',
        name: '인스타그램 유저 좋아요',
        subServices: [
          { id: '4', name: "[파워] [서버1] 실제 외국인 좋아요 AS30일", pricePerUnit: 0.5, minOrder: 10, maxOrder: 500000, description: "외국인 좋아요 AS30일 설명입니다." },
          { id: '42', name: "[파워] 리얼 한국인 게시물 좋아요❤️", pricePerUnit: 3, minOrder: 50, maxOrder: 10000, description: "리얼 한국인 좋아요 설명입니다." },
          { id: '43', name: "실제 한국인 남성 게시물 좋아요", pricePerUnit: 30, minOrder: 5, maxOrder: 5000, description: "남성 좋아요 설명." },
          { id: '44', name: "실제 한국인 여성 게시물 좋아요", pricePerUnit: 30, minOrder: 5, maxOrder: 5000, description: "여성 좋아요 설명." },
          { id: '45', name: "실제 한국인 20대 연령 게시물 좋아요", pricePerUnit: 30, minOrder: 5, maxOrder: 10000, description: "20대 좋아요 설명." },
          { id: '46', name: "실제 한국인 20대 연령 남성 게시물 좋아요", pricePerUnit: 40, minOrder: 5, maxOrder: 3000, description: "20대 남성 좋아요 설명." },
          { id: '47', name: "실제 한국인 20대 연령 여성 게시물 좋아요", pricePerUnit: 40, minOrder: 5, maxOrder: 5000, description: "20대 여성 좋아요 설명." },
          { id: '212', name: "실제 한국인 좋아요 늘리기 ❤️", pricePerUnit: 15, minOrder: 5, maxOrder: 10000, description: "좋아요 늘리기 설명." },
          { id: '225', name: "[파워] [서버2] 실제 외국인 좋아요 AS30일", pricePerUnit: 0.6, minOrder: 10, maxOrder: 500000, description: "외국인 좋아요 AS30일 (서버2) 설명." },
        ]
      },
      {
        id: 'insta_followers_type',
        name: '인스타그램 유저 팔로워',
        subServices: [
          { id: 'foll_1', name: '기본 팔로워 늘리기', pricePerUnit: 10, minOrder: 100, maxOrder: 10000, description: '기본 팔로워 서비스입니다.'},
          { id: 'foll_real_kr', name: '실제 한국인 팔로워', pricePerUnit: 150, minOrder: 10, maxOrder: 1000, description: '실제 활동하는 한국인 팔로워를 늘립니다.'}
        ]
      },
      {
        id: 'insta_comments_type',
        name: '인스타그램 댓글',
        subServices: [
          { id: 'cmt_kr_normal', name: '실제 한국인 댓글 (일반)', pricePerUnit: 500, minOrder: 10, maxOrder: 1000, description: '자연스러운 내용의 한국인 댓글입니다.' },
          { id: 'cmt_kr_positive', name: '실제 한국인 댓글 (칭찬/긍정)', pricePerUnit: 600, minOrder: 10, maxOrder: 1000, description: '칭찬 또는 긍정적인 내용의 한국인 댓글입니다.' },
          { id: 'cmt_global', name: '외국인 댓글 (글로벌)', pricePerUnit: 300, minOrder: 10, maxOrder: 2000, description: '다양한 국가의 외국인 댓글입니다.' },
        ]
      },
      {
        id: 'insta_reach_type',
        name: '인스타그램 도달 노출 프로필방문 조회수',
        subServices: [
          { id: 'reach_post', name: '게시물 도달 늘리기', pricePerUnit: 2, minOrder: 100, maxOrder: 100000, description: '게시물의 도달 범위를 넓힙니다.' },
          { id: 'impression_post', name: '게시물 노출 늘리기', pricePerUnit: 1, minOrder: 100, maxOrder: 200000, description: '게시물의 노출 횟수를 증가시킵니다.' },
          { id: 'profile_visit', name: '프로필 방문자 늘리기', pricePerUnit: 5, minOrder: 50, maxOrder: 50000, description: '프로필 방문자 수를 증가시킵니다.' },
          { id: 'post_views', name: '게시물 조회수 늘리기 (동영상/릴스)', pricePerUnit: 0.8, minOrder: 100, maxOrder: 1000000, description: '동영상 또는 릴스 게시물의 조회수를 늘립니다.'}
        ]
      },
      {
        id: 'insta_auto_type',
        name: '인스타그램 자동화 서비스',
        subServices: [
            { id: 'auto_likes_monthly', name: '한달 자동 좋아요', pricePerUnit: 30000, minOrder: 1, maxOrder: 1, description: '한달 동안 업로드되는 새 게시물에 자동으로 좋아요를 제공합니다. (가격은 월 단위)'},
            { id: 'auto_views_monthly', name: '한달 자동 조회수 (릴스/영상)', pricePerUnit: 25000, minOrder: 1, maxOrder: 1, description: '한달 동안 업로드되는 새 릴스/영상에 자동으로 조회수를 제공합니다. (가격은 월 단위)'}
        ]
      },
    ],
  },
];

export default function OrderPage() {
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
    
    // Reset dependent states
    setAvailableServiceTypes(categoryId ? serviceCategoriesData.find(cat => cat.id === categoryId)?.serviceTypes || [] : []);
    setSelectedServiceTypeId('');
    setAvailableSubServices([]);
    setSelectedSubServiceId('');
    setSelectedServiceDetails(null);
    setOrderQuantity('');
    setServiceLink('');
  };

  const handleServiceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceTypeId = event.target.value;
    setSelectedServiceTypeId(serviceTypeId);

    setAvailableSubServices(serviceTypeId ? availableServiceTypes.find(st => st.id === serviceTypeId)?.subServices || [] : []);
    setSelectedSubServiceId('');
    setSelectedServiceDetails(null);
    setOrderQuantity('');
    setServiceLink(''); 
  };

  const handleSubServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const subServiceId = event.target.value;
    setSelectedSubServiceId(subServiceId);
    setOrderQuantity('');
    // setServiceLink(''); // 링크는 서비스 변경시 초기화하지 않을 수 있음 (사용자 편의)

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
        const cost = selectedServiceDetails.pricePerUnit * quantityNum;
        setTotalCost(cost);
      } else {
        setTotalCost(0);
      }
    } else {
      setTotalCost(0);
    }
  }, [selectedServiceDetails, orderQuantity]);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // 기본 폼 제출 방지

    if (!selectedServiceDetails || !orderQuantity || totalCost === 0 || !serviceLink || !termsAgreement) {
      alert("모든 필수 항목을 입력하고 약관에 동의해주세요.");
      return;
    }
    
    // 수량이 최소/최대 주문 범위를 벗어나는지 확인
    const quantityNum = parseInt(orderQuantity, 10);
    if (selectedServiceDetails && 
        (quantityNum < selectedServiceDetails.minOrder || quantityNum > selectedServiceDetails.maxOrder)) {
      alert(`수량은 ${selectedServiceDetails.minOrder}에서 ${selectedServiceDetails.maxOrder} 사이로 입력해주세요.`);
      return;
    }

    const orderDetails = {
      serviceId: selectedSubServiceId,
      serviceName: selectedServiceDetails.name,
      quantity: orderQuantity,
      link: serviceLink,
      cost: totalCost,
      timestamp: new Date().toISOString(),
    };

    console.log("주문 정보:", orderDetails);
    alert("주문이 접수되었습니다 (콘솔에서 상세 정보 확인). 실제 기능은 백엔드 구현 후 연동됩니다.");
    resetForm(); // 폼 초기화
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">새로운 주문</h2>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">카테고리를 먼저 선택해주세요.</label>
            <select id="category" name="category" value={selectedCategoryId} onChange={handleCategoryChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white">
              <option value="">카테고리 선택</option>
              {serviceCategoriesData.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
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
              {availableSubServices.map(sub => (<option key={sub.id} value={sub.id}>{sub.name} (1개당: {sub.pricePerUnit}원, 주문범위: {sub.minOrder}~{sub.maxOrder})</option>))}
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
            총 비용: ₩ <span id="total-cost">{totalCost.toLocaleString()}</span>
          </div>

          <div className="flex items-center">
            <input id="terms-agreement" name="terms-agreement" type="checkbox" checked={termsAgreement} onChange={handleTermsAgreementChange} className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500" />
            <label htmlFor="terms-agreement" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">이용약관 및 개인정보처리방침에 동의합니다.</label>
          </div>

          <button type="button" onClick={handleSubmit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800" disabled={!selectedServiceDetails || !orderQuantity || totalCost === 0 || !serviceLink || !termsAgreement}>
            주문하기
          </button>
        </div>

        {/* 오른쪽 패널 (이전과 동일) */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">선택한 서비스 정보</h2>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">서비스 이름</h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100" id="service-name-display">{selectedServiceDetails?.name || '-'}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">최소 주문 수량</h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100" id="min-order-display">{selectedServiceDetails?.minOrder?.toString() || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">최대 주문 수량</h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100" id="max-order-display">{selectedServiceDetails?.maxOrder?.toString() || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">1개당 가격</h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100" id="price-per-unit-display">{selectedServiceDetails?.pricePerUnit ? `₩${selectedServiceDetails.pricePerUnit.toLocaleString()}` : '-'}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">서비스 설명</h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 h-24 overflow-y-auto border dark:border-gray-700 p-2 rounded-md" id="service-description-display">{selectedServiceDetails?.description || '서비스를 선택하면 여기에 설명이 표시됩니다.'}</p>
          </div>
        </div>
      </div>

      <button className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-full shadow-lg flex items-center" onClick={() => alert("실시간 상담 기능 구현 예정")}>
        <span role="img" aria-label="support" className="mr-2">🙋🏻‍♂️</span>
        실시간 상담
      </button>
    </div>
  );
} 