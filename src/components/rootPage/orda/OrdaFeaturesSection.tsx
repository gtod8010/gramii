'use client';

import React from 'react';

const features = [
  {
    title: "간편한 주문방식",
    description: "쉽게 클릭 한번 으로 간편한 주문방식을 제공합니다.",
    icon: "🛒"
  },
  {
    title: "1:1 맞춤 상담",
    description: "1:1 맞춤 상담으로 원활한 서비스 사용이 가능합니다.",
    icon: "💬"
  },
  {
    title: "통합 마케팅",
    description: "인기마케팅 총 집합. 모든 마케팅은 오르다 에서 해결 가능합니다.",
    icon: "🚀"
  },
  {
    title: "업계 최저가",
    description: "자체 개발 서비스로 업계 최저가로 제공합니다.",
    icon: "💰"
  },
  {
    title: "24시간 자동 가동",
    description: "24시간 자동으로 주문 즉시 가동 합니다.",
    icon: "⏰"
  }
];

const OrdaFeaturesSection = () => {
    return (
        <section className="relative bg-black text-white py-20 md:py-28 overflow-hidden">
            {/* <div className="absolute inset-0 z-0 opacity-10">
                <Image
                    src="/images/logos/orda/SW.png"
                    alt="Orda Background Logo"
                    layout="fill"
                    objectFit="contain"
                    quality={100}
                />
            </div> */}
            <div className="container mx-auto px-6 md:px-10 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        빠르고 안전한 오르다를 경험해 보세요
                    </h2>
                    <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-gray-400">
                        <span>#차별화</span>
                        <span>#전문성</span>
                        <span>#다양한마케팅</span>
                        <span>#최저가</span>
                        <span>#24시간</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10 transition-all duration-300 hover:border-purple-500/80 hover:shadow-purple-500/20 hover:-translate-y-2">
                           <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-3 text-purple-300">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OrdaFeaturesSection; 
