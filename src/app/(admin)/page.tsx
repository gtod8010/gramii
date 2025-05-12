import React from 'react';
import { Metadata } from 'next';
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";
import RecentOrderStatusChart from "@/components/dashboard/RecentOrderStatusChart";
import OrderStatusSummary from "@/components/dashboard/OrderStatusSummary";

export const metadata: Metadata = {
  title: "GRAMII 인스타광고",
  description: "GRAMII 인스타광고",
  // 다른 메타데이터 속성들...
};

const DashboardPage = () => {
  return (
    <>
      <DashboardStatsCards />
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentOrderStatusChart />
        <OrderStatusSummary />
      </div>
    </>
  );
};

export default DashboardPage;
