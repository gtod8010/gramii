"use client"; // 클라이언트 컴포넌트 명시

import React, { useState } from 'react';
import ServiceDescriptionModal from '@/components/services/ServiceDescriptionModal';

// page.tsx에 있던 타입 정의들을 여기로 가져옴
interface ServiceItem {
  id: string | number;
  name: string;
  price: string;
  quantity: string;
  description: React.ReactNode;
}

interface ServiceSectionProps {
  title: string;
  services: ServiceItem[];
  onViewDetails: (service: ServiceItem) => void;
}

const ServiceTable: React.FC<{ services: ServiceItem[]; onViewDetails: (service: ServiceItem) => void }> = ({ services, onViewDetails }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-gray-100 text-left dark:bg-gray-700">
          <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">ID</th>
          <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">이름</th>
          <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">가격(₩)</th>
          <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">최소/최대 주문</th>
          <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 text-center">설명</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service, index) => (
          <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{service.id}</td>
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{service.name}</td>
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{service.price}</td>
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{service.quantity}</td>
            <td className="px-4 py-3 text-center">
              <button 
                onClick={() => onViewDetails(service)}
                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ServiceSection: React.FC<ServiceSectionProps> = ({ title, services, onViewDetails }) => (
  <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
    </div>
    <ServiceTable services={services} onViewDetails={onViewDetails} />
  </div>
);

// 컴포넌트 이름을 ServiceListDisplay 등으로 변경하고 export default 처리
const ServiceListDisplay = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleViewDetails = (service: ServiceItem) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const instagramFollowers: ServiceItem[] = [
    { id: 14, name: "[고품질] 외국인 팔로워 😍", price: "6 [1개당]", quantity: "10 / 5000000", description: <p>이것은 외국인 팔로워 서비스에 대한 <strong>상세 설명</strong>입니다. <br/>여러 줄을 포함할 수 있습니다.</p> },
    { id: 166, name: "[추천💕]실제 한국인 팔로워", price: "100 [1개당]", quantity: "10 / 50000", description: "한국인 팔로워 상세 설명입니다." },
    { id: 236, name: "[가성비👍]고품질 한국인 팔로워", price: "30 [1개당]", quantity: "1 / 15000", description: "가성비 한국인 팔로워 설명입니다." },
  ];

  const instagramComments: ServiceItem[] = [
    { id: 214, name: "인스타 실제 한국인 지정 댓글", price: "200 [1개당]", quantity: "3 / 2000", description: "지정 댓글 서비스입니다." },
    { id: 215, name: "인스타 실제 한국인 랜덤 댓글", price: "200 [1개당]", quantity: "3 / 2000", description: "랜덤 댓글 서비스입니다." },
  ];
  
  const instagramReach: ServiceItem[] = [
    { id: 9, name: "[최저] 실제 한국인 공유", price: "1 [1개당]", quantity: "100 / 5000000", description: "공유 서비스 설명입니다." },
    { id: 10, name: "[최저] 실제 한국인 프로필 방문", price: "0.3 [1개당]", quantity: "100 / 5000000", description: "프로필 방문 서비스 설명입니다." },
    { id: 11, name: "[최저] [묶음] 실제 한국인 노출 + 도달", price: "0.3 [1개당]", quantity: "10 / 1000000", description: "노출+도달 묶음 서비스입니다." },
    { id: 101, name: "[최저] 실제 한국인 저장", price: "0.5 [1개당]", quantity: "10 / 1000000", description: "저장 서비스 설명입니다." },
  ];

  const instagramLikes: ServiceItem[] = [
    { id: 4, name: "[파워] [서버1] 실제 외국인 좋아요 AS30일", price: "0.5 [1개당]", quantity: "10 / 500000", description: "외국인 좋아요 AS30일 설명입니다." },
    { id: 42, name: "[파워] 리얼 한국인 게시물 좋아요❤️", price: "3 [1개당]", quantity: "50 / 10000", description: "리얼 한국인 좋아요 설명입니다." },
    { id: 43, name: "실제 한국인 남성 게시물 좋아요", price: "30 [1개당]", quantity: "5 / 5000", description: "남성 좋아요 설명." },
    { id: 44, name: "실제 한국인 여성 게시물 좋아요", price: "30 [1개당]", quantity: "5 / 5000", description: "여성 좋아요 설명." },
    { id: 45, name: "실제 한국인 20대 연령 게시물 좋아요", price: "30 [1개당]", quantity: "5 / 10000", description: "20대 좋아요 설명." },
    { id: 46, name: "실제 한국인 20대 연령 남성 게시물 좋아요", price: "40 [1개당]", quantity: "5 / 3000", description: "20대 남성 좋아요 설명." },
    { id: 47, name: "실제 한국인 20대 연령 여성 게시물 좋아요", price: "40 [1개당]", quantity: "5 / 5000", description: "20대 여성 좋아요 설명." },
    { id: 212, name: "실제 한국인 좋아요 늘리기 ❤️", price: "15 [1개당]", quantity: "5 / 10000", description: "좋아요 늘리기 설명." },
    { id: 225, name: "[파워] [서버2] 실제 외국인 좋아요 AS30일", price: "0.6 [1개당]", quantity: "10 / 500000", description: "외국인 좋아요 AS30일 (서버2) 설명." },
  ];

  return (
    <div className="space-y-8"> {/* 전체 페이지 컨테이너 간격 조정 */}
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">서비스 목록</h1>
      
      {/* 인스타그램 서비스 전체 컨테이너 */}
      <div className="p-6 md:p-8 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">인스타그램 서비스</h2>
        
        <ServiceSection title="팔로워" services={instagramFollowers} onViewDetails={handleViewDetails} />
        <ServiceSection title="댓글" services={instagramComments} onViewDetails={handleViewDetails} />
        <ServiceSection title="도달 노출 프로필방문 조회수" services={instagramReach} onViewDetails={handleViewDetails} />
        <ServiceSection title="유저 좋아요" services={instagramLikes} onViewDetails={handleViewDetails} />
      </div>
      
      {/* 다른 플랫폼 서비스가 있다면 여기에 유사한 컨테이너 추가 */}
      {/* 예: 
      <div className="p-6 md:p-8 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">유튜브 서비스</h2>
        <ServiceSection title="구독자" services={youtubeSubscribers} onViewDetails={handleViewDetails} />
      </div>
      */}

      <ServiceDescriptionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        service={selectedService} 
      />
    </div>
  );
};

export default ServiceListDisplay; 