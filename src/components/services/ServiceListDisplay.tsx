"use client"; // 클라이언트 컴포넌트 명시

import React, { useState, useEffect, useCallback } from 'react';
import ServiceDescriptionModal from '@/components/services/ServiceDescriptionModal';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'; // Chevron 아이콘 임포트

interface Category {
  id: number;
  name: string;
}

// 서비스 타입 인터페이스 추가
interface ServiceType {
  id: number;
  name: string;
  category_id: number;
  display_order: number;
}

// DisplayServiceItem 인터페이스 수정
interface DisplayServiceItem {
  id: string | number;
  name: string;
  pricePerUnit: number; // 기본 단가 (원래 price 필드 대체)
  custom_price?: number | null; // 특별 단가 추가
  quantity: string; // "최소 / 최대"
  description: React.ReactNode; 
}

// 스페셜 관련 인터페이스 추가
interface Special {
  id: number;
  name: string;
  description?: string;
  service_ids?: number[];
}

interface DisplaySpecialPublic extends Special {
  services: DisplayServiceItem[]; // 기존 DisplayServiceItem 재활용
}

// API로부터 받는 원본 서비스 데이터 타입 수정
interface ApiService {
  id: number;
  name: string;
  service_type_id: number;
  description?: string | null;
  price_per_unit?: number | undefined; // 기본 단가
  custom_price?: number | null; // 특별 단가 추가 (API 응답에 포함되어야 함)
  min_order_quantity?: number | undefined;
  max_order_quantity?: number | undefined;
  is_active: boolean;
  service_type_name?: string; 
  category_name?: string; 
  display_order: number; // display_order 추가
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
    <table className="w-full table-auto">
      <thead className="hidden lg:table-header-group bg-gray-100 text-left dark:bg-gray-700">
        <tr>
          <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">ID</th>
          <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">이름</th>
          <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">가격(P)</th>
          <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">최소/최대 주문</th>
          <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 text-center">설명</th>
        </tr>
      </thead>
      <tbody className="block lg:table-row-group">
        {services.map((service) => {
          const isCustomPriceApplicable = service.custom_price !== null && service.custom_price !== undefined;
          const effectivePrice = isCustomPriceApplicable ? service.custom_price! : service.pricePerUnit;
          const isDiscounted = isCustomPriceApplicable && service.custom_price! < service.pricePerUnit;

          return (
          <tr key={service.id} className="block lg:table-row mb-4 lg:mb-0 border lg:border-0 rounded-lg lg:rounded-none border-b border-gray-200 dark:border-gray-700 lg:hover:bg-gray-50 dark:lg:hover:bg-gray-600/50">
            
            <td className="p-3 lg:px-4 lg:py-3 text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center lg:table-cell">
              <span className="font-semibold text-xs uppercase text-slate-500 lg:hidden">ID</span>
              <span>{service.id}</span>
            </td>

            <td className="p-3 lg:px-4 lg:py-3 text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center lg:table-cell border-t lg:border-t-0 border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-xs uppercase text-slate-500 lg:hidden">이름</span>
              <span className="text-right lg:text-left">{service.name}</span>
            </td>
            
            <td className="p-3 lg:px-4 lg:py-3 text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center lg:table-cell border-t lg:border-t-0 border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-xs uppercase text-slate-500 lg:hidden">가격(P)</span>
                <div className='text-right lg:text-left'>
                {isDiscounted ? (
                  <>
                    <span className="text-red-500 font-semibold">{service.custom_price?.toLocaleString()} P</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 block sm:inline">
                      (기본: {service.pricePerUnit.toLocaleString()} P)
                    </span>
                  </>
                ) : (
                  <span>{effectivePrice.toLocaleString()} P</span>
                )}
                </div>
            </td>

            <td className="p-3 lg:px-4 lg:py-3 text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center lg:table-cell border-t lg:border-t-0 border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-xs uppercase text-slate-500 lg:hidden">최소/최대 주문</span>
              <span>{service.quantity}</span>
            </td>
            
            <td className="p-3 lg:px-4 lg:py-3 flex justify-between items-center lg:table-cell lg:text-center border-t lg:border-t-0 border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-xs uppercase text-slate-500 lg:hidden">설명</span>
              <button 
                onClick={() => onViewDetails(service)}
                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                View
              </button>
            </td>
          </tr>
          );
        })}
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

