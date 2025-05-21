"use client";

import React from 'react';
import {
  ClockIcon, // 대기중
  CogIcon, // 처리중
  CheckCircleIcon, // 완료됨
  ExclamationCircleIcon, // 취소됨 (또는 XCircleIcon)
  MinusCircleIcon, // 부분완료됨 (또는 PuzzlePieceIcon)
} from '@heroicons/react/24/outline';
import { statusDisplayNames } from '@/app/(admin)/order-history/page'; // 주문 상태 표시 이름

interface DetailedOrderStatusSummaryProps {
  orderStatusSummary: Record<string, number>;
}

const iconMap: { [key: string]: React.ElementType } = {
  Pending: ClockIcon,
  Processing: CogIcon,
  Completed: CheckCircleIcon,
  Cancelled: ExclamationCircleIcon,
  Partial: MinusCircleIcon,
};

const colorMap: { [key: string]: string } = {
  Pending: 'text-yellow-500',
  Processing: 'text-blue-500',
  Completed: 'text-green-500',
  Cancelled: 'text-gray-500',
  Partial: 'text-purple-500',
};

const DetailedOrderStatusSummary: React.FC<DetailedOrderStatusSummaryProps> = ({ orderStatusSummary }) => {
  const statusKeys = Object.keys(statusDisplayNames); // Pending, Processing 등 API 키 순서대로

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">주문 상태별 요약</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {statusKeys.map(statusKey => {
          const count = orderStatusSummary[statusKey] || 0;
          const IconComponent = iconMap[statusKey] || CogIcon; // 기본 아이콘
          const textColor = colorMap[statusKey] || 'text-gray-500';

          return (
            <div 
              key={statusKey} 
              className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
            >
              <IconComponent className={`h-8 w-8 mb-2 ${textColor}`} />
              <p className={`text-xl font-bold ${textColor}`}>{count}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{statusDisplayNames[statusKey]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailedOrderStatusSummary; 
