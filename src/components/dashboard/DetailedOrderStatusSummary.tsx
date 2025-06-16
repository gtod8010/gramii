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
import { statusDisplayNames, realsiteToGramiiStatusMap } from '@/lib/constants';

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
  // 원하는 순서대로 상태 키를 정의합니다. (API에서 오는 키 기준)
  const statusKeysInOrder = [
    'Pending',
    'Processing',
    'In progress',
    'Completed',
    'Partial',
    'Cancelled', // API는 Cancelled 또는 Canceled를 사용할 수 있음
  ];

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">주문 상태별 요약</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statusKeysInOrder.map(apiKey => {
          const count = orderStatusSummary[apiKey] || 0;
          // API 키(PascalCase)를 DB/상수 키(snake_case)로 변환
          const dbKey = realsiteToGramiiStatusMap[apiKey] || 'pending';
          
          const IconComponent = iconMap[dbKey] || CogIcon;
          const textColor = colorMap[dbKey] || 'text-gray-500';
          const displayName = statusDisplayNames[dbKey] || '알 수 없음';

          return (
            <div 
              key={apiKey} 
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
