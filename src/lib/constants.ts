// src/lib/constants.ts
const siteVariant = process.env.NEXT_PUBLIC_SITE_VARIANT || 'gramii';

interface SiteConfig {
  name: {
    en: string;
    ko: string;
  };
  logoPath: string;
  contactEmail: string;
  accountHolder: string;
  siteUrl: string;
  address: string;
  businessNumber: string;
  mailOrderLicense: string;
  kakaoTalkUrl: string;
}

const gramiiConfig: SiteConfig = {
  name: {
    en: 'GRAMII',
    ko: '그래미',
  },
  logoPath: '/images/gramii_logo.png',
  contactEmail: 'gramii0505@gmail.com',
  accountHolder: '김수민(그래미)',
  siteUrl: 'https://gramii.co.kr',
  address: '서울특별시 강서구 공항대로 426',
  businessNumber: '572-05-03128',
  mailOrderLicense: '제2025-서울강서-1815호',
  kakaoTalkUrl: 'http://pf.kakao.com/_aIRrn',
};

const ordaConfig: SiteConfig = {
  name: {
    en: 'ORDA',
    ko: '오르다',
  },
  logoPath: '/images/logos/orda/1W.png',
  contactEmail: 'rlaeotjd97@naver.com',
  accountHolder: '김수민(오르다)',
  siteUrl: 'https://orda.co.kr', // orda URL (임시)
  address: '서울특별시 관악구 관천로26길 86',
  businessNumber: '266-69-00650',
  mailOrderLicense: '제2025-서울관악-0917호',
  kakaoTalkUrl: 'http://pf.kakao.com/_xoxaPan',
};

export const siteConfig: SiteConfig = siteVariant === 'orda' ? ordaConfig : gramiiConfig;

// 사이트별 입금 계좌 정보
interface AccountDetail {
  bank: string;
  accountNumber: string;
  accountHolder: string;
}

interface SiteAccountInfo {
  default: AccountDetail;
  tax: AccountDetail;
}

const gramiiAccounts: SiteAccountInfo = {
  default: {
    bank: '카카오뱅크',
    accountNumber: '3333-09-7616546',
    accountHolder: '김수민',
  },
  tax: {
    bank: 'KB 국민은행',
    accountNumber: '444401-01-499150',
    accountHolder: '김수민(그래미)',
  }
};

const ordaAccounts: SiteAccountInfo = {
  default: {
    bank: '카카오뱅크',
    accountNumber: '3333-34-6848406',
    accountHolder: '이승찬',
  },
  tax: {
    bank: 'KB 국민은행',
    accountNumber: '811401-04-358621',
    accountHolder: '김대성',
  }
};

export const accountInfo: SiteAccountInfo = siteVariant === 'orda' ? ordaAccounts : gramiiAccounts;


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
