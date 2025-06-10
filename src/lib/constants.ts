// src/lib/constants.ts

// 주문 상태에 따른 뱃지 색상을 정의합니다.
export const statusColors: { [key: string]: string } = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  Partial: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
  Cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

// API의 order_status 값과 프론트엔드 표시 이름 매핑
export const statusDisplayNames: { [key: string]: string } = {
  Pending: '대기중',
  Processing: '처리중',
  Completed: '완료됨',
  Partial: '부분완료됨',
  Cancelled: '취소됨',
}; 
