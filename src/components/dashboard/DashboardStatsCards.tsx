"use client";
import React from 'react';

// 임시 아이콘 컴포넌트 (실제 프로젝트에서는 적절한 아이콘 라이브러리나 SVG 파일을 사용)
const DollarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.219 12.768 11 12 11c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
);
const ChatBubbleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.68-3.091a1.993 1.993 0 00-1.029-.27H8.063M7.5 12V8.25A2.25 2.25 0 019.75 6h8.25a2.25 2.25 0 012.25 2.25v3.75a2.25 2.25 0 01-2.25 2.25h-1.5m-4.5-4.5H7.5m0-3.75h3.75m-3.75 0a1.125 1.125 0 01-1.125-1.125H3.375c-1.125 0-1.125.9-1.125 1.125v1.5c0 1.125.9 1.125 1.125 1.125h1.125c.621 0 1.125-.504 1.125-1.125V12zm-1.125 0c0-.621.504-1.125 1.125-1.125H7.5m0-3.75h3.75M7.5 12h3.75m-3.75 0a1.125 1.125 0 01-1.125-1.125H3.375c-1.125 0-1.125.9-1.125 1.125v1.5c0 1.125.9 1.125 1.125 1.125h1.125c.621 0 1.125-.504 1.125-1.125V12zm-1.125 0c0-.621.504-1.125 1.125-1.125H7.5" /></svg>
);

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, bgColorClass = 'bg-gray-100 dark:bg-gray-700' }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className={`flex items-center justify-center p-3 mr-4 rounded-full ${bgColorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

interface DashboardStatsCardsProps {
  currentPoints: number;
  totalSpent: number;
  totalOrders: number;
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ currentPoints, totalSpent, totalOrders }) => {
  const stats = [
    { 
      icon: <DollarIcon />, 
      title: "예치금 잔액", 
      value: `₩${currentPoints.toLocaleString()}`,
      bgColorClass: 'bg-green-100 dark:bg-green-700/50' 
    },
    { 
      icon: <DollarIcon />, 
      title: "총 사용금액", 
      value: `₩${totalSpent.toLocaleString()}`,
      bgColorClass: 'bg-blue-100 dark:bg-blue-700/50' 
    },
    { 
      icon: <ShoppingCartIcon />, 
      title: "총 주문", 
      value: totalOrders.toLocaleString(), 
      bgColorClass: 'bg-sky-100 dark:bg-sky-700/50' 
    },
    { 
      icon: <ChatBubbleIcon />, 
      title: "총 문의", 
      value: "0", // API에서 아직 제공 안함, 필요시 연동
      bgColorClass: 'bg-purple-100 dark:bg-purple-700/50' 
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} icon={stat.icon} title={stat.title} value={stat.value} bgColorClass={stat.bgColorClass} />
      ))}
    </div>
  );
};

export default DashboardStatsCards; 