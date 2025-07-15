"use client";
import React from "react";
import OrdaHeroSection from "./orda/OrdaHeroSection";
import OrdaNavbar from "./orda/OrdaNavbar";
import OrdaStatsSection from "./orda/OrdaStatsSection";
import OrdaCarouselSection from "./orda/OrdaCarouselSection";
import OrdaFeaturesSection from "./orda/OrdaFeaturesSection";
import OrdaReviewsSection from "./orda/OrdaReviewsSection";

const OrdaHomePage = () => {
  return (
    <div className="bg-[#1A1033] min-h-screen">
      <OrdaNavbar />
      <main>
        <OrdaHeroSection />
        <OrdaStatsSection />
        <OrdaCarouselSection />
        <OrdaFeaturesSection />
        <OrdaReviewsSection />
      </main>
      {/* 여기에 Orda의 다른 섹션들을 추가해나갈 예정입니다. */}
    </div>
  );
};

export default OrdaHomePage; 
