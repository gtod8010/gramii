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
import CategoryManagementModal from '@/components/services/CategoryManagementModal';
import ServiceTypeManagementModal from '@/components/services/ServiceTypeManagementModal';
import { ChevronUpIcon, ChevronDownIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

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

interface Service { // display_order 추가
  id: number;
  name: string;
  service_type_id: number;
  category_id: number;
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
  display_order: number;
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

  // 모달 상태 추가
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isServiceTypeModalOpen, setIsServiceTypeModalOpen] = useState(false);

  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [collapsedServiceTypes, setCollapsedServiceTypes] = useState<Record<string, boolean>>({});
  const [isSyncing, setIsSyncing] = useState(false);

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

  const handleSwapOrder = async (categoryName: string, typeName: string, index1: number, index2: number) => {
    const serviceList = groupedServices[categoryName]?.[typeName];
    if (!serviceList || index1 < 0 || index2 >= serviceList.length) return;

    const service1 = serviceList[index1].originalService;
    const service2 = serviceList[index2].originalService;

    const newGroupedServices = JSON.parse(JSON.stringify(groupedServices));
    const listToUpdate = newGroupedServices[categoryName][typeName];
    const temp = listToUpdate[index1];
    listToUpdate[index1] = listToUpdate[index2];
    listToUpdate[index2] = temp;
    setGroupedServices(newGroupedServices);

    try {
      const response = await fetch('/api/services/swap-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service1, service2 }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '순서 변경 중 오류 발생');
      }
      toast.success('순서가 변경되었습니다.');
      // 성공 시에는 UI가 이미 업데이트 되었으므로 다시 fetch할 필요 없음
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      // 실패 시에만 원래 데이터로 롤백 (다시 fetch)
      fetchAllServicesAndGroup();
    }
  };

  const fetchAllServicesAndGroup = useCallback(async () => {
    setIsLoading(true);
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

      // 각 서비스 타입 내에서 display_order를 기준으로 정렬
      Object.keys(grouped).forEach(catName => {
        Object.keys(grouped[catName]).forEach(typeName => {
          grouped[catName][typeName].sort((a, b) => a.originalService.display_order - b.originalService.display_order);
        });
      });
      setGroupedServices(grouped);
    } catch (error) {
      console.error("Failed to fetch services and group:", error);
      setGroupedServices({});
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  }, [user, userLoading, router, fetchCategories, fetchSpecials, fetchAllServicesAndGroup]); 

  const handleOpenCategoryModal = () => setIsCategoryModalOpen(true);
  const handleOpenServiceTypeModal = () => setIsServiceTypeModalOpen(true);

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

  const onCategoryManagementUpdated = () => {
    fetchAllServicesAndGroup();
    fetchCategories();
  }

  const onServiceTypeManagementUpdated = () => {
    fetchAllServicesAndGroup();
    fetchCategories();
  }

  const onSpecialManagementUpdated = () => {
    fetchSpecials();
    fetchAllServicesAndGroup(); // 스페셜 변경 시 서비스 목록도 업데이트 (special_name 등)
  };

  // 서비스 활성/비활성 상태 토글 핸들러
  const handleToggleServiceStatus = async (service: Service) => {
    const newStatus = !service.is_active;
    const toastId = toast.loading(`${service.name} 서비스의 상태를 ${newStatus ? '활성' : '비활성'}으로 변경 중...`);

    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '상태 변경에 실패했습니다.');
      }

      toast.success('서비스 상태가 성공적으로 변경되었습니다.', { id: toastId });
      
      // 상태 변경 성공 시, 전체 목록을 다시 불러오는 대신
      // 로컬 상태(allRawServices)를 직접 업데이트하여 더 빠른 UX를 제공
      setAllRawServices(prevServices => 
        prevServices.map(s => s.id === service.id ? { ...s, is_active: newStatus } : s)
      );
      // 변경된 로컬 상태를 기반으로 그룹 다시 생성
      fetchAllServicesAndGroup();

    } catch (error) {
      console.error('Failed to toggle service status:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      toast.error(errorMessage, { id: toastId });
    }
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

      // API 응답에서 받은 상세 정보로 알림 메시지를 개선합니다.
      const alertMessage = `${data.message}\n\n- API에서 받은 총 서비스 수: ${data.total_services_from_api}\n- DB에 처리된 서비스 수: ${data.processed_services}`;
      alert(alertMessage);
      
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
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">서비스 관리</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handleOpenCategoryModal}>카테고리 관리</Button>
          <Button variant="outline" onClick={handleOpenServiceTypeModal}>서비스 타입 관리</Button>
          <Button onClick={handleNewService}>+ 새 서비스 추가</Button>
          <Button variant="outline" onClick={handleOpenSpecialManagementModal}>스페셜 관리</Button>
          <Button variant="outline" isLoading={isSyncing} onClick={handleSyncServices}>Realsite 서비스 동기화</Button>
        </div>
      </div>

      <div className="mt-6">
        {isLoading && Object.keys(groupedServices).length === 0 && <p>서비스 목록을 불러오는 중...</p>}
        {!isLoading && Object.keys(groupedServices).length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">등록된 서비스가 없습니다.</p>
        )}

        {categories.map((category) => {
          const categoryName = category.name;
          const types = groupedServices[categoryName];
          
          // 해당 카테고리에 서비스가 없으면 렌더링하지 않음
          if (!types || Object.keys(types).length === 0) {
            return null;
          }

          return (
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
                      <table className="w-full">
                        <thead className="hidden lg:table-header-group bg-slate-100 dark:bg-slate-800">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">서비스명</th>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">외부 코드</th>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">가격</th>
                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">주문(최소/최대)</th>
                            <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">상태</th>
                            <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">작업</th>
                          </tr>
                        </thead>
                        <tbody className="block lg:table-row-group">
                          {serviceItems.map((item, serviceIndex) => (
                            <tr key={item.id} className="block lg:table-row mb-4 lg:mb-0 border lg:border-0 rounded-lg lg:rounded-none border-slate-200 dark:border-slate-700 lg:border-b lg:hover:bg-slate-50 dark:lg:hover:bg-slate-800">
                              
                              <td className="p-3 lg:px-5 lg:py-4 text-sm text-slate-800 dark:text-slate-200 lg:whitespace-nowrap flex justify-between items-center lg:table-cell">
                                <span className="font-semibold text-xs uppercase text-slate-500 lg:hidden">서비스명</span>
                                <div className="text-right lg:text-left">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-slate-500">{item.originalService.special_name || ''}</div>
                                </div>
                              </td>

                              <td className="p-3 lg:px-5 lg:py-4 text-sm text-slate-500 lg:whitespace-nowrap flex justify-between items-center lg:table-cell border-t lg:border-t-0 border-slate-200 dark:border-slate-700">
                                <span className="font-semibold text-xs uppercase text-slate-500 lg:hidden">외부 코드</span>
                                <span>{item.originalService.external_id || '-'}</span>
                              </td>
                              
                              <td className="p-3 lg:px-5 lg:py-4 text-sm text-slate-500 lg:whitespace-nowrap flex justify-between items-center lg:table-cell border-t lg:border-t-0 border-slate-200 dark:border-slate-700">
                                <span className="font-semibold text-xs uppercase text-slate-500 lg:hidden">가격</span>
                                <span>{item.price}</span>
                              </td>
                              
                              <td className="p-3 lg:px-5 lg:py-4 text-sm text-slate-500 lg:whitespace-nowrap flex justify-between items-center lg:table-cell border-t lg:border-t-0 border-slate-200 dark:border-slate-700">
                                <span className="font-semibold text-xs uppercase text-slate-500 lg:hidden">주문(최소/최대)</span>
                                <span>{item.quantity}</span>
                              </td>

                              <td className="p-3 lg:px-5 lg:py-4 text-sm lg:whitespace-nowrap flex justify-between items-center lg:table-cell lg:text-center border-t lg:border-t-0 border-slate-200 dark:border-slate-700">
                                <span className="font-semibold text-xs uppercase text-slate-500 lg:hidden">상태</span>
                                <span 
                                  onClick={() => handleToggleServiceStatus(item.originalService)}
                                  className={`cursor-pointer inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${
                                    item.originalService.is_active 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                  }`}>
                                  {item.originalService.is_active ? '활성' : '비활성'}
                                </span>
                              </td>
                              <td className="p-3 lg:px-5 lg:py-4 text-sm font-medium lg:whitespace-nowrap flex justify-between items-center lg:table-cell lg:text-center border-t lg:border-t-0 border-slate-200 dark:border-slate-700">
                                <span className="font-semibold text-xs uppercase text-slate-500 lg:hidden">작업</span>
                                <div className="flex flex-wrap items-center justify-end lg:justify-center gap-1">
                                  <Button variant="outline" size="sm" onClick={() => handleSwapOrder(categoryName, typeName, serviceIndex, serviceIndex - 1)} disabled={serviceIndex === 0}>
                                    <ArrowUpIcon className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleSwapOrder(categoryName, typeName, serviceIndex, serviceIndex + 1)} disabled={serviceItems.length - 1 === serviceIndex}>
                                    <ArrowDownIcon className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleViewDescription(item)}>보기</Button>
                                  <Button variant="outline" size="sm" onClick={() => handleEditService(item.originalService)}>수정</Button>
                                  <Button variant="danger" size="sm" onClick={() => handleDeleteService(Number(item.originalService.id), item.originalService.name)}>삭제</Button>
                                </div>
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
          );
        })}
      </div>

      <NewServiceModal
        isOpen={isNewServiceModalOpen}
        onClose={() => {
            setIsNewServiceModalOpen(false); 
            setEditingService(null); 
        }}
        onServiceUpdated={handleServiceUpdated} // onServiceAdded를 onServiceUpdated로 변경
        categories={categories} 
        editingService={editingService} 
      />

      <SpecialManagementModal
        isOpen={isSpecialManagementModalOpen}
        onClose={() => setIsSpecialManagementModalOpen(false)} // closeSpecialManagementModal 함수 직접 호출 대신 상태 변경
        onSpecialManagementUpdated={onSpecialManagementUpdated}
        allServices={allRawServices} 
        existingSpecials={specials} 
      />

      <CategoryManagementModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        onCategoryUpdated={onCategoryManagementUpdated}
      />

      <ServiceTypeManagementModal 
        isOpen={isServiceTypeModalOpen} 
        onClose={() => setIsServiceTypeModalOpen(false)} 
        categories={categories}
        onServiceTypeUpdated={onServiceTypeManagementUpdated}
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
