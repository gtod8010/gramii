"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import Image from 'next/image';
import CountUp from 'react-countup';
import ChatSimulation from '@/components/rootPage/ChatSimulation';
import ServiceSection from '@/components/rootPage/ServiceSection';
import ReviewsSection from '@/components/rootPage/ReviewsSection';
import FaqSection from '@/components/rootPage/FaqSection';

// Swiper 관련 임포트
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

// React Icons (FaInstagram은 이제 직접 구현하므로 제거 가능)
import {
  FaFacebook, FaYoutube, FaTiktok, FaFirefoxBrowser, FaXTwitter 
} from 'react-icons/fa6'; 
import { BsThreads } from "react-icons/bs"; 
import { SiNaver } from "react-icons/si";

// 커스텀 인스타그램 그라데이션 아이콘 컴포넌트
const InstagramGradientIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 448 512" {...props}>
    <defs>
      <linearGradient id="instagramGlobalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#f09433'}} />
        <stop offset="25%" style={{stopColor: '#e6683c'}} />
        <stop offset="50%" style={{stopColor: '#dc2743'}} />
        <stop offset="75%" style={{stopColor: '#cc2366'}} />
        <stop offset="100%" style={{stopColor: '#bc1888'}} />
      </linearGradient>
    </defs>
    <path 
      d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" 
      fill="url(#instagramGlobalGradient)" 
    />
  </svg>
);

interface PlatformItem {
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  iconGradient?: string; 
}

const platformData: PlatformItem[] = [
  { name: '인스타그램', description: '인기 게시물, 팔로워 증가 등', icon: InstagramGradientIcon }, 
  { name: '페이스북', description: '페이지 좋아요, 게시물 도달 등', icon: FaFacebook }, 
  { name: '유튜브', description: '구독자, 조회수, 좋아요 등', icon: FaYoutube, iconColor: '#FF0000' },
  { name: '틱톡', description: '팔로워, 조회수, 좋아요 등', icon: FaTiktok, iconColor: '#FE2C55' }, 
  { name: '스레드', description: '팔로워, 참여 유도 등', icon: BsThreads, iconColor: '#000000' },
  { name: '웹사이트', description: '트래픽 증가, SEO 최적화', icon: FaFirefoxBrowser }, 
  { name: '네이버', description: '블로그, 플레이스, 쇼핑 등', icon: SiNaver, iconColor: '#03C75A' },
  { name: '구 트위터', description: '팔로워, 리트윗, 참여 등', icon: FaXTwitter, iconColor: '#000000' },
];

// 카드 렌더링 컴포넌트
const PlatformCard: React.FC<{ item: PlatformItem }> = ({ item }) => {
  const iconBaseClassName = "w-12 h-12 md:w-16 md:h-16 mb-4";
  const iconProps: { className: string; style?: React.CSSProperties; fill?: string; } = {
    className: iconBaseClassName, 
  };

  if (item.icon === InstagramGradientIcon) {
    // InstagramGradientIcon은 자체 스타일을 가짐
  } else if (item.iconColor) { 
    iconProps.className = iconBaseClassName; 
    iconProps.style = { color: item.iconColor }; 
  } else {
    iconProps.className = `${iconBaseClassName} text-blue-500`;
  }

  return (
    <div 
      className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center w-full h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
    >
      <item.icon {...iconProps} /> 
      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
      <p className="text-xs md:text-sm text-gray-600 text-center">{item.description}</p>
    </div>
  );
};

interface MainPageMetrics {
  live_jobs?: number;
  daily_completed?: number;
  total_users?: number;
  [key: string]: number | undefined;
}

// 페이지의 메타데이터 (선택 사항)
// export const metadata = {
//   title: 'MyApp에 오신 것을 환영합니다',
//   description: '혁신적인 서비스로 당신의 삶을 변화시키세요.',
// };

