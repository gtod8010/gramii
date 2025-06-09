"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';

// page.tsx에서 정의했던 Service 타입을 가져오거나 여기서 다시 정의해야 합니다.
// 우선 간단하게 id, name만 있는 형태로 가정합니다.
interface Service {
  id: number;
  name: string;
  // 필요한 다른 속성들...
}

interface Special {
  id: number;
  name: string;
  description?: string;
  service_ids?: number[]; // 이 스페셜에 포함된 서비스 ID 목록
}

interface SpecialManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpecialManagementUpdated: () => void; // 스페셜 생성/수정 완료 후 호출될 함수
  allServices: Service[]; // 선택 가능한 전체 서비스 목록
  existingSpecials?: Special[]; // 기존 스페셜 목록 (편집 모드 등에서 사용 가능)
}

type ModalMode = 'list' | 'create' | 'edit';

const SpecialManagementModal: React.FC<SpecialManagementModalProps> = ({
  isOpen,
  onClose,
  onSpecialManagementUpdated,
  allServices,
  existingSpecials = [], // 기본값 빈 배열로 설정
}) => {
  const [mode, setMode] = useState<ModalMode>('list');
  const [editingSpecialInternal, setEditingSpecialInternal] = useState<Special | null>(null);

  const [specialName, setSpecialName] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모달이 열리거나 existingSpecials가 변경될 때 mode를 list로 초기화
  useEffect(() => {
    if (isOpen) {
      setMode('list');
      setEditingSpecialInternal(null); // 다른 모드에서 닫혔다가 다시 열릴 경우를 대비
    }
  }, [isOpen]);

  // 수정 또는 생성 모드로 진입 시 폼 상태 초기화
  useEffect(() => {
    if (mode === 'create') {
      setEditingSpecialInternal(null);
      setSpecialName('');
      setDescription('');
      setSelectedServiceIds([]);
      setError(null);
    } else if (mode === 'edit' && editingSpecialInternal) {
      setSpecialName(editingSpecialInternal.name);
      setDescription(editingSpecialInternal.description || '');
      setSelectedServiceIds(editingSpecialInternal.service_ids || []);
      setError(null);
    }
  }, [mode, editingSpecialInternal]);

  const handleServiceSelection = (serviceId: number) => {
    setSelectedServiceIds(prevSelected =>
      prevSelected.includes(serviceId)
        ? prevSelected.filter(id => id !== serviceId)
        : [...prevSelected, serviceId]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!specialName.trim()) {
      setError('스페셜 이름은 필수입니다.');
      setIsSubmitting(false);
      return;
    }
    // 서비스 선택은 필수가 아닐 수 있음 (요구사항에 따라 조정)
    // if (selectedServiceIds.length === 0) {
    //   setError('하나 이상의 서비스를 선택해야 합니다.');
    //   setIsSubmitting(false);
    //   return;
    // }

    const specialData = {
      name: specialName,
      description: description,
      service_ids: selectedServiceIds,
    };

    try {
      let response;
      if (mode === 'edit' && editingSpecialInternal) {
        response = await fetch(`/api/specials/${editingSpecialInternal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(specialData),
        });
      } else { // mode === 'create'
        response = await fetch('/api/specials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(specialData),
        });
      }

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || (mode === 'edit' ? '스페셜 수정에 실패했습니다.' : '스페셜 생성에 실패했습니다.'));
      }

      onSpecialManagementUpdated();
      // 성공 후 목록 화면으로 돌아가거나 모달을 닫음
      // 여기서는 모달을 닫도록 처리 (목록으로 돌아가기는 사용자가 취소 버튼을 누르는 것과 유사)
      // 또는 setMode('list')로 변경하여 목록을 다시 보여줄 수도 있음
      onClose(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteSpecial = async (specialId: number) => {
    if (!window.confirm('정말로 이 스페셜을 삭제하시겠습니까? 연결된 서비스들은 스페셜에서 해제됩니다.')) {
      return;
    }
    setIsSubmitting(true); // 전체 UI에 대한 로딩 표시로 사용 가능
    setError(null);
    try {
      const response = await fetch(`/api/specials/${specialId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || '스페셜 삭제에 실패했습니다.');
      }
      onSpecialManagementUpdated(); // 목록 새로고침
      // mode는 여전히 'list'이므로 별도 변경 불필요
    } catch (err: any) {
      setError(err.message); // 에러 메시지 표시
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderListMode = () => (
    <div className="space-y-4 p-4 md:p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">등록된 스페셜 목록</h3>
        <Button variant="primary" onClick={() => setMode('create')}>새 스페셜 추가</Button>
      </div>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>} {/* 삭제 에러 등 표시 */}
      {existingSpecials.length === 0 && !isSubmitting && (
        <p className="text-sm text-gray-500">등록된 스페셜이 없습니다.</p>
      )}
      {isSubmitting && existingSpecials.length === 0 &&  <p className="text-sm text-gray-500">목록을 불러오는 중 또는 작업 중...</p> }
      <ul className="space-y-3 max-h-96 overflow-y-auto">
        {existingSpecials.map(special => (
          <li key={special.id} className="p-3 border rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{special.name}</p>
              {special.description && <p className="text-xs text-gray-500 dark:text-gray-400">{special.description}</p>}
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setEditingSpecialInternal(special);
                  setMode('edit');
                }}
                disabled={isSubmitting}
              >
                수정
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => handleDeleteSpecial(special.id)}
                isLoading={isSubmitting} // 특정 항목 삭제 시 로딩 상태 반영 어려우므로 전체 isSubmitting 활용
                disabled={isSubmitting}
              >
                삭제
              </Button>
            </div>
          </li>
        ))}
      </ul>
       <div className="flex justify-end pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
    </div>
  );

  const renderFormMode = () => (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-5">
      <div>
        <Label htmlFor="specialName">스페셜 이름</Label>
        <Input
          id="specialName"
          type="text"
          value={specialName}
          onChange={(e) => setSpecialName(e.target.value)}
          placeholder="예: 여름맞이 특별 패키지"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="specialDescription">설명 (선택)</Label>
        <textarea
          id="specialDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          placeholder="스페셜에 대한 간단한 설명을 입력하세요."
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Label>서비스 선택</Label>
        {allServices.length > 0 ? (
          <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2 dark:border-gray-600">
            {allServices.map(service => (
              <div key={service.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`service-${service.id}`}
                  checked={selectedServiceIds.includes(service.id)}
                  onChange={() => handleServiceSelection(service.id)}
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                  disabled={isSubmitting}
                />
                <label htmlFor={`service-${service.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                  {service.name} (ID: {service.id})
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">선택할 수 있는 서비스가 없습니다.</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => mode === 'edit' || mode === 'create' ? setMode('list') : onClose()} // 수정/생성 중이면 목록으로, 아니면 닫기
          disabled={isSubmitting}
        >
          {mode === 'edit' || mode === 'create' ? '목록으로' : '취소'}
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
          {mode === 'edit' ? "수정 완료" : "스페셜 생성"}
        </Button>
      </div>
    </form>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => { // 모달 닫기 시 내부 상태도 고려
        if (isSubmitting) return; // 작업 중이면 닫기 방지 (선택적)
        setMode('list'); // 항상 목록으로 초기화
        setEditingSpecialInternal(null);
        onClose();
      }} 
      title={mode === 'list' ? "스페셜 관리" : (mode === 'edit' ? "스페셜 수정" : "새 스페셜 생성")}
      className="max-w-2xl" // 기존 className 유지
    >
      {mode === 'list' ? renderListMode() : renderFormMode()}
    </Modal>
  );
};

export default SpecialManagementModal; 
 