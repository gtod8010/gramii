"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button/Button';
import CountUp from 'react-countup';
import { FaThumbsUp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const OrdaHeroAnimation = () => {
  const [instaKey, setInstaKey] = useState(0);
  const [kakaoKey, setKakaoKey] = useState(0);

  const restartInsta = () => {
    setTimeout(() => setInstaKey(prevKey => prevKey + 1), 2000);
  };

  const restartKakao = () => {
    setTimeout(() => setKakaoKey(prevKey => prevKey + 1), 2000);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central Text & Button as reference */}
      <div className="relative z-10 text-center">
        <h3 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-cyan-300 to-white bg-clip-text text-transparent" style={{ textShadow: '0 0 12px rgba(0, 255, 255, 0.4)' }}>
          오르다
          <br />
          <span className="text-4xl">로</span>
          <br />
          오르다
        </h3>
        <Button 
          variant="primary" 
          size="md"
          className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        >
          ORDA 광고 시작하기
        </Button>
      </div>

      {/* --- Surrounding Icons --- */}

      {/* Instagram Group */}
      <div className="absolute top-1/2 left-1/2 -translate-x-[14rem] -translate-y-[6rem] animate-float">
        <Image src="/images/logos/instagram_logo.png" width={80} height={80} alt="instagram icon" className="drop-shadow-lg" />
        <div className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-red-500 rounded-full animate-pulse-bubble text-white font-bold text-sm">
           <CountUp key={instaKey} end={12} duration={15} onEnd={restartInsta} />
        </div>
      </div>
      
      {/* Youtube */}
      <div className="absolute top-1/2 left-1/2 translate-x-[8rem] -translate-y-[10rem] animate-float animation-delay-500">
        <Image src="/images/logos/youtube_logo.png" width={90} height={63} alt="youtube icon" className="drop-shadow-lg" />
      </div>

      {/* TikTok */}
      <div className="absolute top-1/2 left-1/2 translate-x-[14rem] -translate-y-[1rem] animate-float animation-delay-700">
        <Image src="/images/logos/tiktok_logo.png" width={60} height={60} alt="tiktok icon" className="drop-shadow-lg" />
      </div>

      {/* Naver */}
      <div className="absolute top-1/2 left-1/2 -translate-x-[16rem] translate-y-[6rem] animate-float animation-delay-1000">
        <Image src="/images/logos/naver_logo.png" width={80} height={80} alt="naver icon" className="drop-shadow-lg" />
      </div>

      {/* KakaoTalk */}
      <div className="absolute top-1/2 left-1/2 translate-x-[10rem] translate-y-[8rem] animate-float animation-delay-1500">
         <Image src="/images/logos/kakaotalk_logo3.png" width={70} height={70} alt="kakaotalk icon" className="drop-shadow-lg" />
         <div className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center bg-blue-500 rounded-full text-white font-bold text-sm">
            <CountUp key={kakaoKey} end={33} duration={15} delay={1} onEnd={restartKakao} />
         </div>
      </div>

      {/* Threads */}
       <div className="absolute top-1/2 left-1/2 translate-x-[-5em] -translate-y-[13rem] animate-float animation-delay-2000">
        <Image src="/images/logos/thread_logo.png" width={50} height={50} alt="threads icon" className="drop-shadow-lg" />
      </div>
      
      {/* Floating 'Like' Icons using Framer Motion */}
      <motion.div
        className="absolute top-1/2 left-1/2 translate-x-2 -translate-y-24"
        animate={{
          y: [0, -80],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "linear" }}
      >
        <FaThumbsUp className="text-blue-500 text-xl" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 translate-x-8 -translate-y-32"
        animate={{
          y: [0, -80],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <FaThumbsUp className="text-blue-500 text-xl" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 translate-x-12 -translate-y-20"
        animate={{
          y: [0, -80],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 3, delay: 2.5, repeat: Infinity, ease: "linear" }}
      >
        <FaThumbsUp className="text-blue-500 text-xl" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-6 -translate-y-28"
        animate={{
          y: [0, -80],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 3, delay: 0.8, repeat: Infinity, ease: "linear" }}
      >
        <FaThumbsUp className="text-blue-500 text-xl" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-10 -translate-y-22"
        animate={{
          y: [0, -80],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 3, delay: 1.8, repeat: Infinity, ease: "linear" }}
      >
        <FaThumbsUp className="text-blue-500 text-xl" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 translate-x-14 -translate-y-30"
        animate={{
          y: [0, -80],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 3, delay: 2.8, repeat: Infinity, ease: "linear" }}
      >
        <FaThumbsUp className="text-blue-500 text-xl" />
      </motion.div>
    </div>
  );
};

export default OrdaHeroAnimation;
