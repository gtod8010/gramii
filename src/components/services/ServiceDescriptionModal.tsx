"use client";

import React from 'react';

interface ServiceItem {
  id: string | number;
  name: string;
  price?: string; 
  quantity?: string; 
  description?: React.ReactNode; // 타입을 React.ReactNode 로 변경
}

interface ServiceDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
}

const ServiceDescriptionModal: React.FC<ServiceDescriptionModalProps> = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) {
    return null;
  }

  // 임시 상세 설명 데이터 (실제로는 service.description을 사용해야 함)
  const tempDescription = (
    <div>
      <p className="font-semibold mb-2">⚠️ 주의사항</p>
      <ul className="list-disc list-inside space-y-1 mb-4 text-sm">
        <li>외국인 팔로워 입니다.</li>
        <li>이탈 거의 없음</li>
      </ul>
      <p className="font-semibold mb-2">❗ 필독사항</p>
      <ul className="list-disc list-inside space-y-1 mb-4 text-sm">
        <li>24시간 기준 20만건 진행 가능</li>
      </ul>
      <p className="font-semibold mb-2">💡 참고사항</p>
      <ul className="list-disc list-inside space-y-1 mb-4 text-sm">
        <li>최근 주문량이 급증한 계정, 계정의 상태 또는 기타 복합적인 문제로 팔로우가 모두 진행되는 않는 경우가 발생되기도 하며 이는 AS가 불가능합니다. 원활한 작업을 위해 하나의 계정에 해당 서비스를 포함하여 여러 건의 주문을 동시에 진행하시는 것을 권유드리지 않습니다.</li>
      </ul>
      <p className="font-semibold mb-2">⏱️ 작업시간</p>
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>1분~24시간이내</li>
        <li>유입 표시 주문량이 많은경우 24시간까지 소요될수 있습니다.</li>
        <li>유입완료는 신청주신 수량보다 자동적으로 더 추가주입해드리며 차이가있습니다.</li>
      </ul>
    </div>
  );


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {service.id} - {service.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-4 md:p-6 overflow-y-auto text-sm text-gray-700 dark:text-gray-300">
          {/* 실제로는 service.description 또는 다른 필드에서 가져온 내용을 표시 */}
          {service.description || tempDescription}
        </div>
        <div className="flex items-center justify-end p-4 md:p-6 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDescriptionModal; 