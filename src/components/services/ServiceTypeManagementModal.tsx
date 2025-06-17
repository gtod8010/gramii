'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select'; // 카테고리 선택을 위해 Select 컴포넌트 사용
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

// 부모 컴포넌트에서 내려주는 카테고리 타입
interface Category {
  id: number;
  name: string;
}

// 서비스 타입
interface ServiceType {
  id: number;
  name: string;
  category_id: number;
}

interface ServiceTypeManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[]; // 카테고리 목록을 props로 받음
  onServiceTypeUpdated: () => void; // 서비스 타입 변경 후 메인 페이지 데이터 새로고침
}

const ServiceTypeManagementModal: React.FC<ServiceTypeManagementModalProps> = ({
  isOpen,
  onClose,
  categories,
  onServiceTypeUpdated,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newServiceTypeName, setNewServiceTypeName] = useState('');
  const [editingServiceTypeId, setEditingServiceTypeId] = useState<number | null>(null);
  const [editingServiceTypeName, setEditingServiceTypeName] = useState('');

  // 카테고리 목록을 Select 컴포넌트 형식에 맞게 변환
  const categoryOptions = categories.map(cat => ({ value: String(cat.id), label: cat.name }));

  const fetchServiceTypes = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setServiceTypes([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/service-types?categoryId=${categoryId}`);
      if (!response.ok) throw new Error('서비스 타입 목록을 불러오는데 실패했습니다.');
      const data = await response.json();
      setServiceTypes(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      setServiceTypes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 선택된 카테고리가 변경되면 해당 카테고리의 서비스 타입을 불러옵니다.
  useEffect(() => {
    fetchServiceTypes(selectedCategoryId);
  }, [selectedCategoryId, fetchServiceTypes]);

  const handleAddServiceType = async () => {
    if (!newServiceTypeName.trim() || !selectedCategoryId) return;

    try {
      const response = await fetch('/api/service-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newServiceTypeName, category_id: parseInt(selectedCategoryId) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '서비스 타입 추가에 실패했습니다.');

      toast.success('서비스 타입이 추가되었습니다.');
      setNewServiceTypeName('');
      await fetchServiceTypes(selectedCategoryId);
      onServiceTypeUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleUpdateServiceType = async (id: number) => {
    if (!editingServiceTypeName.trim()) return;
    
    try {
      const response = await fetch(`/api/service-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingServiceTypeName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '서비스 타입 수정에 실패했습니다.');

      toast.success('서비스 타입이 수정되었습니다.');
      setEditingServiceTypeId(null);
      setEditingServiceTypeName('');
      await fetchServiceTypes(selectedCategoryId);
      onServiceTypeUpdated();
    } catch (error) {
       toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleDeleteServiceType = async (id: number) => {
    if (!window.confirm('정말 이 서비스 타입을 삭제하시겠습니까?\n이 타입에 속한 모든 서비스도 함께 삭제됩니다.')) return;

    try {
      const response = await fetch(`/api/service-types/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '서비스 타입 삭제에 실패했습니다.');
      
      toast.success('서비스 타입이 삭제되었습니다.');
      await fetchServiceTypes(selectedCategoryId);
      onServiceTypeUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };
  
  const startEditing = (serviceType: ServiceType) => {
    setEditingServiceTypeId(serviceType.id);
    setEditingServiceTypeName(serviceType.name);
  };
  const cancelEditing = () => {
    setEditingServiceTypeId(null);
    setEditingServiceTypeName('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="서비스 타입 관리" className="max-w-xl">
      <div className="p-6 space-y-4">
        {/* 카테고리 선택 */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">카테고리</label>
          <Select
            value={selectedCategoryId}
            onChange={setSelectedCategoryId}
            options={categoryOptions}
            placeholder="관리할 카테고리를 선택하세요"
          />
        </div>

        {selectedCategoryId && (
          <>
            <hr className="my-4 border-slate-200 dark:border-slate-700"/>
            {/* 새 서비스 타입 추가 */}
            <div className="flex items-center space-x-2">
              <Input
                value={newServiceTypeName}
                onChange={(e) => setNewServiceTypeName(e.target.value)}
                placeholder="새 서비스 타입 이름"
                className="flex-grow"
              />
              <Button onClick={handleAddServiceType} disabled={!newServiceTypeName.trim() || isLoading}>추가</Button>
            </div>

            {/* 기존 서비스 타입 목록 */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {isLoading ? (
                <p className="text-sm text-center text-slate-500 py-4">서비스 타입 목록을 불러오는 중...</p>
              ) : serviceTypes.length > 0 ? (
                serviceTypes.map((st) => (
                  <div key={st.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                    {editingServiceTypeId === st.id ? (
                      <>
                        <Input
                          value={editingServiceTypeName}
                          onChange={(e) => setEditingServiceTypeName(e.target.value)}
                          className="flex-grow"
                        />
                        <div className="flex items-center space-x-2 ml-2">
                          <Button size="sm" variant="primary" onClick={() => handleUpdateServiceType(st.id)}>
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing}>
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-sm text-slate-700 dark:text-slate-200">{st.name}</span>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => startEditing(st)}>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleDeleteServiceType(st.id)}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-slate-500 py-4">이 카테고리에는 서비스 타입이 없습니다.</p>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ServiceTypeManagementModal; 
