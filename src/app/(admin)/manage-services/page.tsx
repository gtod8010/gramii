"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import Button from '@/components/ui/button/Button';
// Input, Label은 현재 직접적인 서비스 목록 표시에 사용되지 않으므로 주석 처리 또는 필요시 재활성화
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
import NewServiceModal from '@/components/services/NewServiceModal';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
// import CategoryModal from '@/components/services/CategoryModal'; // 스페셜 관리 모달로 변경 예정
import SpecialManagementModal from '@/components/services/SpecialManagementModal'; 
import ServiceDescriptionModal from '@/components/services/ServiceDescriptionModal'; // 상세 보기 모달 추가
import { ChevronUpIcon, ChevronDownIcon, TrashIcon } from '@heroicons/react/24/solid';

interface Category { // Category 인터페이스 추가
  id: number;
  name: string;
  description?: string | null;
}

interface Special {
  id: number;
  name: string;
  description?: string;
  service_ids?: number[]; // 스페셜에 연결된 서비스 ID 목록 (API 응답에 따라 추가)
}

interface Service { // RawService 역할도 겸할 수 있도록 created_at, special_id, special_name 추가
  id: number;
  name: string;
  service_type_id: number;
  description?: string | null;
  price_per_unit?: number | undefined;
  min_order_quantity?: number | undefined;
  max_order_quantity?: number | undefined;
  is_active: boolean;
  external_id?: string | null;
  service_type_name?: string;
  category_name?: string;
  created_at: string; // DB에서 가져올 때 문자열로 올 수 있음
  updated_at: string;
  special_id?: number | null;
  special_name?: string | null;
}

// ServiceListDisplay.tsx의 ServiceItem과 유사한 형태로 정의
interface DisplayServiceItem {
  id: string | number;
  name: string;
  price: string; // "가격 [단위당]" 형태
  quantity: string; // "최소 / 최대"
  description: React.ReactNode; // 원본 description 또는 가공된 형태
  originalService: Service; // 원본 서비스 데이터 (수정/삭제 시 필요)
}

interface GroupedServices {
  [categoryName: string]: {
    [serviceTypeName: string]: DisplayServiceItem[];
  };
}

