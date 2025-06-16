'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

interface Logo {
    id: string;
    src: string;
    x: number;
    y: number;
    size: number;
}

const logos: Logo[] = [
  // 참고: 최종 위치(x, y)는 중앙 Gramii 로고를 (0, 0) 기준으로 한 상대 좌표입니다.
  // 애니메이션 시작 시 이 위치에서 얼마나 멀리 흩어질지는 `spread` 값으로 조절합니다.
  // size는 로고의 크기(px)입니다.
  { id: 'youtube', src: '/images/logos/youtube_logo.png', x: -780, y: -200, size: 100 },
  { id: 'threads', src: '/images/logos/thread_logo.png', x: -450, y: -250, size: 90 },
  { id: 'tiktok', src: '/images/logos/tiktok_logo.png', x: 20, y: -200, size: 90 },
  { id: 'naver', src: '/images/logos/naver_logo.png', x: -600, y: 140, size: 90 },
  { id: 'instagram', src: '/images/logos/instagram_logo.png', x: -350, y: 220, size: 110 },
  { id: 'facebook', src: '/images/logos/facebook_logo.png', x: -45, y: 190, size: 90 },
  { id: 'kakaotalk', src: '/images/logos/kakaotalk_logo.png', x: 320, y: 130, size: 110 },
];

const mainLogo = {
  id: 'gramii',
  src: '/images/logos/gramii_logo.png',
  width: 400,
  height: 150,
};

const containerVariants: Variants = {
  hidden: {},
  visible: {},
};

const logoVariants: Variants = {
  hidden: (logo: Logo) => ({
    x: logo.x,
    y: logo.y,
    scale: 1,
    opacity: 1,
  }),
  visible: (logo: Logo) => ({
    x: logo.x,
    y: logo.y,
    scale: 1,
    opacity: 1,
  }),
};

const mainLogoVariants: Variants = {
    hidden: { scale: 1, opacity: 1 },
    visible: {
      scale: 1,
      opacity: 1,
    },
  };

const HeroAnimation = () => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      <motion.div
        style={{ translateX: 200 }}
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 중앙 Gramii 로고 */}
        <motion.div
            className="z-10 absolute"
            style={{ 
                top: '50%', 
                left: '50%',
                translateX: `-${mainLogo.width / 1.2}px`, 
                translateY: `-${mainLogo.height / 2}px`,
                width: mainLogo.width,
                height: mainLogo.height,
            }}
            variants={mainLogoVariants}
        >
          <Image
            src={mainLogo.src}
            alt={mainLogo.id}
            width={mainLogo.width}
            height={mainLogo.height}
            priority
          />
        </motion.div>

        {/* 주변 SNS 로고들 */}
        {logos.map((logo) => (
          <motion.div
            key={logo.id}
            className="absolute"
            style={{
                top: '50%',
                left: '50%',
                translateX: `-${logo.size / 2}px`,
                translateY: `-${logo.size / 2}px`,
                width: logo.size,
                height: logo.size,
            }}
            custom={logo}
            variants={logoVariants}
          >
            <Image
              src={logo.src}
              alt={logo.id}
              width={logo.size}
              height={logo.size}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HeroAnimation; 
