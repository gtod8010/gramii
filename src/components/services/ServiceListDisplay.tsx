"use client"; // 클라이언트 컴포넌트 명시

import React, { useState, useEffect, useCallback } from 'react';
import ServiceDescriptionModal from '@/components/services/ServiceDescriptionModal';

// 기존 ServiceItem 인터페이스는 DisplayServiceItem으로 대체 또는 통합 고려
interface DisplayServiceItem {
  id: string | number;
  name: string;
  price: string; // "가격 [단위당]" 형태
  quantity: string; // "최소 / 최대"
  description: React.ReactNode; 
  // originalService?: any; // 필요시 원본 데이터를 포함할 수 있음 (관리 페이지에서는 사용)
}

// API로부터 받는 원본 서비스 데이터 타입 (manage-services/page.tsx와 유사하게 정의)
interface ApiService {
  id: number;
  name: string;
  service_type_id: number;
  description?: string | null;
  price_per_unit?: number | undefined;
  min_order_quantity?: number | undefined;
  max_order_quantity?: number | undefined;
  is_active: boolean;
  service_type_name?: string; 
  category_name?: string; 
}

interface GroupedServices {
  [categoryName: string]: {
    [serviceTypeName: string]: DisplayServiceItem[];
  };
}

interface ServiceSectionProps {
  title: string;
  services: DisplayServiceItem[];
  onViewDetails: (service: DisplayServiceItem) => void;
}

const ServiceTable: React.FC<{ services: DisplayServiceItem[]; onViewDetails: (service: DisplayServiceItem) => void }> = ({ services, onViewDetails }) => (
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
        {services.map((service) => (
          <tr key={service.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
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
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
    </div>
    {services.length > 0 ? (
      <ServiceTable services={services} onViewDetails={onViewDetails} />
    ) : (
      <p className="text-sm text-gray-500 dark:text-gray-400">해당 타입의 서비스가 없습니다.</p>
    )}
  </div>
);

const ServiceListDisplay = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<DisplayServiceItem | null>(null);

  const [groupedServices, setGroupedServices] = useState<GroupedServices>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleViewDetails = (service: DisplayServiceItem) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const fetchAndGroupServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/services'); // GET /api/services 호출
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '서비스 목록을 불러오는데 실패했습니다.');
      }
      const services: ApiService[] = await response.json();
      
      const activeServices = services.filter(service => service.is_active);

      const grouped: GroupedServices = activeServices.reduce((acc, service) => {
        const categoryName = service.category_name || '기타 카테고리';
        const typeName = service.service_type_name || '기타 타입';

        if (!acc[categoryName]) {
          acc[categoryName] = {};
        }
        if (!acc[categoryName][typeName]) {
          acc[categoryName][typeName] = [];
        }

        acc[categoryName][typeName].push({
          id: service.id,
          name: service.name,
          price: `${service.price_per_unit || 0} 원`,
          quantity: `${service.min_order_quantity || 0} / ${service.max_order_quantity || 0}`,
          description: service.description || '설명이 없습니다.', 
        });
        return acc;
      }, {} as GroupedServices);
      setGroupedServices(grouped);
    } catch (err: any) {
      setError(err.message);
      setGroupedServices({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndGroupServices();
  }, [fetchAndGroupServices]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><p className="text-lg dark:text-white">서비스 목록을 불러오는 중...</p></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen"><p className="text-lg text-red-500">오류: {error}</p></div>;
  }

  if (Object.keys(groupedServices).length === 0) {
    return <div className="flex items-center justify-center h-screen"><p className="text-lg dark:text-white">등록된 서비스가 없습니다.</p></div>;
  }

  return (
    <div className="space-y-8 p-4 md:p-6"> 
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">서비스 목록</h1>
      
      {Object.entries(groupedServices).map(([categoryName, typesByServiceType]) => (
        <div key={categoryName} className="p-6 md:p-8 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            {categoryName}
          </h2>
          {Object.entries(typesByServiceType).map(([typeName, services]) => (
            <ServiceSection 
              key={typeName} 
              title={typeName} 
              services={services} 
              onViewDetails={handleViewDetails} 
            />
          ))}
        </div>
      ))}

      <ServiceDescriptionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        service={selectedService} 
      />
    </div>
  );
};

export default ServiceListDisplay; 