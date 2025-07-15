"use client";
import React from 'react';
import Image from 'next/image';
import OrdaHeroAnimation from './OrdaHeroAnimation';

const OrdaHeroSection = () => {
  return (
    <section className="relative bg-[#1A1033] text-white py-20 md:py-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>

      <div className="container mx-auto px-6 md:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Text Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <Image 
                src="/images/logos/orda/1W.png"
                alt="Orda Logo"
                width={200}
                height={60}
                priority
              />
            </div>
            <h1
              className="text-5xl md:text-7xl font-bold mb-4"
              style={{ textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #E60073, 0 0 40px #E60073' }}
            >
              CONNECT TO ORDA
            </h1>
            <p 
              className="text-2xl md:text-3xl font-semibold text-pink-400"
              style={{ textShadow: '0 0 8px #E60073, 0 0 10px #E60073' }}
            >
              UNTANGLE THE SNS WITH ORDA
            </p>
          </div>

          {/* Right Image/Icon collage */}
          <div className="relative h-96 hidden lg:flex items-center justify-center">
             <OrdaHeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrdaHeroSection; 