const ManageServicesPage = () => {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]); // categories 상태 복원
  const [specials, setSpecials] = useState<Special[]>([]);
  const [allRawServices, setAllRawServices] = useState<Service[]>([]); // Service 타입으로 변경 (created_at 등 포함)

  const [groupedServices, setGroupedServices] = useState<GroupedServices>({});
  const [isLoading, setIsLoading] = useState(true); // 전체 로딩 상태
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [isSpecialManagementModalOpen, setIsSpecialManagementModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null); // Service 타입으로 변경

  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedServiceForDescription, setSelectedServiceForDescription] = useState<DisplayServiceItem | null>(null);

  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [collapsedServiceTypes, setCollapsedServiceTypes] = useState<Record<string, boolean>>({});
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 정렬 순서 상태 추가
  const [isSyncing, setIsSyncing] = useState(false); // 동기화 로딩 상태 추가

  const toggleSortOrder = () => { // 정렬 순서 변경 함수
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const toggleCategoryCollapse = (categoryName: string) => {
    setCollapsedCategories(prev => ({ ...prev, [categoryName]: !prev[categoryName] }));
  };

  const toggleServiceTypeCollapse = (categoryName: string, typeName: string) => {
    const key = `${categoryName}_${typeName}`;
    setCollapsedServiceTypes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleViewDescription = (service: DisplayServiceItem) => {
    setSelectedServiceForDescription(service);
    setIsDescriptionModalOpen(true);
  };
  const closeDescriptionModal = () => {
    setIsDescriptionModalOpen(false);
    setSelectedServiceForDescription(null);
  };

  const fetchAllServicesAndGroup = useCallback(async () => {
    setIsLoading(true); // 데이터 가져오기 시작 시 로딩 상태 true
    try {
      // API 호출 시 all=true 파라미터를 사용하여 모든 서비스 정보를 가져옵니다.
      // 이 때, special_id와 special_name도 함께 가져오도록 API가 수정되었다고 가정합니다.
      const response = await fetch('/api/services?all=true'); 
      if (!response.ok) {
        throw new Error('서비스 목록을 불러오는데 실패했습니다.');
      }
      const servicesData: Service[] = await response.json(); // API 응답이 Service[] 타입이라고 가정
      setAllRawServices(servicesData);
      
      const grouped: GroupedServices = servicesData.reduce((acc, service) => {
        const categoryName = service.category_name || '기타 카테고리';
        const typeName = service.service_type_name || '기타 타입';

        if (!acc[categoryName]) acc[categoryName] = {};
        if (!acc[categoryName][typeName]) acc[categoryName][typeName] = [];
        
        // DisplayServiceItem으로 변환
        acc[categoryName][typeName].push({
          id: service.id,
          name: service.name,
          price: `${service.price_per_unit || 0} 원`,
          quantity: `${service.min_order_quantity || 0} / ${service.max_order_quantity || 0}`,
          description: service.description || '',
          originalService: service, // 원본 데이터 저장
        });
        return acc;
      }, {} as GroupedServices);

      // 각 서비스 타입 내에서 정렬
      Object.keys(grouped).forEach(catName => {
        Object.keys(grouped[catName]).forEach(typeName => {
          grouped[catName][typeName].sort((a, b) => {
            // originalService.created_at을 사용하여 정렬
            const dateA = new Date(a.originalService.created_at).getTime();
            const dateB = new Date(b.originalService.created_at).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          });
        });
      });
      setGroupedServices(grouped);
    } catch (error) {
      console.error("Failed to fetch services and group:", error);
      setGroupedServices({}); // 에러 발생 시 빈 객체로 설정
    } finally {
      setIsLoading(false); // 데이터 가져오기 완료 시 로딩 상태 false
    }
  }, [sortOrder]); // sortOrder 변경 시 fetchAllServicesAndGroup 재실행

  const fetchCategories = useCallback(async () => { // fetchCategories 복원
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('카테고리 정보를 가져오는데 실패했습니다.');
      }
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]); // 에러 시 빈 배열
    }
  }, []);

  const fetchSpecials = useCallback(async () => {
    try {
      const response = await fetch('/api/specials');
      if (!response.ok) {
        throw new Error('스페셜 정보를 가져오는데 실패했습니다.');
      }
      const data: Special[] = await response.json();
      setSpecials(data);
    } catch (error) {
      console.error('Failed to fetch specials:', error);
      setSpecials([]); // 에러 시 빈 배열
    }
  }, []);

  useEffect(() => {
    if (!userLoading && user?.role === 'admin') {
      setIsLoading(true);
      Promise.all([
        fetchAllServicesAndGroup(), 
        fetchCategories(), // fetchCategories 호출
        fetchSpecials()
      ]).finally(() => setIsLoading(false));
    } else if (!userLoading && user?.role !== 'admin') {
      router.replace('/');
    }
  // fetchAllServicesAndGroup는 sortOrder 변경 시에도 호출되므로 useEffect 의존성 배열에서 제거 가능 (이미 useCallback에 포함)
  // 그러나 명시적으로 두어 user/role 변경 시 초기 로드를 위함이라면 유지
  }, [user, userLoading, router, fetchCategories, fetchSpecials, fetchAllServicesAndGroup]); 

  const handleNewService = () => { // 이름 변경: handleNewServiceClicked 등 -> handleNewService
    setEditingService(null);
    setIsNewServiceModalOpen(true);
  };

  const handleEditService = (service: Service) => { // 파라미터 타입을 DisplayServiceItem.originalService (즉, Service)로
    setEditingService(service);
    setIsNewServiceModalOpen(true); // NewServiceModal을 수정용으로도 사용
  };

  const handleOpenSpecialManagementModal = () => {
    setIsSpecialManagementModalOpen(true);
  };

  const handleServiceUpdated = () => { // 이름 변경: handleNewServiceAdded 또는 기존 handleServiceUpdated -> onServiceUpdated 또는 handleServiceUpdated
    // 서비스 목록, 카테고리, 스페셜 정보를 모두 다시 불러올 수 있지만,
    // 일단 서비스 목록만 새로고침하고, 필요에 따라 fetchCategories, fetchSpecials 추가
    fetchAllServicesAndGroup(); 
    fetchCategories(); // 카테고리 목록도 새로고침하도록 추가
    // fetchSpecials(); // 스페셜은 서비스 추가/수정 시 직접적인 영향 없으므로 선택적
  };

  const onSpecialManagementUpdated = () => {
    fetchSpecials();
    fetchAllServicesAndGroup(); // 스페셜 변경 시 서비스 목록도 업데이트 (special_name 등)
  };

  const handleSyncServices = async () => {
    if (!window.confirm('Realsite.shop의 서비스 목록과 동기화를 시작하시겠습니까? API 응답에 따라 시간이 소요될 수 있습니다.')) {
      return;
    }
    setIsSyncing(true);
    try {
      const response = await fetch('/api/realsite/sync-services', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '알 수 없는 오류가 발생했습니다.');
      }

      console.log('Realsite Services:', data);
      alert('서비스 목록을 성공적으로 불러왔습니다. 브라우저 개발자 도구(F12)의 콘솔에서 데이터를 확인하세요.');
      // 여기에 나중에 DB 동기화 로직을 추가합니다.
      
    } catch (error) {
      console.error('Failed to sync services from Realsite:', error);
      if (error instanceof Error) {
        alert(`동기화 실패: ${error.message}`);
      } else {
        alert('동기화 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteService = async (serviceId: number, serviceName: string) => {
    if (window.confirm(`'${serviceName}' 서비스를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      setIsLoading(true); // 로딩 상태 시작
      try {
        const response = await fetch(`/api/services/${serviceId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '서비스 삭제에 실패했습니다.');
        }
        // 성공 메시지 (예: toast 라이브러리 사용 또는 간단한 alert)
        alert('서비스가 성공적으로 삭제되었습니다.');
        fetchAllServicesAndGroup(); // 목록 새로고침
        // fetchCategories(); // 카테고리/타입에 영향이 없다면 생략 가능
      } catch (error) {
        console.error("Error deleting service:", error);
        if (error instanceof Error) {
          alert(`서비스 삭제 중 오류 발생: ${error.message}`);
        } else {
          alert(`서비스 삭제 중 알 수 없는 오류 발생`);
        }
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    }
  };

  const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
    if (window.confirm(`'${categoryName}' 카테고리를 정말로 삭제하시겠습니까? 이 카테고리에 속한 모든 서비스 타입과 서비스도 함께 삭제될 수 있으며, 이 작업은 되돌릴 수 없습니다.`)) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '카테고리 삭제에 실패했습니다.');
        }
        alert('카테고리가 성공적으로 삭제되었습니다.');
        fetchCategories(); // 카테고리 목록 새로고침
        fetchAllServicesAndGroup(); // 전체 서비스 목록 새로고침
      } catch (error) {
        console.error("Error deleting category:", error);
        if (error instanceof Error) {
          alert(`카테고리 삭제 중 오류 발생: ${error.message}`);
        } else {
          alert(`카테고리 삭제 중 알 수 없는 오류 발생`);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading || userLoading) { // 초기 전체 로딩 상태 확인
    return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
  }

  // 이하 JSX 부분은 크게 변경하지 않고, props 전달만 수정합니다.
  // NewServiceModal에 categories를 전달하고, specials는 일단 유지 (NewServiceModal 내부 수정 후 제거 가능)
  // 스페셜 이름 표시는 DisplayServiceItem의 special_name 사용
  // 서비스 수정 시 handleEditService에 originalService 전달

  return (
    <>
      <PageBreadCrumb pageTitle="서비스 관리" />

      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div> {/* 필요한 경우 제목 추가 */} </div>
          <div className="flex space-x-3">
            <Button onClick={handleNewService} variant="primary"> {/* 새 서비스 추가 버튼 */}
            + 새 서비스 추가
          </Button>
            <Button onClick={handleOpenSpecialManagementModal} variant="outline">
              스페셜 관리
            </Button>
            <Button onClick={handleSyncServices} variant="outline" disabled={isSyncing}>
              {isSyncing ? '동기화 진행 중...' : 'Realsite 서비스 동기화'}
            </Button>
          </div>
        </div>

        <div className="flex justify-end mb-4">
            <Button onClick={toggleSortOrder} variant="outline" size="sm">
              등록일시 정렬 {sortOrder === 'asc' ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : <ChevronDownIcon className="h-4 w-4 ml-1" />}
            </Button>
        </div>

        {isLoading && Object.keys(groupedServices).length === 0 && <p>서비스 목록을 불러오는 중...</p>}
        {!isLoading && Object.keys(groupedServices).length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">등록된 서비스가 없습니다.</p>
          )}

          {Object.entries(groupedServices).map(([categoryName, types]) => (
            <div key={categoryName} className="mb-8">
              <div 
              className="flex items-center justify-between text-lg font-semibold text-gray-800 dark:text-white mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
              <div onClick={() => toggleCategoryCollapse(categoryName)} className="flex-grow cursor-pointer">
                {categoryName}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  type="button"
                  onClick={() => { 
                    const categoryToDelete = categories.find(cat => cat.name === categoryName);
                    if (categoryToDelete) {
                      handleDeleteCategory(categoryToDelete.id, categoryToDelete.name);
                    } else {
                      alert('삭제할 카테고리 정보를 찾을 수 없습니다.');
                    }
                  }}
                  className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label="카테고리 삭제"
                >
                   <TrashIcon className="h-5 w-5" />
                </button>
                {collapsedCategories[categoryName] ? (
                  <ChevronDownIcon className="h-5 w-5 cursor-pointer" onClick={() => toggleCategoryCollapse(categoryName)} />
                ) : (
                  <ChevronUpIcon className="h-5 w-5 cursor-pointer" onClick={() => toggleCategoryCollapse(categoryName)} />
                )}
              </div>
            </div>
            {!collapsedCategories[categoryName] && Object.entries(types).map(([typeName, serviceItems]) => {
                const serviceTypeKey = `${categoryName}_${typeName}`;
                return (
                  <div key={serviceTypeKey} className="mb-6 pl-4">
                    <div 
                      className="flex items-center justify-between text-md font-medium text-gray-700 dark:text-gray-300 mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                      onClick={() => toggleServiceTypeCollapse(categoryName, typeName)}
                    >
                    {typeName}
                      {collapsedServiceTypes[serviceTypeKey] ? (
                        <ChevronDownIcon className="h-5 w-5" />
                      ) : (
                        <ChevronUpIcon className="h-5 w-5" />
                      )}
                    </div>
                    {!collapsedServiceTypes[serviceTypeKey] && (
                  <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">ID</th>
                              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">서비스명</th>
                              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">가격</th>
                              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">수량(최소/최대)</th>
                              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">설명</th>
                              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">관리</th>
                        </tr>
                      </thead>
                          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                      {serviceItems.map((item) => ( // DisplayServiceItem 사용
                            <tr key={item.id}>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.id}</td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.price}</td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.quantity}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                <Button variant="outline" size="sm" onClick={() => handleViewDescription(item)}>보기</Button>
                            </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditService(item.originalService)}>수정</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteService(Number(item.originalService.id), item.originalService.name)}>삭제</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                    )}
                </div>
                );
              })}
            </div>
          ))}
      </div>

      <NewServiceModal
        isOpen={isNewServiceModalOpen}
        onClose={() => {
            setIsNewServiceModalOpen(false); // closeNewServiceModal 함수 직접 호출 대신 상태 변경
            setEditingService(null); 
        }}
        onServiceAdded={handleServiceUpdated} // onServiceUpdated를 onServiceAdded로 변경
        categories={categories} // categories prop 전달
        editingService={editingService} // serviceToEdit을 editingService로 변경
        // specials={specials} // NewServiceModal이 카테고리만 사용하도록 완전히 수정되면 이 줄은 삭제합니다.
      />

      <SpecialManagementModal
        isOpen={isSpecialManagementModalOpen}
        onClose={() => setIsSpecialManagementModalOpen(false)} // closeSpecialManagementModal 함수 직접 호출 대신 상태 변경
        onSpecialManagementUpdated={onSpecialManagementUpdated}
        allServices={allRawServices} 
        existingSpecials={specials} 
      />

      {selectedServiceForDescription && (
        <ServiceDescriptionModal 
          isOpen={isDescriptionModalOpen} 
          onClose={closeDescriptionModal} 
          service={selectedServiceForDescription} 
        />
      )}
    </>
  );
};

export default ManageServicesPage; 