  // 스페셜 관련 상태 추가
  const [displaySpecials, setDisplaySpecials] = useState<DisplaySpecialPublic[]>([]);
  const [collapsedSpecials, setCollapsedSpecials] = useState<Record<number, boolean>>({});

  const [groupedServices, setGroupedServices] = useState<GroupedServices>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]); // serviceTypes 상태 추가
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

  // 스페셜 섹션 토글 함수
  const toggleSpecialCollapse = (specialId: number) => {
    setCollapsedSpecials(prev => ({ ...prev, [specialId]: !prev[specialId] }));
  };

  const fetchAndGroupServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 서비스 타입 API 호출 추가
      const [servicesResponse, specialsResponse, categoriesResponse, serviceTypesResponse] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/specials'),
        fetch('/api/categories'),
        fetch('/api/service-types') // 서비스 타입 fetch 추가
      ]);

      if (!servicesResponse.ok) {
        const errorData = await servicesResponse.json();
        throw new Error(errorData.message || '서비스 목록을 불러오는데 실패했습니다.');
      }
      const services: ApiService[] = await servicesResponse.json();

      if (!specialsResponse.ok) {
        const errorData = await specialsResponse.json();
        throw new Error(errorData.message || '스페셜 목록을 불러오는데 실패했습니다.');
      }
      const specialsData: Special[] = await specialsResponse.json();

      if (!categoriesResponse.ok) {
        const errorData = await categoriesResponse.json();
        throw new Error(errorData.message || '카테고리 목록을 불러오는데 실패했습니다.');
      }
      const categoriesData: Category[] = await categoriesResponse.json();
      setCategories(categoriesData);

      // 서비스 타입 데이터 처리
      if (!serviceTypesResponse.ok) {
        const errorData = await serviceTypesResponse.json();
        throw new Error(errorData.message || '서비스 타입 목록을 불러오는데 실패했습니다.');
      }
      const serviceTypesData: ServiceType[] = await serviceTypesResponse.json();
      setServiceTypes(serviceTypesData);
      
      const activeServices = services.filter(service => service.is_active);

      // 스페셜 데이터 가공
      const newDisplaySpecials = specialsData.map(special => {
        const servicesForSpecial: DisplayServiceItem[] = [];
        if (special.service_ids && special.service_ids.length > 0) {
          special.service_ids.forEach(serviceId => {
            const rawService = activeServices.find(rs => rs.id === serviceId);
            if (rawService) {
              servicesForSpecial.push({
                id: rawService.id,
                name: rawService.name,
                pricePerUnit: rawService.price_per_unit || 0,
                custom_price: rawService.custom_price,
                quantity: `${rawService.min_order_quantity || 0} / ${rawService.max_order_quantity || 0}`,
                description: rawService.description || '설명이 없습니다.',
              });
            }
          });
        }
        // 스페셜 내 서비스 정렬 (예: 이름순)
        servicesForSpecial.sort((a, b) => a.name.localeCompare(b.name));
        return { ...special, services: servicesForSpecial };
      }).filter(sp => sp.services.length > 0); // 서비스가 있는 스페셜만 표시
      setDisplaySpecials(newDisplaySpecials);

      // 일반 서비스 가공 (스페셜에 속하지 않은 서비스만 필터링)
      const nonSpecialActiveServices = activeServices.filter(service => {
        return !specialsData.some(special => special.service_ids?.includes(service.id));
      });

      // 그룹화하기 전에 display_order 기준으로 정렬합니다.
      // Array.prototype.reduce는 배열 순서를 유지하므로, 그룹 내에서도 정렬이 유지됩니다.
      nonSpecialActiveServices.sort((a, b) => a.display_order - b.display_order);

      const grouped: GroupedServices = nonSpecialActiveServices.reduce((acc, service) => {
        const categoryName = service.category_name || '기타 카테고리';
        const typeName = service.service_type_name || '기타 타입';

        if (!acc[categoryName]) {
          acc[categoryName] = {};
        }
        if (!acc[categoryName][typeName]) {
          acc[categoryName][typeName] = [];
        }

        // DisplayServiceItem 객체 생성 시 pricePerUnit 및 custom_price 매핑
        acc[categoryName][typeName].push({
          id: service.id,
          name: service.name,
          pricePerUnit: service.price_per_unit || 0, 
          custom_price: service.custom_price, // API로부터 받은 custom_price 전달
          quantity: `${service.min_order_quantity || 0} / ${service.max_order_quantity || 0}`,
          description: service.description || '설명이 없습니다.', 
        });
        return acc;
      }, {} as GroupedServices);
      setGroupedServices(grouped);
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(message);
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
      {/* 스페셜 목록 섹션 추가 */}
      {displaySpecials.length > 0 && (
        <div className="p-6 md:p-8 rounded-lg border border-blue-200 bg-blue-50 shadow-lg dark:border-blue-700 dark:bg-blue-900/30">
          <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 mr-2">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.116 3.587 1.558 5.291c.287 1.098-.935 1.956-1.944 1.418L12 18.202l-4.794 2.805c-1.01.538-2.23-.32-1.944-1.418l1.558-5.291L2.601 10.955c-.887-.76-.415-2.212.749-2.305l5.404-.434L10.788 3.21z" clipRule="evenodd" />
            </svg>
            스페셜 상품
          </h2>
          {displaySpecials.map((special) => (
            <div key={special.id} className="mb-8 last:mb-0">
              <div 
                className="flex items-center justify-between p-3 bg-blue-100 dark:bg-blue-800 rounded-t-lg cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                onClick={() => toggleSpecialCollapse(special.id)}
              >
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">{special.name}</h3>
                  {special.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{special.description}</p>}
                </div>
                {/* Chevron 아이콘 추가 필요 - heroicons/react/24/solid에서 가져오기 */} 
                {collapsedSpecials[special.id] ? (
                  <ChevronDownIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                ) : (
                  <ChevronUpIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                )}
              </div>
              {!collapsedSpecials[special.id] && special.services.length > 0 && (
                <div className="border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg p-1 sm:p-2 md:p-4 bg-white dark:bg-gray-800">
                  <ServiceTable services={special.services} onViewDetails={handleViewDetails} />
                </div>
              )}
              {!collapsedSpecials[special.id] && special.services.length === 0 && (
                 <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-3 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800">이 스페셜에 포함된 서비스가 준비중입니다.</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 카테고리 기반 서비스 목록 렌더링 수정 */}
      {categories.map((category) => {
        const categoryName = category.name;
        const typesByServiceType = groupedServices[categoryName];

        if (!typesByServiceType || Object.keys(typesByServiceType).length === 0) {
          return null;
        }

        // 현재 카테고리에 속한 서비스 타입들을 display_order 순서대로 가져옵니다.
        // API에서 이미 정렬해서 보내주므로, filter만으로도 순서가 보장됩니다.
        const sortedTypesForCategory = serviceTypes.filter(st => st.category_id === category.id);

        return (
          <div key={categoryName} className="p-6 md:p-8 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              {categoryName}
            </h2>
            {/* 정렬된 서비스 타입 목록을 기준으로 렌더링 */}
            {sortedTypesForCategory.map((serviceType) => {
              const typeName = serviceType.name;
              const services = typesByServiceType[typeName];

              if (!services || services.length === 0) {
                return null; // 해당 타입에 서비스가 없으면 렌더링하지 않음
              }

              return (
                <ServiceSection 
                  key={typeName} 
                  title={typeName} 
                  services={services} 
                  onViewDetails={handleViewDetails} 
                />
              );
            })}
          </div>
        );
      })}

      <ServiceDescriptionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        service={selectedService} 
      />
    </div>
  );
};

export default ServiceListDisplay; 
