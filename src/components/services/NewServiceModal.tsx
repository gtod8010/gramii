'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';

// Category 인터페이스 (manage-services/page.tsx와 동일하게 정의 또는 임포트)
interface Category {
  id: number;
  name: string;
  description?: string | null;
}

// Service 인터페이스 (manage-services/page.tsx 에서 가져오거나 여기서도 정의)
interface Service {
  id: number;
  name: string;
  service_type_id: number;
  category_id?: number; 
  description?: string | null;
  price_per_unit?: number | undefined;
  min_order_quantity?: number | undefined;
  max_order_quantity?: number | undefined;
  is_active: boolean;
  service_type_name?: string; 
  category_name?: string; 
  created_at?: string; // 추가 (정렬 및 표시에 사용될 수 있음)
  updated_at?: string; // 추가
  special_id?: number | null; // 스페셜 기능 관련 필드는 유지 (다른 모달에서 사용)
  special_name?: string | null; // 스페셜 기능 관련 필드는 유지
}

interface ServiceType { // 서비스 타입 인터페이스 정의
  id: number;
  name: string;
  category_id: number;
}


interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceAdded?: () => void; 
  categories: Category[]; // specials를 categories로 변경
  editingService?: Service | null; 
}

const ADD_NEW_VALUE = 'addNew';

