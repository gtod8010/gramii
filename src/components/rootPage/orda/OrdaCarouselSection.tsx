"use client";

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const platformData = [
  { name: '인스타그램', icon: '/images/logos/instagram_logo.png' },
  { name: '유튜브', icon: '/images/logos/youtube_logo.png' },
  { name: '틱톡', icon: '/images/logos/tiktok_logo.png' },
  { name: '스레드', icon: '/images/logos/thread_logo.png' },
  { name: '페이스북', icon: '/images/logos/facebook_logo.png' },
  { name: '네이버', icon: '/images/logos/naver_logo.png' },
  { name: '카카오톡', icon: '/images/logos/kakaotalk_logo.png' },
];

const PlatformCard = ({ item }: { item: { name: string; icon: string } }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg h-full p-6 transition-transform duration-300 ease-in-out transform hover:scale-105">
      <div className="relative w-24 h-24 mb-4">
        <Image src={item.icon} alt={item.name} fill sizes="96px" style={{ objectFit: 'contain' }} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
    </div>
  );
};

const OrdaCarouselSection = () => {
  return (
    <section className="relative w-full py-20 md:py-28 bg-[#EBEBFF] overflow-hidden">
      <div className="container mx-auto text-center px-6 md:px-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            오르다에서 클릭 한번으로 오르다
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            검증된 노하우를 이제 오르다에서 경험해보세요.
          </p>
        </div>

        <div className="mt-12">
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
                delay: 1500,
                disableOnInteraction: false,
              }}
              modules={[EffectCoverflow, Autoplay]}
              className="w-full py-10"
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
  );
};

export default OrdaCarouselSection;
