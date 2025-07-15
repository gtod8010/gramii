'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const reviews = [
  { text: "빠르고 안전하게 구독자 늘었어요. 시간낭비 없이 만족 입니다 감사합니다!" },
  { text: "홍보 하기 힘들었는데 오르다 하나로 SNS 홍보 꽉 잡았네요 ㅎㅎ 몰랐던 시간이 아까워요!" },
  { text: "타사에 비해 계정 퀄리티 까지 좋아요bb 유령계정 NO~NO~" },
  { text: "오르다 덕분에 저희 브랜드 가치가 인플루언서 급으로 올라왔네요! 너무 편하고 좋아요" },
  { text: "문의 응답도 빠르고 작업 속도는 더 빠르네요. 앞으로 자주 이용할게요." },
  { text: "다른 곳과 비교불가입니다. 압도적인 퀄리티와 속도, 오르다 최고!" },
];

const scrollVariants: Variants = {
  animate: {
    y: ["0%", "-50%"],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 40,
        ease: "linear",
      },
    },
  },
};

const OrdaReviewsSection = () => {
  return (
    <section className="relative bg-black text-white py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="text-center lg:text-left">
            <Image 
              src="/images/logos/orda/TW.png" 
              alt="Orda Logo" 
              width={200} 
              height={50}
              className="mb-8 mx-auto lg:mx-0"
              style={{ width: 'auto', height: 'auto' }}
            />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              언제든 1:1 상담<br />가능합니다.
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              전문 상담사가 친절하고 빠르게 안내해드립니다.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
              상담사 연결하기
            </button>
          </div>

          {/* Right Column - Reviews */}
          <div className="relative h-[500px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
            <motion.div
              className="absolute top-0 w-full"
              variants={scrollVariants}
              animate="animate"
            >
              {[...reviews, ...reviews].map((review, index) => (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 p-5 rounded-2xl shadow-md mb-4 max-w-sm mx-auto">
                  <p className="text-gray-300">{review.text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrdaReviewsSection; 
