"use client";
import React from 'react';

interface OrderStatusItemProps {
  statusName: string;
  count: number;
  colorClass: string;
}

const OrderStatusItem: React.FC<OrderStatusItemProps> = ({ statusName, count, colorClass }) => (
  <li className="flex items-center justify-between py-1">
    <div className="flex items-center">
      <span className={`mr-2 inline-block h-3 w-3 rounded-full ${colorClass}`}></span>
      <span className="text-sm text-gray-700 dark:text-gray-300">{statusName}</span>
    </div>
    <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
  </li>
);

interface OrderStatusSummaryProps {
  orderStatusSummary: Record<string, number>;
}

// API의 order_status 값을 한글 표시명과 색상으로 매핑
const statusDisplayConfig: Record<string, { displayName: string; colorClass: string }> = {
  Pending: { displayName: "준비중", colorClass: "bg-yellow-400" },
  Processing: { displayName: "처리중", colorClass: "bg-blue-500" },
  Completed: { displayName: "완료됨", colorClass: "bg-green-500" },
  Partial: { displayName: "부분완료", colorClass: "bg-teal-500" },
  Cancelled: { displayName: "취소됨", colorClass: "bg-red-500" },
  Refunded: { displayName: "환불됨", colorClass: "bg-gray-400" },
  // 필요에 따라 DB에 저장된 다른 상태값들도 추가
};

const OrderStatusSummary: React.FC<OrderStatusSummaryProps> = ({ orderStatusSummary }) => {
  // 표시할 순서를 정의 (예: DB에는 있지만 화면에는 특정 순서로 보여주고 싶을 때)
  const displayOrder = ['Pending', 'Processing', 'Completed', 'Partial', 'Cancelled', 'Refunded'];

  const processedStatuses = displayOrder.map(statusKey => {
    const config = statusDisplayConfig[statusKey];
    const count = orderStatusSummary[statusKey] || 0;
    return {
      originalKey: statusKey, // 필터링을 위해 원본 키 유지
      name: config ? config.displayName : statusKey,
      count: count,
      color: config ? config.colorClass : "bg-gray-300",
    };
  }).filter(status => status.count > 0 || ['Pending', 'Processing', 'Completed'].includes(status.originalKey)); // status.originalKey 사용

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">주문상태 요약</h3>
      {processedStatuses.length > 0 ? (
        <ul className="space-y-2">
          {processedStatuses.map((status) => (
            <OrderStatusItem
              key={status.originalKey} // 고유한 키로 originalKey 사용
              statusName={status.name}
              count={status.count}
              colorClass={status.color}
            />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">표시할 주문 상태 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default OrderStatusSummary; 