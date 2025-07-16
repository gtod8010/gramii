'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
  description: string | null;
  display_order: number;
}

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryUpdated: () => void; // 카테고리 변경 후 메인 페이지 데이터 새로고침을 위한 콜백
}

const CategoryManagementModal: React.FC<CategoryManagementModalProps> = ({
  isOpen,
  onClose,
  onCategoryUpdated,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await fetch('/api/categories', { headers });
      if (!response.ok) {
        throw new Error('카테고리 정보를 가져오는데 실패했습니다.');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSwapOrder = async (index1: number, index2: number) => {
    const category1 = categories[index1];
    const category2 = categories[index2];

    try {
      const response = await fetch('/api/categories/swap-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category1, category2 }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '순서 변경에 실패했습니다.');
      }
      toast.success('순서가 변경되었습니다.');
      fetchCategories(); // Re-fetch to update UI
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('카테고리 이름을 입력해주세요.');
      return;
    }
    const toastId = toast.loading('새 카테고리를 추가하는 중...');
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '추가에 실패했습니다.');
      }
      toast.success('카테고리가 추가되었습니다.', { id: toastId });
      setNewCategoryName('');
      fetchCategories(); // 목록 새로고침
      onCategoryUpdated(); // 메인 페이지 새로고침
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.', { id: toastId });
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editingCategoryName.trim()) {
      toast.error('카테고리 이름은 비워둘 수 없습니다.');
      return;
    }
    const toastId = toast.loading('카테고리 이름을 수정하는 중...');
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategoryName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '수정에 실패했습니다.');
      }
      toast.success('카테고리가 수정되었습니다.', { id: toastId });
      cancelEditing();
      fetchCategories();
      onCategoryUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.', { id: toastId });
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!window.confirm(`'${name}' 카테고리를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없으며, 관련된 모든 서비스 타입과 서비스가 함께 삭제됩니다.`)) {
      return;
    }
    const toastId = toast.loading('카테고리를 삭제하는 중...');
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '삭제에 실패했습니다.');
      }
      toast.success('카테고리가 삭제되었습니다.', { id: toastId });
      fetchCategories();
      onCategoryUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.', { id: toastId });
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="카테고리 관리" className="max-w-lg">
      <div className="p-6 space-y-4">
        {/* 새로운 카테고리 추가 */}
        <div className="flex items-center space-x-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="새 카테고리 이름"
            className="flex-grow"
          />
          <Button onClick={handleAddCategory}>추가</Button>
        </div>

        {/* 기존 카테고리 목록 */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {isLoading ? (
            <p className="text-sm text-center text-slate-500 py-4">카테고리 목록을 불러오는 중...</p>
          ) : (
            categories.map((cat, index) => (
              <div key={cat.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                {editingCategoryId === cat.id ? (
                  <>
                    <Input
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="flex-grow"
                    />
                    <div className="flex items-center space-x-2 ml-2">
                      <Button size="sm" variant="primary" onClick={() => handleUpdateCategory(cat.id)}>
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-slate-700 dark:text-slate-200">{cat.name}</span>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleSwapOrder(index, index - 1)} disabled={index === 0}>
                        <ArrowUpIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSwapOrder(index, index + 1)} disabled={index === categories.length - 1}>
                        <ArrowDownIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => startEditing(cat)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteCategory(cat.id, cat.name)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CategoryManagementModal; 
