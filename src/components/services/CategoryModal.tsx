'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal'; // 기존 Modal 컴포넌트 사용
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded?: () => void; // 카테고리 추가 후 실행할 콜백
  // editingCategory?: Category | null; // 추후 수정 기능 추가시 사용
}

// interface Category { // 필요시 상세 타입 정의
//   id: number;
//   name: string;
//   description?: string;
// }

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onCategoryAdded,
  // editingCategory,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCategoryName('');
      setDescription('');
      setError(null);
      setSuccessMessage(null);
      setIsLoading(false);
    }
    // TODO: editingCategory가 있다면 해당 값으로 폼 초기화 (수정 기능 구현 시)
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!categoryName.trim()) {
      setError('카테고리 이름은 필수입니다.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName, description }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '카테고리 추가에 실패했습니다.');
      }

      setSuccessMessage(result.message || '카테고리가 성공적으로 추가되었습니다.');
      setCategoryName('');
      setDescription('');
      if (onCategoryAdded) {
        onCategoryAdded();
      }
      // 성공 후 일정 시간 뒤 모달 자동 닫기 (선택 사항)
      // setTimeout(() => onClose(), 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 md:p-5">
        <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
          {/* {editingCategory ? '카테고리 수정' : '새 카테고리 추가'} */} 
          새 카테고리 추가
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
          {successMessage && (
            <p className="mb-3 text-sm text-green-500">{successMessage}</p>
          )}
          <div>
            <Label htmlFor="categoryNameModal">카테고리 이름 *</Label>
            <Input
              type="text"
              id="categoryNameModal"
              placeholder="예: SNS 서비스"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="categoryDescriptionModal">설명 (선택)</Label>
            <textarea
              id="categoryDescriptionModal"
              rows={3}
              placeholder="카테고리에 대한 간단한 설명을 입력하세요..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-form-input dark:text-white dark:focus:border-brand-800"
              disabled={isLoading}
            />
          </div>
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
              {isLoading ? '저장 중...' : '카테고리 추가'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CategoryModal; 
