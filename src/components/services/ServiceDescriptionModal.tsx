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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          {/* service.description을 white-space: pre-wrap 스타일로 표시 */}
          {typeof service.description === 'string' ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{service.description}</div>
          ) : (
            service.description // ReactNode인 경우 그대로 렌더링
          )}
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