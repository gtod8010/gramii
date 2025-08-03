import React from 'react';
import { Metadata } from 'next';
import ServiceListDisplay from '@/components/services/ServiceListDisplay';
import { siteConfig } from '@/lib/constants';

export const metadata: Metadata = {
  title: `서비스 목록 | ${siteConfig.name.en}`,
  description: "다양한 서비스를 확인하고 주문할 수 있습니다.",
};

const ServicesPage = () => {
  return <ServiceListDisplay />;
};

export default ServicesPage; 