const RootPage = () => {
  const [metrics, setMetrics] = useState<MainPageMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    // 필요하다면 router.push('/') 등을 사용하여 홈으로 이동하거나 페이지를 새로고침할 수 있습니다.
    window.location.reload();
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoadingMetrics(true);
        const response = await fetch('/api/main-metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data: MainPageMetrics = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching main page metrics:", error);
        setMetrics({ live_jobs: 11328, daily_completed: 4364, total_users: 19808 });
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full py-4 px-6 md:px-10 shadow-sm bg-white">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-28">
              <Image
                src="/images/gramii_logo.png"
                alt="GRAMII Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </Link>
          <div className="space-x-4 flex items-center">
            <Link href="/services" className="text-gray-600 hover:text-[var(--color-pink-500)] transition-colors">
              둘러보기
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-[var(--color-pink-500)] transition-colors">
                  서비스
                </Link>
                <Button 
                  variant="outline" 
                  size="md"
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-[var(--color-pink-500)] transition-colors">
                  로그인
                </Link>
                <Link href="/register" passHref legacyBehavior={false}>
                  <Button 
                    variant="primary" 
                    size="md" 
                    className="text-white bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 focus:ring-pink-500"
                  >
                    회원가입
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow bg-[radial-gradient(ellipse_at_top_right,_#2e1a47_20%,_#1a1033_50%,_#0a041a)] relative overflow-hidden">
        {/* 우주 별빛 효과 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:80px_80px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:160px_160px]"></div>
        
        <div className="container mx-auto px-6 md:px-10 py-24 md:py-36 flex items-center relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                이건 트렌드가 아니라 변화다
                <br />
                <span className="bg-gradient-to-tr from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent font-extrabold">SNS</span>가 마케팅의 중심, 
                <span className="bg-gradient-to-tr from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent font-extrabold"> GRAMII</span>
              </h1>
              <p className="text-lg text-gray-200 mb-8">
                  인플루언서도, 소상공인도, 마케팅 초보도 쉽게
                  좋아요, 팔로워, 댓글, 조회수까지 통합 관리.
                  이제 마케팅은 그래미 하나면 충분합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/services" passHref legacyBehavior={false}>
                  <Button 
                    variant="primary" 
                    size="md" 
                    className="w-full sm:w-auto bg-gradient-to-tr from-orange-400 via-red-500 to-pink-600 hover:from-orange-500 hover:via-red-600 hover:to-pink-700 text-white px-8 py-3 text-base border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    둘러보기
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image Content */}
            <div className="hidden md:flex justify-center items-center">
              <Image 
                src="/images/section.png" 
                alt="GRAMII 서비스 소개 이미지" 
                width={500}
                height={400}
                className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.2)]"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="bg-[var(--color-pink-500)] py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="p-4">
              <p className="text-4xl md:text-5xl font-bold mb-2">
                {isLoadingMetrics ? '...' : <CountUp end={metrics?.live_jobs || 0} duration={2.5} separator="," />}
              </p>
              <p className="text-sm uppercase tracking-wider">실시간 자동화 작업</p>
            </div>
            <div className="p-4 relative 
                          md:before:content-[''] md:before:absolute md:before:left-0 md:before:top-1/2 md:before:-translate-y-1/2 md:before:h-16 md:before:w-px md:before:bg-white/50 
                          md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/2 md:after:-translate-y-1/2 md:after:h-16 md:after:w-px md:after:bg-white/50">
              <p className="text-4xl md:text-5xl font-bold mb-2">
                {isLoadingMetrics ? '...' : <CountUp end={metrics?.daily_completed || 0} duration={2.5} separator="," />}
              </p>
              <p className="text-sm uppercase tracking-wider">일일 요청 처리량</p>
            </div>
            <div className="p-4">
              <p className="text-4xl md:text-5xl font-bold mb-2">
                {isLoadingMetrics ? '...' : <CountUp end={metrics?.total_users || 0} duration={2.5} separator="," />}
              </p>
              <p className="text-sm uppercase tracking-wider">총 GRAMII 이용자</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO? */}
      <section className="w-full bg-gray-100 py-16 md:py-24">
        <div className="container mx-auto text-center px-6 md:px-10">
          <h2 className="text-sm font-bold uppercase text-[var(--color-pink-500)] tracking-widest mb-4">
            What We Do?
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            GRAMII의 쉽고 빠른 마케팅을 경험해보세요.
          </p>

          {/* Swiper Carousel */}
          <div className="w-full">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 0,
                stretch: 80,
                depth: 200,
                modifier: 1,
                slideShadows: false,
              }}
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
              }}
              modules={[EffectCoverflow, Autoplay]}
              className="w-full py-20"
            >
              {platformData.map((item, index) => (
                <SwiperSlide key={index} className="!w-[250px] !h-[250px] md:!w-[280px] md:!h-[280px]">
                  <PlatformCard item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* 1:1 상담 섹션 */}
      <section className="w-full bg-gray-50 py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* 왼쪽 텍스트 영역 */}
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                언제 어디서든,
                <br />
                1:1 상담이 가능합니다.
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-10">
                궁금하신 사항은 담당 전문가와 1:1 상담을
                <br />
                통해 빠르게 해결할 수 있습니다.
              </p>
              <a
                href="http://pf.kakao.com/_aIRrn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent border border-gray-400 text-gray-800 hover:bg-gray-200 px-10 py-4 text-lg font-semibold rounded-md"
              >
                상담사 연결하기
              </a>
            </div>

            {/* 오른쪽 채팅 시뮬레이션 영역 */}
            <div className="w-full">
              <ChatSimulation />
            </div>
          </div>
        </div>
      </section>

      <ServiceSection />

      <ReviewsSection />

      <FaqSection />

      {/* Floating KakaoTalk Button */}
      <a
        href="http://pf.kakao.com/_aIRrn"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#FEE500] w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-[#FADA0A] transition-colors duration-300"
        title="카카오톡 실시간 상담"
      >
        <svg className="w-8 h-8 text-[#3C1E1E]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.486 2 2 5.589 2 10.007c0 2.434 1.371 4.59 3.445 5.924-.266 1.432-.93 4.22-1.195 5.253-.053.208.134.405.343.349 1.143-.304 3.988-1.42 4.96-1.895A9.972 9.972 0 0012 20c5.514 0 10-4.477 10-9.993C22 5.589 17.514 2 12 2z" />
        </svg>
      </a>
    </div>
  );
};

export default RootPage; 
