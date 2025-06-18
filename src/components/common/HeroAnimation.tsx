'use client';

import React, { useEffect } from 'react';
import { motion, Variants, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';

interface Logo {
    id: string;
    src: string;
    x: string;
    y: string;
    size: string;
}

const logos: Logo[] = [
  // 참고: 최종 위치(x, y)는 중앙 Gramii 로고를 (0, 0) 기준으로 한 상대 좌표입니다.
  // 애니메이션 시작 시 이 위치에서 얼마나 멀리 흩어질지는 `spread` 값으로 조절합니다.
  // size는 로고의 크기(px)입니다.
  { id: 'youtube', src: '/images/logos/youtube_logo.png', x: '-45vw', y: '-14vw', size: '6vw' },
  { id: 'threads', src: '/images/logos/thread_logo.png', x: '-23vw', y: '-16vw', size: '5.5vw' },
  { id: 'tiktok', src: '/images/logos/tiktok_logo.png', x: '1vw', y: '-15vw', size: '6vw' },
  { id: 'naver', src: '/images/logos/naver_logo.png', x: '-35vw', y: '6vw', size: '5.5vw' },
  { id: 'instagram', src: '/images/logos/instagram_logo.png', x: '-20vw', y: '8vw', size: '6.5vw' },
  { id: 'facebook', src: '/images/logos/facebook_logo.png', x: '-1vw', y: '9vw', size: '5.5vw' },
  { id: 'kakaotalk', src: '/images/logos/kakaotalk_logo.png', x: '12vw', y: '4vw', size: '6.5vw' },
];

const mainLogo = {
  id: 'gramii',
  src: '/images/logos/gramii_logo.png',
  width: '28vw',
  height: 'auto',
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const logoVariants: Variants = {
    hidden: { 
        scale: 0.5, 
        opacity: 0 
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
};

const mainLogoVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
      },
    },
  };

const HeroAnimation = () => {
    // A motion value that tracks the viewport width
    const viewportWidth = useMotionValue(typeof window !== 'undefined' ? window.innerWidth : 1600);

    useEffect(() => {
        const handleResize = () => viewportWidth.set(window.innerWidth);
        // Set initial value after mount
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [viewportWidth]);

    // Create transformed motion values for the x-position of specific logos
    // This pushes them to the right when the screen is smaller than 1550px
    const youtubeX = useTransform(viewportWidth, [1024, 1549.9, 1550], ['-8.5vw', '-13vw', '-45vw']);
    const tiktokX = useTransform(viewportWidth, [1024, 1550], ['10vw', '1vw']);
    const naverX = useTransform(viewportWidth, [1024, 1550], ['-25vw', '-35vw']);
    // const threadsX = useTransform(viewportWidth, [1024, 1269.9, 1270], ['-10.5vw', '-10.5vw', '-27vw']);

    const getLogoXPosition = (logo: Logo) => {
        if (logo.id === 'youtube') return youtubeX;
        if (logo.id === 'tiktok') return tiktokX;
        if (logo.id === 'naver') return naverX;
        // if (logo.id === 'threads') return threadsX;
        return logo.x;
    };

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-square md:aspect-[1.5/1]">
      <motion.div
        className="w-full h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 중앙 Gramii 로고 */}
        <motion.div
            className="z-10 absolute"
            style={{ 
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            variants={mainLogoVariants}
        >
          <Image
            src={mainLogo.src}
            alt={mainLogo.id}
            width={500}
            height={180}
            style={{ width: mainLogo.width, height: mainLogo.height, maxWidth: '400px', minWidth: '250px' }}
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
                width: logo.size,
                height: logo.size,
                minWidth: '40px',
                minHeight: '40px',
                // Apply position directly here, using transformed values for specific logos
                x: getLogoXPosition(logo),
                y: logo.y,
            }}
            variants={logoVariants}
          >
            <Image
              src={logo.src}
              alt={logo.id}
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 10vw, 6vw"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HeroAnimation; 
