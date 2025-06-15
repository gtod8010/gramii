"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaInstagram, FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';

const mainIcons = [
  { Icon: FaInstagram, gradient: 'bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600', iconColor: 'text-white' },
  { Icon: FaFacebook, gradient: 'bg-gradient-to-b from-blue-500 to-blue-700', iconColor: 'text-white' },
  { Icon: FaYoutube, gradient: 'bg-gradient-to-b from-red-500 to-red-700', iconColor: 'text-white' },
  { Icon: FaTiktok, gradient: 'bg-black', iconColor: 'text-white' },
  { Icon: SiNaver, gradient: 'bg-[#03C75A]', iconColor: 'text-white' },
  { Icon: RiKakaoTalkFill, gradient: 'bg-[#FEE500]', iconColor: 'text-black' },
];

const ServiceSection: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const currentRef = sectionRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* 왼쪽 텍스트 및 아이콘 영역 */}
          <div className="text-left">
            <p className="text-sm font-bold uppercase tracking-widest mb-4">
              <span className="bg-gradient-to-tr from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent">
                SERVICE
              </span>
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              SNS, 단순한 홍보를 넘어 전략이 됩니다.
              <span className="block mt-2">
                <span className="bg-gradient-to-tr from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent">Gramii</span>는 브랜드 성장을 설계합니다.
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              여러 플랫폼을 번거롭게 넘나들 필요 없이
              <br/>
              한 곳에서 통합 관리하는 스마트 마케팅의 시작.
            </p>
            <div className="flex flex-wrap gap-4">
              {mainIcons.map(({ Icon, gradient, iconColor }, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all cursor-pointer ${gradient}`}>
                     <Icon className={`w-7 h-7 ${iconColor}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽 이미지 영역 */}
          <div className="hidden md:flex justify-center items-center">
              <Image 
                src="/images/service_phone.png" 
                alt="GRAMII 서비스 소개 이미지" 
                width={380}
                height={750}
                className="object-contain"
              />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection; 