const NewServiceModal: React.FC<NewServiceModalProps> = ({
  isOpen,
  onClose,
  onServiceAdded,
  categories, // specials를 categories로 변경
  editingService,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(''); // selectedSpecialId를 selectedCategoryId로 변경
  const [newCategoryName, setNewCategoryName] = useState(''); // newSpecialName을 newCategoryName으로 변경
  
  const [serviceTypesForCategory, setServiceTypesForCategory] = useState<ServiceType[]>([]); // serviceTypesForSpecial을 serviceTypesForCategory로, 타입 명시
  const [isLoadingServiceTypes, setIsLoadingServiceTypes] = useState(false);
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState<string>('');
  const [newServiceTypeName, setNewServiceTypeName] = useState('');

  const [serviceName, setServiceName] = useState('');
  const [minOrderQuantity, setMinOrderQuantity] = useState('');
  const [maxOrderQuantity, setMaxOrderQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [description, setDescription] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isEditMode = !!editingService;

  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 모든 상태 초기화
      setSelectedCategoryId('');
      setNewCategoryName('');
      setServiceTypesForCategory([]);
      setSelectedServiceTypeId('');
      setNewServiceTypeName('');
      setServiceName('');
      setMinOrderQuantity('');
      setMaxOrderQuantity('');
      setPricePerUnit('');
      setDescription('');
      setError(null);
      setSuccessMessage(null);
      setIsLoading(false);
    } else if (editingService) {
      // 수정 모드일 때 폼 데이터 채우기
      // 1. 카테고리 설정
      const initialCategoryId = categories.find(c => c.name === editingService.category_name)?.id;
      if (initialCategoryId) {
        setSelectedCategoryId(String(initialCategoryId));
      } else {
        // 수정 대상 서비스의 카테고리가 기존 카테고리 목록에 없을 경우,
        // 혹은 category_name이 없을 경우 처리 (여기서는 선택 없음으로 둠)
        setSelectedCategoryId('');
      }
      setNewCategoryName(''); // 수정 모드에서는 새 카테고리명 입력 필드는 비움

      // 2. 서비스 타입 설정 (카테고리가 설정된 후 useEffect에서 serviceTypesForCategory가 로드되면 실행)
      // 이 부분은 selectedCategoryId 변경에 따른 useEffect에서 처리되도록 유도
      
      // 3. 나머지 필드
      setServiceName(editingService.name || '');
      setMinOrderQuantity(String(editingService.min_order_quantity || ''));
      setMaxOrderQuantity(String(editingService.max_order_quantity || ''));
      setPricePerUnit(String(editingService.price_per_unit || ''));
      setDescription(editingService.description || '');
      setError(null);
      setSuccessMessage(null);
    } else {
      // 추가 모드일 때 (기존 초기화 로직과 동일하게 비움)
      setSelectedCategoryId(''); 
      setNewCategoryName('');
      setServiceTypesForCategory([]);
      setSelectedServiceTypeId('');
      setNewServiceTypeName('');
      setServiceName('');
      setMinOrderQuantity('');
      setMaxOrderQuantity('');
      setPricePerUnit('');
      setDescription('');
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, editingService, categories]); // 의존성 배열에 categories 추가

  // 카테고리 변경 시 서비스 타입 목록 로드
  // + 수정 모드에서 서비스 타입 초기 설정 추가
  useEffect(() => {
    const fetchServiceTypes = async () => {
      if (selectedCategoryId && selectedCategoryId !== ADD_NEW_VALUE) {
        setIsLoadingServiceTypes(true);
        setServiceTypesForCategory([]); 
        setSelectedServiceTypeId(''); 
        setNewServiceTypeName(''); 
        try {
          const response = await fetch(`/api/service-types?categoryId=${selectedCategoryId}`); // API 엔드포인트 수정
          if (response.ok) {
            const data: ServiceType[] = await response.json(); // 타입 명시
            setServiceTypesForCategory(data);
            // 수정 모드이고, serviceTypesForCategory가 로드되었으며, editingService.service_type_name이 있을 때
            if (isEditMode && editingService?.service_type_name) {
              const initialServiceTypeId = data.find((st: ServiceType) => st.name === editingService.service_type_name)?.id;
              if (initialServiceTypeId) {
                setSelectedServiceTypeId(String(initialServiceTypeId));
              } else {
                 setSelectedServiceTypeId(''); // 해당 타입이 없으면 비움 (새로 입력 유도 가능)
              }
            }
          } else {
            console.error('Failed to fetch service types');
            setServiceTypesForCategory([]);
          }
        } catch (error) {
          console.error('Error fetching service types:', error);
          setServiceTypesForCategory([]);
        } finally {
          setIsLoadingServiceTypes(false);
        }
      } else {
        setServiceTypesForCategory([]); 
        setSelectedServiceTypeId('');
        setNewServiceTypeName('');
      }
    };

    if (isOpen) { 
        fetchServiceTypes();
    }
  }, [selectedCategoryId, isOpen, isEditMode, editingService]); // categories는 외부 prop이므로 변경 시 리렌더링 유발, fetchServiceTypes 재호출은 selectedCategoryId에 의존


  const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자 또는 소수점만 허용 (가격 등에 사용)
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    } else if (value === '') { // 비우는 것 허용
      setter('');
    }
  };
  
  const handleIntegerInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 허용 (수량 등에 사용)
    if (/^\d*$/.test(value)) {
      setter(value);
    } else if (value === '') { // 비우는 것 허용
      setter('');
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // 필수 필드 검사
    if (selectedCategoryId !== ADD_NEW_VALUE && !selectedCategoryId) {
      setError('카테고리를 선택해주세요.');
      setIsLoading(false);
      return;
    }
    if (selectedCategoryId === ADD_NEW_VALUE && !newCategoryName.trim()) {
      setError('새 카테고리 이름을 입력해주세요.');
      setIsLoading(false);
      return;
    }
    if (selectedServiceTypeId !== ADD_NEW_VALUE && !selectedServiceTypeId) {
        setError('서비스 타입을 선택해주세요.');
        setIsLoading(false);
        return;
    }
    if (selectedServiceTypeId === ADD_NEW_VALUE && !newServiceTypeName.trim()) {
        setError('새 서비스 타입 이름을 입력해주세요.');
        setIsLoading(false);
        return;
    }
    if (!serviceName.trim()) {
      setError('세부 서비스명을 입력해주세요.');
      setIsLoading(false);
      return;
    }
    if (!minOrderQuantity.trim() || !/^[1-9]\d*$/.test(minOrderQuantity)) { // 0보다 큰 정수
      setError('최소 주문 수량은 1 이상 입력해주세요.');
      setIsLoading(false);
      return;
    }
    if (!maxOrderQuantity.trim() || !/^[1-9]\d*$/.test(maxOrderQuantity)) { // 0보다 큰 정수
      setError('최대 주문 수량은 1 이상 입력해주세요.');
      setIsLoading(false);
      return;
    }
    if (parseInt(minOrderQuantity) > parseInt(maxOrderQuantity)) {
        setError('최대 주문 수량은 최소 주문 수량보다 크거나 같아야 합니다.');
        setIsLoading(false);
        return;
    }
    if (!pricePerUnit.trim() || !/^\d*\.?\d+$/.test(pricePerUnit) || parseFloat(pricePerUnit) <=0) { // 0보다 큰 숫자
      setError('1개당 주문 가격을 정확히 입력해주세요 (0보다 커야 함).');
      setIsLoading(false);
      return;
    }


    let categoryIdToUse = selectedCategoryId === ADD_NEW_VALUE ? null : parseInt(selectedCategoryId);
    let serviceTypeIdToUse = selectedServiceTypeId === ADD_NEW_VALUE ? null : parseInt(selectedServiceTypeId);

    const serviceData: any = {
      service_name: serviceName.trim(),
      description: description.trim(),
      min_order_quantity: parseInt(minOrderQuantity),
      max_order_quantity: parseInt(maxOrderQuantity),
      price_per_unit: parseFloat(pricePerUnit),
      is_active: true, // 기본값 활성
      
      category_id: categoryIdToUse,
      new_category_name: selectedCategoryId === ADD_NEW_VALUE ? newCategoryName.trim() : undefined,
      
      service_type_id: serviceTypeIdToUse,
      new_service_type_name: selectedServiceTypeId === ADD_NEW_VALUE ? newServiceTypeName.trim() : undefined,
    };

    // 수정 모드일 경우 ID 추가
    if (isEditMode && editingService) {
      serviceData.id = editingService.id;
    }
    
    console.log('Submitting service data:', serviceData);

    try {
      const response = await fetch('/api/services', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (isEditMode ? '서비스 수정에 실패했습니다.' : '서비스 추가에 실패했습니다.'));
      }

      const result = await response.json();
      setSuccessMessage(isEditMode ? '서비스가 성공적으로 수정되었습니다.' : '서비스가 성공적으로 추가되었습니다.');
      
      if (onServiceAdded) {
        onServiceAdded();
      }
      
      // 성공 후 1.5초 뒤 모달 닫기 (메시지 확인 시간)
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Modal title={isEditMode ? "서비스 수정" : "새 서비스 추가"} isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-5">
        {error && <p className="text-red-500 text-sm bg-red-100 p-3 rounded-md">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm bg-green-100 p-3 rounded-md">{successMessage}</p>}
          
        {/* 카테고리 선택 또는 새로 입력 */}
          <div>
          <Label htmlFor="category">카테고리</Label>
          <div className="flex items-center space-x-2">
            <select
              id="category"
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                if (e.target.value !== ADD_NEW_VALUE) setNewCategoryName('');
                setSelectedServiceTypeId(''); // 카테고리 변경 시 서비스 타입 선택 초기화
                setNewServiceTypeName('');
                setServiceTypesForCategory([]); // 카테고리 변경 시 서비스 타입 목록 초기화
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              disabled={isLoading}
            >
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              <option value={ADD_NEW_VALUE}>+ 새 카테고리 추가</option>
            </select>
          </div>
          {selectedCategoryId === ADD_NEW_VALUE && (
            <div className="mt-2">
              <Input
                type="text"
                placeholder="새 카테고리 이름"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
          )}
        </div>
          
        {/* 서비스 타입 선택 또는 새로 입력 */}
        {((selectedCategoryId && selectedCategoryId !== ADD_NEW_VALUE) || 
          (selectedCategoryId === ADD_NEW_VALUE && newCategoryName.trim() !== '')) && (
          <div>
            <Label htmlFor="serviceType">서비스 타입</Label>
            <div className="flex items-center space-x-2">
              <select
                id="serviceType"
                value={selectedServiceTypeId}
                onChange={(e) => {
                  setSelectedServiceTypeId(e.target.value);
                  if (e.target.value !== ADD_NEW_VALUE) setNewServiceTypeName('');
                }}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                disabled={isLoadingServiceTypes || isLoading}
              >
                <option value="">서비스 타입 선택</option>
                {isLoadingServiceTypes && <option value="" disabled>타입 불러오는 중...</option>}
                {!isLoadingServiceTypes && serviceTypesForCategory.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
                 {!isLoadingServiceTypes && <option value={ADD_NEW_VALUE}>+ 새 서비스 타입 추가</option>}
              </select>
            </div>
            {selectedServiceTypeId === ADD_NEW_VALUE && (
            <div className="mt-2">
              <Input
                type="text"
                  placeholder="새 서비스 타입 이름"
                value={newServiceTypeName}
                onChange={(e) => setNewServiceTypeName(e.target.value)}
                  className="w-full"
                disabled={isLoading}
              />
            </div>
          )}
          </div>
        )}

        {/* 세부 서비스 정보 입력 */}
                <div>
          <Label htmlFor="serviceName">세부 서비스명</Label>
                    <Input
            id="serviceName"
                    type="text"
            placeholder="예: 일반세탁 (셔츠/블라우스)"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    disabled={isLoading}
            className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
              <Label htmlFor="pricePerUnit">1개당 주문 가격 (원)</Label>
                        <Input
                id="pricePerUnit"
                        type="text"
                placeholder="예: 3000"
                value={pricePerUnit}
                onChange={handleNumericInputChange(setPricePerUnit)}
                disabled={isLoading}
                className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minOrderQuantity">최소 주문 수량</Label>
            <Input
                        id="minOrderQuantity"
              type="text" 
              placeholder="예: 1"
                        value={minOrderQuantity}
              onChange={handleIntegerInputChange(setMinOrderQuantity)}
                        disabled={isLoading}
              className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
            <Label htmlFor="maxOrderQuantity">최대 주문 수량</Label>
                        <Input
              id="maxOrderQuantity"
                        type="text"
              placeholder="예: 10"
                        value={maxOrderQuantity}
              onChange={handleIntegerInputChange(setMaxOrderQuantity)}
                        disabled={isLoading}
              className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                <div>
          <Label htmlFor="description">서비스 설명 (선택 사항)</Label>
                    <textarea
                    id="description"
                    rows={4}
            placeholder="서비스에 대한 상세 설명을 입력하세요."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    disabled={isLoading}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">{description.length} / 500</p>
          </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              취소
            </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
            {isEditMode ? '서비스 수정' : '서비스 추가'}
            </Button>
          </div>
        </form>
    </Modal>
  );
};

export default NewServiceModal; 
