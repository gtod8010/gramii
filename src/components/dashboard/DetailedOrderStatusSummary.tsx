"use client";

import React from 'react';
import {
  ClockIcon, // 대기중
  CogIcon, // 처리중
  CheckCircleIcon, // 완료됨
  ExclamationCircleIcon, // 취소됨 (또는 XCircleIcon)
  MinusCircleIcon, // 부분완료됨 (또는 PuzzlePieceIcon)
  ArrowPathIcon, // 진행중 (새 아이콘)
} from '@heroicons/react/24/outline';
import { statusDisplayNames } from '@/lib/constants';

interface DetailedOrderStatusSummaryProps {
  orderStatusSummary: Record<string, number>;
}

const iconMap: { [key: string]: React.ElementType } = {
  pending: ClockIcon,
  in_progress: ArrowPathIcon,
  processing: CogIcon,
  completed: CheckCircleIcon,
  canceled: ExclamationCircleIcon,
  partial: MinusCircleIcon,
};

const colorMap: { [key: string]: string } = {
  pending: 'text-yellow-500',
  in_progress: 'text-sky-500',
  processing: 'text-blue-500',
  canceled: 'text-gray-500',
  partial: 'text-purple-500',
  completed: 'text-green-500',
};

const DetailedOrderStatusSummary: React.FC<DetailedOrderStatusSummaryProps> = ({ orderStatusSummary }) => {
  // DB에서 사용하는 snake_case 상태 키를 기준으로 순서 정의
  const statusKeysInOrder: (keyof typeof statusDisplayNames)[] = [
    'pending',
    'processing',
    'in_progress',
    'completed',
    'partial',
    'canceled',
  ];

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">주문 상태별 요약</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statusKeysInOrder.map(dbKey => {
          // orderStatusSummary 객체에서 직접 snake_case 키로 값을 조회
          const count = orderStatusSummary[dbKey] || 0;
          
          const IconComponent = iconMap[dbKey] || CogIcon;
          const textColor = colorMap[dbKey] || 'text-gray-500';
          const displayName = statusDisplayNames[dbKey] || '알 수 없음';

          return (
            <div 
              key={dbKey} 
              className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
            >
              <IconComponent className={`h-8 w-8 mb-2 ${textColor}`} />
              <p className={`text-xl font-bold ${textColor}`}>{count}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{displayName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailedOrderStatusSummary; 
