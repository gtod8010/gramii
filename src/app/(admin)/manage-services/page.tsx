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
import CategoryModal from '@/components/services/CategoryModal';
import ServiceDescriptionModal from '@/components/services/ServiceDescriptionModal'; // 상세 보기 모달 추가

interface Category {
  id: number;
  name: string;
  description?: string;
}

// ServiceType 인터페이스는 현재 페이지에서 직접 사용되지 않으므로 주석 처리 또는 필요시 정의
// interface ServiceType {
//   id: number;
//   name: string;
//   category_id: number;
//   category_name?: string; 
// }

interface Service {
  id: number;
  name: string;
  service_type_id: number;
  description?: string | null;
  price_per_unit?: number | undefined;
  min_order_quantity?: number | undefined;
  max_order_quantity?: number | undefined;
  is_active: boolean;
  external_id?: string | null;
  service_type_name?: string; // JOIN으로 가져올 타입 이름
  category_name?: string; // JOIN으로 가져올 카테고리 이름
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

  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const openNewServiceModal = () => setIsNewServiceModalOpen(true);
  const closeNewServiceModal = () => setIsNewServiceModalOpen(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null); // 카테고리 에러 상태명 변경

  const [groupedServices, setGroupedServices] = useState<GroupedServices>({});
  const [isLoadingAllServices, setIsLoadingAllServices] = useState(true);
  const [errorAllServices, setErrorAllServices] = useState<string | null>(null);

  // --- 수정 모달 관련 상태 ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null); // Service 타입 (원본)

  // --- 상세 설명 모달 관련 --- 
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedServiceForDescription, setSelectedServiceForDescription] = useState<DisplayServiceItem | null>(null);

  const handleViewDescription = (service: DisplayServiceItem) => {
    setSelectedServiceForDescription(service);
    setIsDescriptionModalOpen(true);
  };
  const closeDescriptionModal = () => {
    setIsDescriptionModalOpen(false);
    setSelectedServiceForDescription(null);
  };
  // --- 상세 설명 모달 끝 ---

  const fetchAllServicesAndGroup = useCallback(async () => {
    setIsLoadingAllServices(true);
    setErrorAllServices(null);
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '전체 서비스 목록을 불러오는데 실패했습니다.');
      }
      const services: Service[] = await response.json();
      
      const grouped: GroupedServices = services.reduce((acc, service) => {
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
          description: service.description || '', // 상세 보기 모달에 전달할 내용
          originalService: service, 
        });
        return acc;
      }, {} as GroupedServices);
      setGroupedServices(grouped);
    } catch (err: any) {
      setErrorAllServices(err.message);
      setGroupedServices({});
    } finally {
      setIsLoadingAllServices(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    setErrorCategories(null);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '카테고리 목록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setErrorCategories(err.message);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    if (!userLoading && user?.role === 'admin') {
        fetchCategories();
        fetchAllServicesAndGroup();
    } else if (!userLoading && user?.role !== 'admin') {
      router.replace('/');
    }
  }, [user, userLoading, router, fetchCategories, fetchAllServicesAndGroup]);


  const handleNewServiceAdded = () => {
    closeNewServiceModal();
    fetchAllServicesAndGroup(); // 새 서비스 추가 후 목록 새로고침
  };
  
  // --- 수정 관련 핸들러 ---
  const openEditModal = (service: Service) => {
    console.log("Editing service:", service); // 실제로는 모달에 데이터 채우기
    setEditingService(service);
    // setIsEditModalOpen(true); // 수정 모달을 열도록 변경 (모달 구현 후)
    // NewServiceModal을 수정용으로 재활용하거나, 별도의 EditServiceModal을 만들 수 있습니다.
    // 지금은 NewServiceModal을 열고, editingService props를 전달하는 방식으로 가정해봅니다.
    setIsNewServiceModalOpen(true); // 새 서비스 모달을 수정용으로도 사용 (데이터 채우는 로직 추가 필요)
  };

  const handleServiceUpdated = () => {
    setIsEditModalOpen(false);
    setEditingService(null);
    fetchAllServicesAndGroup(); // 목록 새로고침
  };

  // --- 삭제 관련 핸들러 ---
  const handleDeleteService = async (serviceId: number) => {
    if (window.confirm(`서비스 ID ${serviceId}번 항목을 정말 삭제하시겠습니까? 연결된 주문이 있는 경우 실패할 수 있습니다.`)) {
      try {
        const response = await fetch(`/api/services/${serviceId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || '서비스 삭제에 실패했습니다.');
        }
        alert(result.message || '서비스가 성공적으로 삭제되었습니다.');
        fetchAllServicesAndGroup(); // 목록 새로고침
      } catch (err: any) {
        console.error('Error deleting service:', err);
        alert(`오류: ${err.message}`);
      }
    }
  };

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const openCategoryModal = () => setIsCategoryModalOpen(true);
  const closeCategoryModal = () => setIsCategoryModalOpen(false);

  const handleCategoryAdded = () => {
    fetchCategories(); 
    fetchAllServicesAndGroup(); // 카테고리 변경 시 서비스 목록도 갱신 (선택적)
    closeCategoryModal();
  };

  if (userLoading || !user || user.role !== 'admin') {
    return <div className="flex items-center justify-center h-screen"><p>Loading or unauthorized...</p></div>;
  }

  return (
    <>
      <PageBreadCrumb pageTitle="서비스 관리" />

      <div className="space-y-6">
        <div className="flex justify-end space-x-3">
          <Button onClick={openCategoryModal} variant="outline">
            카테고리 관리
          </Button>
          <Button onClick={openNewServiceModal} variant="primary">
            + 새 서비스 추가
          </Button>
        </div>

        {/* 등록된 서비스 목록 표시 */} 
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            등록된 서비스 목록
          </h2>
          {isLoadingAllServices && <p>서비스 목록을 불러오는 중...</p>}
          {errorAllServices && <p className="text-red-500">오류: {errorAllServices}</p>}
          {!isLoadingAllServices && Object.keys(groupedServices).length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">등록된 서비스가 없습니다.</p>
          )}

          {Object.entries(groupedServices).map(([categoryName, types]) => (
            <div key={categoryName} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                {categoryName}
              </h3>
              {Object.entries(types).map(([typeName, services]) => (
                <div key={typeName} className="mb-6 pl-4">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {typeName}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-600">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-200">ID</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-200">서비스명</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-200">가격</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-200">수량(최소/최대)</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-600 dark:text-gray-200">설명</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-600 dark:text-gray-200">관리</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {services.map((service) => (
                          <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{service.id}</td>
                            <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{service.name}</td>
                            <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{service.price}</td>
                            <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{service.quantity}</td>
                            <td className="px-3 py-2 text-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewDescription(service)}
                              >
                                보기
                              </Button>
                            </td>
                            <td className="px-3 py-2 text-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => openEditModal(service.originalService)}>수정</Button>
                              <Button variant="danger" size="sm" onClick={() => handleDeleteService(service.originalService.id)}>삭제</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <NewServiceModal
        isOpen={isNewServiceModalOpen}
        onClose={() => {
            closeNewServiceModal();
            setEditingService(null); // 수정 중이었다면 상태 초기화
        }}
        onServiceAdded={handleNewServiceAdded}
        categories={categories}
        editingService={editingService}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        onCategoryAdded={handleCategoryAdded}
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
