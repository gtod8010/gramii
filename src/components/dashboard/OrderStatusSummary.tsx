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

const OrderStatusSummary: React.FC = () => {
  const orderStatuses = [
    { name: "준비중", count: 5, color: "bg-yellow-400" },
    { name: "처리중", count: 12, color: "bg-blue-500" },
    { name: "완료됨", count: 35, color: "bg-green-500" },
    { name: "부분완료", count: 3, color: "bg-teal-500" },
    { name: "취소됨", count: 1, color: "bg-red-500" },
    { name: "환불됨", count: 0, color: "bg-gray-400" },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">주문상태 요약</h3>
      <ul className="space-y-2">
        {orderStatuses.map((status) => (
          <OrderStatusItem
            key={status.name}
            statusName={status.name}
            count={status.count}
            colorClass={status.color}
          />
        ))}
      </ul>
    </div>
  );
};

export default OrderStatusSummary; 