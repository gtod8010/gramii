import React from 'react';
import { Metadata } from 'next';
import ServiceListDisplay from '@/components/services/ServiceListDisplay'; // 새로 만든 클라이언트 컴포넌트 임포트

// 메타데이터 export는 여기에 유지
export const metadata: Metadata = {
  title: "서비스 목록 | GRAMII",
  description: "다양한 서비스를 확인하고 주문할 수 있습니다.",
};

// 페이지 컴포넌트는 이제 ServiceListDisplay를 렌더링
const ServicesPage = () => {
  return <ServiceListDisplay />;
};

export default ServicesPage; 
