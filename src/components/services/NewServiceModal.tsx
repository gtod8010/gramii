'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';

// Category 타입을 가져오거나 여기서 간단히 정의
interface Category {
  id: number;
  name: string;
}

// Service 인터페이스 (manage-services/page.tsx 에서 가져오거나 여기서도 정의)
interface Service {
  id: number;
  name: string;
  service_type_id: number;
  category_id?: number; // API 응답에는 category_id가 없을 수 있으므로 optional. JOIN된 category_name으로 유추.
  description?: string | null;
  price_per_unit?: number | undefined;
  min_order_quantity?: number | undefined;
  max_order_quantity?: number | undefined;
  is_active: boolean;
  service_type_name?: string; 
  category_name?: string; 
}

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceAdded?: () => void; // 서비스 추가/수정 완료 시 호출될 콜백
  categories: Category[]; 
  editingService?: Service | null; // 수정할 서비스 데이터
}

const ADD_NEW_VALUE = 'addNew';

const NewServiceModal: React.FC<NewServiceModalProps> = ({
  isOpen,
  onClose,
  onServiceAdded,
  categories,
  editingService, // editingService prop 추가
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [serviceTypesForCategory, setServiceTypesForCategory] = useState<any[]>([]); // TODO: 타입 정의
  const [isLoadingServiceTypes, setIsLoadingServiceTypes] = useState(false);
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState<string>('');
  const [newServiceTypeName, setNewServiceTypeName] = useState('');

  const [typeName, setTypeName] = useState(''); // 이 상태는 newServiceTypeName으로 대체되거나 역할 재정의 필요
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
        setSelectedCategoryId(''); // 해당하는 기존 카테고리가 없으면 비워둠 (또는 직접 입력 처리?)
      }
      setNewCategoryName(''); // 수정 시 새 카테고리 이름은 일단 비움

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
      // 추가 모드일 때 (기존 초기화 로직)
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
  }, [isOpen, editingService, categories]);

  // 카테고리 변경 시 서비스 타입 목록 로드 (기존 로직 유지)
  // + 수정 모드에서 서비스 타입 초기 설정 추가
  useEffect(() => {
    const fetchServiceTypes = async () => {
      if (selectedCategoryId && selectedCategoryId !== ADD_NEW_VALUE) {
        setIsLoadingServiceTypes(true);
        setServiceTypesForCategory([]); 
        setSelectedServiceTypeId(''); 
        setNewServiceTypeName(''); 
        try {
          const response = await fetch(`/api/service-types?categoryId=${selectedCategoryId}`);
          if (response.ok) {
            const data = await response.json();
            setServiceTypesForCategory(data);
            // 수정 모드이고, serviceTypesForCategory가 로드되었으며, editingService.service_type_name이 있을 때
            if (isEditMode && editingService?.service_type_name) {
              const initialServiceTypeId = data.find((st: any) => st.name === editingService.service_type_name)?.id;
              if (initialServiceTypeId) {
                setSelectedServiceTypeId(String(initialServiceTypeId));
              } else {
                // 만약 로드된 타입 목록에 editingService의 타입명이 없다면,
                // 직접 입력으로 간주하거나, API 응답의 service_type_id를 직접 사용 고려
                // 여기서는 일단 비워둠 (사용자가 직접 선택하거나 입력하도록 유도)
                 setSelectedServiceTypeId(''); 
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
  }, [selectedCategoryId, isOpen, isEditMode, editingService]); // editingService 추가

  const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

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

    // 서비스 타입 유효성 검사
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

    const minQty = Number(minOrderQuantity);
    const maxQty = Number(maxOrderQuantity);
    const price = Number(pricePerUnit);

    if (isNaN(minQty) || isNaN(maxQty) || isNaN(price)) {
        setError('수량과 가격은 유효한 숫자여야 합니다.');
        setIsLoading(false);
        return;
    }

    const serviceData: any = {};

    if (isEditMode) {
      // 수정 모드: 변경된 필드만 포함 (또는 모든 필드를 보내고 백엔드에서 처리)
      // 여기서는 editingService의 원본 값을 기준으로 변경된 값만 보내거나,
      // 필요한 모든 값을 snake_case로 보냅니다.
      serviceData.name = serviceName.trim(); // Zod 스키마가 name (snake_case 아님)을 기대하면 그대로 둠.
                                              // API 스키마를 확인하여 일관성 있게 맞춰야 합니다.
                                              // 현재 PUT API 스키마는 name을 그대로 사용합니다.
      serviceData.description = description; // description도 API 스키마에 따름
      serviceData.price_per_unit = price;
      serviceData.min_order_quantity = minQty;
      serviceData.max_order_quantity = maxQty;
      // serviceData.is_active = ...; // is_active 필드도 필요시 추가

      // 카테고리/타입 변경은 아직 PUT API에서 완전히 지원되지 않으므로,
      // 해당 로직이 API에 추가된 후 프론트에서도 관련 데이터 (예: service_type_id)를 보내야 합니다.
      // 지금은 기본 정보만 업데이트한다고 가정합니다.
      // 만약 service_type_id를 수정 가능하게 하려면 아래와 같이 추가:
      if (selectedServiceTypeId && selectedServiceTypeId !== ADD_NEW_VALUE) {
        serviceData.service_type_id = Number(selectedServiceTypeId);
      } else if (selectedServiceTypeId === ADD_NEW_VALUE && newServiceTypeName.trim()){
        // 새 서비스 타입 이름을 보내는 로직은 PUT API가 이를 처리하도록 확장 필요
        // serviceData.new_service_type_name = newServiceTypeName.trim(); 
      }

    } else {
      // 추가 모드 (기존 로직)
      if (selectedCategoryId === ADD_NEW_VALUE) serviceData.new_category_name = newCategoryName.trim();
      else serviceData.category_id = Number(selectedCategoryId);

      if (selectedServiceTypeId === ADD_NEW_VALUE) serviceData.new_service_type_name = newServiceTypeName.trim();
      else serviceData.service_type_id = Number(selectedServiceTypeId);
      
      serviceData.service_name = serviceName.trim();
      serviceData.min_order_quantity = minQty;
      serviceData.max_order_quantity = maxQty;
      serviceData.price_per_unit = price;
      serviceData.description = description;
    }

    try {
      const apiUrl = isEditMode ? `/api/services/${editingService.id}` : '/api/services';
      const apiMethod = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || (isEditMode ? '서비스 수정에 실패했습니다.' : '서비스 등록에 실패했습니다.'));
      }

      setSuccessMessage(result.message || (isEditMode ? '서비스가 성공적으로 수정되었습니다.' : '서비스가 성공적으로 등록되었습니다.'));
      // 폼 초기화는 모달이 닫힐 때 useEffect에서 처리하므로 여기서는 생략 가능
      // 또는 성공 후 즉시 필드를 비우고 싶다면 여기서도 호출
      if (onServiceAdded) {
        onServiceAdded(); // 추가/수정 완료 콜백 호출 (목록 새로고침 등)
      }
      // 성공 후 모달 자동 닫기는 onClose를 부모 컴포넌트에서 호출하도록 유도
      // setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-4 md:p-5">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {isEditMode ? '서비스 수정' : '새 서비스 추가'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}
          
          <div>
            <Label htmlFor="categorySelect" className="dark:text-gray-200">카테고리 선택 *</Label>
            <select
              id="categorySelect"
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                if (e.target.value !== ADD_NEW_VALUE) {
                  setNewCategoryName(''); 
                }
              }}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700"
              disabled={isLoading || categories.length === 0}
            >
              <option value="" disabled>카테고리를 선택하세요</option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
              <option value={ADD_NEW_VALUE} disabled={isEditMode && !!selectedCategoryId && selectedCategoryId !== ADD_NEW_VALUE}>
                {/* 수정 모드에서 기존 카테고리가 선택된 경우 '직접 입력' 비활성화 (선택 사항) */}
                직접 입력...
              </option>
            </select>
            {categories.length === 0 && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    등록된 카테고리가 없습니다. 먼저 카테고리를 추가해주세요. (또는 직접 입력 선택)
                </p>
            )}
          </div>

          {selectedCategoryId === ADD_NEW_VALUE && (
            <div className="mt-2">
              <Label htmlFor="newCategoryName" className="dark:text-gray-200">새 카테고리 이름 *</Label>
              <Input
                type="text"
                id="newCategoryName"
                placeholder="예: 새로운 SNS 서비스"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:placeholder-gray-400"
                required
                disabled={isLoading}
              />
            </div>
          )}
          
          {/* 서비스 타입 선택 */}
          {(selectedCategoryId && selectedCategoryId !== ADD_NEW_VALUE) || newCategoryName.trim() ? (
            <div className="mt-4">
              <Label htmlFor="serviceTypeSelect" className="dark:text-gray-200">서비스 타입 선택 *</Label>
              <select
                id="serviceTypeSelect"
                value={selectedServiceTypeId}
                onChange={(e) => {
                  setSelectedServiceTypeId(e.target.value);
                  if (e.target.value !== ADD_NEW_VALUE) {
                    setNewServiceTypeName('');
                  }
                }}
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700"
                disabled={isLoading || isLoadingServiceTypes}
              >
                <option value="" disabled>
                  {isLoadingServiceTypes ? '타입 불러오는 중...' : 
                    ((selectedCategoryId === ADD_NEW_VALUE || !selectedCategoryId) && !isEditMode) ? '카테고리 선택/입력 후 타입 선택/입력' : 
                    '서비스 타입을 선택하세요'}
                </option>
                {serviceTypesForCategory.map((type) => (
                  <option key={type.id} value={String(type.id)}>
                    {type.name}
                  </option>
                ))}
                <option value={ADD_NEW_VALUE} disabled={isEditMode && !!selectedServiceTypeId && selectedServiceTypeId !== ADD_NEW_VALUE}>
                   {/* 수정 모드에서 기존 타입이 선택된 경우 '직접 입력' 비활성화 (선택 사항) */}
                  직접 입력...
                </option>
              </select>
              {selectedCategoryId !== ADD_NEW_VALUE && serviceTypesForCategory.length === 0 && !isLoadingServiceTypes && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  선택된 카테고리에 등록된 서비스 타입이 없습니다. (또는 직접 입력 선택)
                </p>
              )}
            </div>
          ) : null}

          {selectedServiceTypeId === ADD_NEW_VALUE && ((selectedCategoryId && selectedCategoryId !== ADD_NEW_VALUE) || newCategoryName.trim()) && (
            <div className="mt-2">
              <Label htmlFor="newServiceTypeName" className="dark:text-gray-200">새 서비스 타입 이름 *</Label>
              <Input
                type="text"
                id="newServiceTypeName"
                placeholder="예: 한국인 팔로워 (실계정)"
                value={newServiceTypeName}
                onChange={(e) => setNewServiceTypeName(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:placeholder-gray-400"
                required
                disabled={isLoading}
              />
            </div>
          )}

          {/* 기존 typeName Input은 newServiceTypeName으로 대체되었으므로 주석 처리 또는 삭제 */}
          {/* 
          <div>
            <Label htmlFor="typeName">서비스 타입명 *</Label>
            <Input
              type="text"
              id="typeName"
              placeholder="예: 팔로워 (한국인)"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              className="w-full"
              required
              disabled={isLoading}
            />
          </div>
          */}

          {/* --- 세부 서비스 정보 섹션 (디자인 개선 예시) --- */}
          <div className="pt-4">
            <h4 className="mb-3 text-md font-semibold text-gray-800 dark:text-white">세부 서비스 정보</h4>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="serviceName" className="dark:text-gray-200">세부 서비스명 *</Label>
                    <Input
                    type="text"
                    id="serviceName"
                    placeholder="예: 한국인 실제 활동 팔로워 100명"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:placeholder-gray-400"
                    required
                    disabled={isLoading}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="minOrderQuantity" className="dark:text-gray-200">최소 주문 수량 *</Label>
                        <Input
                        type="text"
                        id="minOrderQuantity"
                        placeholder="예: 100"
                        value={minOrderQuantity}
                        onChange={handleNumericInputChange(setMinOrderQuantity)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:placeholder-gray-400"
                        min="0"
                        required
                        disabled={isLoading}
                        />
                    </div>
                    <div>
                        <Label htmlFor="maxOrderQuantity" className="dark:text-gray-200">최대 주문 수량 *</Label>
                        <Input
                        type="text"
                        id="maxOrderQuantity"
                        placeholder="예: 10000"
                        value={maxOrderQuantity}
                        onChange={handleNumericInputChange(setMaxOrderQuantity)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:placeholder-gray-400"
                        min="0"
                        required
                        disabled={isLoading}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="pricePerUnit" className="dark:text-gray-200">1개당 주문 가격 (원) *</Label>
                    <Input
                    type="text"
                    id="pricePerUnit"
                    placeholder="예: 10"
                    value={pricePerUnit}
                    onChange={handleNumericInputChange(setPricePerUnit)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:placeholder-gray-400"
                    min="0"
                    required
                    disabled={isLoading}
                    />
                </div>

                <div>
                    <Label htmlFor="description" className="dark:text-gray-200">서비스 설명 *</Label>
                    <textarea
                    id="description"
                    rows={4}
                    placeholder="서비스에 대한 상세 설명을 입력하세요..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:placeholder-gray-400"
                    required
                    disabled={isLoading}
                    ></textarea>
                </div>
            </div>
          </div>
          {/* --- 세부 서비스 정보 섹션 끝 --- */}

          <div className="flex justify-end space-x-3 pt-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button 
              variant="primary" 
              disabled={isLoading}
            >
              {isLoading ? (isEditMode ? '저장 중...' : '추가 중...') : (isEditMode ? '서비스 저장' : '서비스 추가')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewServiceModal; 