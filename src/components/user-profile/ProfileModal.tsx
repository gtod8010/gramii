"use client";

import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { toast } from 'react-hot-toast';
import { 
    XMarkIcon, 
    UserCircleIcon,
    EnvelopeIcon,
    DevicePhoneMobileIcon,
    KeyIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!user) {
        toast.error('사용자 정보를 찾을 수 없습니다.');
        return;
    }

    setIsSubmitting(true);
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`/api/users/${user.id}/change-password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '비밀번호 변경에 실패했습니다.');
        }

        toast.success('비밀번호가 성공적으로 변경되었습니다.');
        onClose(); // 성공 시 모달 닫기
    } catch (error) {
        toast.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
        setIsSubmitting(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">프로필 정보</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6">
            {/* 사용자 정보 표시 */}
            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                    <UserCircleIcon className="w-5 h-5 text-gray-400" />
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">이름</label>
                        <p className="text-md font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <UserCircleIcon className="w-5 h-5 text-gray-400" />
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">아이디</label>
                        <p className="text-md font-medium text-gray-900 dark:text-gray-100">{user?.username}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">이메일</label>
                        <p className="text-md font-medium text-gray-900 dark:text-gray-100">{user?.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">핸드폰 번호</label>
                        <p className="text-md font-medium text-gray-900 dark:text-gray-100">{user?.phone_number || '정보 없음'}</p>
                    </div>
                </div>
            </div>

            {/* 비밀번호 변경 폼 */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
                 <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-gray-800 px-3 text-lg font-medium text-gray-900 dark:text-gray-100">
                        비밀번호 변경
                        </span>
                    </div>
                </div>

                <div className="relative">
                     <KeyIcon className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
                    <input type="password" placeholder="현재 비밀번호" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required 
                           className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="relative">
                    <LockClosedIcon className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
                    <input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required 
                           className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="relative">
                    <LockClosedIcon className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
                    <input type="password" placeholder="새 비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required 
                           className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="pt-2">
                    <button type="submit" disabled={isSubmitting}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 dark:bg-pink-500 dark:hover:bg-pink-600 dark:focus:ring-pink-700 transition-colors">
                        {isSubmitting ? '변경 중...' : '비밀번호 변경'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
