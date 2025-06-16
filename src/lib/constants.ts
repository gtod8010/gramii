// src/lib/constants.ts

// 주문 상태에 따른 뱃지 색상을 정의합니다.
export const statusColors: { [key: string]: string } = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  in_progress: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  partial: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

// ApexCharts를 위한 HEX 색상 코드 매핑
export const chartStatusColors: { [key: string]: string } = {
  pending: '#FBBF24',      // yellow
  in_progress: '#22D3EE',  // cyan
  processing: '#3B82F6',   // blue
  partial: '#818CF8',      // indigo
  completed: '#22C55E',   // green
  canceled: '#EF4444',     // red
  refunded: '#6B7280',     // gray
};

// DB에 저장된 status(key)와 화면에 표시될 한글 이름(value) 매핑
export const statusDisplayNames: { [key: string]: string } = {
  pending: '대기중',
  in_progress: '진행중',
  processing: '처리중',
  completed: '완료됨',
  partial: '부분완료됨',
  canceled: '취소됨',
  // 'refunded': '환불됨' // 필요 시 주석 해제
};

// Realsite API의 status와 gramii DB status를 매핑
export const realsiteToGramiiStatusMap: { [key: string]: string } = {
  'Pending': 'pending',
  'In progress': 'in_progress',
  'Processing': 'processing',

  'Partial': 'partial',
  'Completed': 'completed',
  'Canceled': 'canceled',
  'Cancelled': 'canceled',
  'Refunded': 'refunded', // 환불 상태도 DB에는 저장
}; 
