"use client"; // 클라이언트 컴포넌트로 변경

import React, { useState, useEffect } from 'react';
import { Metadata } from 'next';
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";
import RecentOrderStatusChart from "@/components/dashboard/RecentOrderStatusChart";
import DetailedOrderStatusSummary from "@/components/dashboard/DetailedOrderStatusSummary";
import { useUser } from '@/hooks/useUser';

// ChartDataPoint 인터페이스를 RecentOrderStatusChart.tsx에서 가져오거나 여기에 동일하게 정의
// 여기서는 RecentOrderStatusChart.tsx의 정의를 따른다고 가정합니다.
interface ChartDataPoint {
  date: string;
  pending: number;
  processing: number;
  completed: number;
  partial: number;
  canceled: number;
  refunded: number;
}

interface DashboardSummaryData {
  currentPoints: number;
  totalSpent: number;
  totalOrders: number;
  orderStatusSummary: Record<string, number>;
  recentOrderStatusChartData: ChartDataPoint[]; // 타입을 ChartDataPoint 배열로 수정
}

const DashboardPage = () => {
  const { user, isLoading: userIsLoading } = useUser();
  const [summaryData, setSummaryData] = useState<DashboardSummaryData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.id) {
      const fetchDashboardData = async () => {
        setIsLoadingData(true);
        setError(null);
        try {
          const response = await fetch(`/api/dashboard-summary?userId=${user.id}`);
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || '대시보드 요약 정보를 가져오는데 실패했습니다.');
          }
          const data: DashboardSummaryData = await response.json();
          setSummaryData(data);
        } catch (err: any) {
          console.error("Failed to fetch dashboard data:", err);
          setError(err.message);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchDashboardData();
    } else if (!userIsLoading) {
      setIsLoadingData(false);
      setError("사용자 정보를 불러올 수 없습니다. 로그인이 필요할 수 있습니다.");
    }
  }, [user, userIsLoading]);

  if (userIsLoading || isLoadingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg dark:text-white">대시보드 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 rounded-md">
        <p>오류: {error}</p>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-400">
        <p>대시보드 정보를 표시할 수 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <DashboardStatsCards
        currentPoints={summaryData.currentPoints}
        totalSpent={summaryData.totalSpent}
        totalOrders={summaryData.totalOrders}
      />
      <div className="mt-6 grid grid-cols-1 gap-6">
        <RecentOrderStatusChart 
          chartData={summaryData.recentOrderStatusChartData} 
          orderStatusSummary={summaryData.orderStatusSummary}
        />
      </div>
      <DetailedOrderStatusSummary orderStatusSummary={summaryData.orderStatusSummary} />
    </>
  );
};

export default DashboardPage;
