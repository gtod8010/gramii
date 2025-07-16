"use client";
import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

interface OrdaMetrics {
  orda_daily_orders?: number;
  orda_total_users?: number;
  [key: string]: number | undefined;
}

const OrdaStatsSection = () => {
  const [metrics, setMetrics] = useState<OrdaMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch('/api/main-metrics', { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data: OrdaMetrics = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching orda metrics:", error);
        // Set fallback data on error
        setMetrics({ orda_daily_orders: 4237, orda_total_users: 238000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const formatMembers = (num: number) => {
      if (num >= 10000) {
          return (num / 10000).toFixed(1) + '만명';
      }
      return num.toLocaleString() + '명';
  };

  return (
    <section className="relative bg-purple-50/10 py-20 md:py-28 text-white backdrop-blur-sm">
        <div className="container mx-auto px-6 md:px-10 text-center">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:mb-24">
                <div className="p-4">
                    <p className="text-sm uppercase tracking-widest text-gray-300 mb-2">TODAY&apos;S ORDER COUNT</p>
                    <p className="text-4xl md:text-5xl font-bold text-cyan-300">
                        {isLoading ? '...' : <CountUp end={metrics?.orda_daily_orders || 0} duration={2.5} separator="," />}건
                    </p>
                </div>
                <div className="p-4 border-t-2 border-b-2 md:border-t-0 md:border-b-0 md:border-l-2 md:border-r-2 border-white/20">
                    <p className="text-sm uppercase tracking-widest text-gray-300 mb-2">MEMBERS</p>
                    <p className="text-4xl md:text-5xl font-bold text-cyan-300">
                        {isLoading ? '...' : <CountUp end={metrics?.orda_total_users || 0} duration={2.5} formattingFn={formatMembers} />}
                    </p>
                </div>
                <div className="p-4">
                     <p className="text-sm uppercase tracking-widest text-gray-300 mb-2">EVALUATION</p>
                     <p className="text-4xl md:text-5xl font-bold text-cyan-300 flex items-center justify-center gap-2">
                        <FaStar className="text-yellow-400"/> 4.98 <span className="text-2xl text-gray-400">/ 5.0</span>
                    </p>
                </div>
            </div>

            {/* Central Content */}
            <div className="max-w-3xl mx-auto">
                <Image src="/images/logos/orda/1W.png" alt="Orda Logo" width={250} height={75} className="mx-auto mb-8" />
                 <p className="text-lg text-gray-200 mb-6">
                    우리는 &apos;오르는&apos; 순간을 만듭니다.
                    <br/><br/>
                    오르다는 SNS 성장 전문 브랜드입니다. 클릭 한 번이면 좋아요, 조회수, 팔로워가 자연스럽게 오르며, 보이지 않던 계정이 노출되고, 콘텐츠는 퍼지기 시작합니다.
                </p>
                <p className="text-2xl font-semibold text-cyan-300 italic">
                    &quot;오르다 로 쉽게 오르다&quot;
                </p>
            </div>
        </div>
    </section>
  );
};

export default OrdaStatsSection; 
