"use client";

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  { question: '실제 유저로 작업이 되나요?', answer: '실제 유저로 작업되는 상품과 그렇지 않은 상품으로 구분해서 판매 하고 있습니다. 따라서 원하시는 상품을 구매하시면 됩니다.' },
  { question: '가격이 왜 이렇게 저렴한가요?', answer: '그래미는 모든 주문을 대량으로 처리하기 때문에 작업 시 필요 한 트래픽 비용을 저렴하게 확보할 수 있습니다.' },
  { question: '좋아요를 신청하면 몇 분만에 숫자가 올라가나요?', answer: '좋아요 서비스는 주문 후 평균 1분~10분 내 자동으로 작업이 시작됩니다. (평균 시작시간일 뿐 서버 상황에 따라 지연될 수 있습니다)' },
  { question: '인스타그램 작업 기간은 얼마나 걸리나요?', answer: '각 상품별 주문 화면의 상품설명을 참조하시면 자세한 설명이 되어 있습니다.' },
  { question: '다른 업체와의 차이점이 궁금합니다.', answer: '계정 분석, 잠재 고객, 기술 지원 등 각 분야의 전문가들이 실시간 상담을 통해 서비스 이용이 원활하도록 도와드립니다.' },
  { question: '고객센터 운영시간은 어떻게 되나요?', answer: '월 ~ 금(10:00 - 19:00) / 점심시간(13:00 - 14:00) 모든 문의는 최대한 빨리 답변드릴 수 있도록 노력하겠습니다' },
];

const FaqItemComponent: React.FC<{ item: FaqItem; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-800 focus:outline-none"
    >
      <span>{item.question}</span>
      {isOpen ? <FaChevronUp className="text-blue-600" /> : <FaChevronDown className="text-gray-500" />}
    </button>
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
    >
      <div className="border-t border-gray-200 pt-4">
        <p className="text-gray-600">
          {item.answer}
        </p>
      </div>
    </div>
  </div>
);

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const half = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, half);
  const rightFaqs = faqs.slice(half);

  return (
    <section className="w-full bg-gray-50 py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-10 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            GRAMII에 대해
            <br />
            <span className="text-blue-600">궁금한 점이 있으신가요?</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            {leftFaqs.map((faq, index) => (
              <FaqItemComponent
                key={index}
                item={faq}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>
          <div className="space-y-8">
            {rightFaqs.map((faq, index) => {
              const originalIndex = index + half;
              return (
                <FaqItemComponent
                  key={originalIndex}
                  item={faq}
                  isOpen={openIndex === originalIndex}
                  onClick={() => handleToggle(originalIndex)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection; 
