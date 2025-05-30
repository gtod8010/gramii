"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React from "react";
import { statusDisplayNames } from "@/app/(admin)/order-history/page"; // 주문 상태 표시 이름을 가져옵니다.

// react-apexcharts를 동적으로 임포트 (SSR 회피)
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// chartData prop의 타입 정의
interface ChartDataPoint {
  date: string; // 'MM-DD' 형식으로 예상
  pending: number;
  processing: number;
  completed: number;
  partial: number;
  canceled: number;
  refunded: number;
}

interface RecentOrderStatusChartProps {
  chartData: ChartDataPoint[];
  orderStatusSummary: Record<string, number>;
}

// 색상 정의 (order-history 페이지와 일관성 유지 또는 여기서 직접 정의)
const chartStatusColors: { [key: string]: string } = {
  Pending: '#f97316',    // 주황 (대기중)
  Processing: '#3b82f6', // 파랑 (처리중)
  Completed: '#22c55e',  // 초록 (완료됨)
  Partial: '#8b5cf6',    // 보라 (부분완료됨)
  Cancelled: '#6b7280',  // 회색 (취소됨)
  // Refunded는 현재 사용 안함
};

const RecentOrderStatusChart: React.FC<RecentOrderStatusChartProps> = ({ chartData, orderStatusSummary }) => {
  // 1. 막대그래프 데이터 및 옵션 (최근 7일간 주문 상태)
  const barChartCategories = chartData.map(data => data.date);
  const barChartSeries = [
    { name: statusDisplayNames.Completed || "완료", data: chartData.map(d => d.completed), color: chartStatusColors.Completed },
    { name: statusDisplayNames.Processing || "처리중", data: chartData.map(d => d.processing), color: chartStatusColors.Processing },
    { name: statusDisplayNames.Pending || "대기중", data: chartData.map(d => d.pending), color: chartStatusColors.Pending },
    { name: statusDisplayNames.Partial || "부분완료됨", data: chartData.map(d => d.partial), color: chartStatusColors.Partial },
    { name: statusDisplayNames.Cancelled || "취소", data: chartData.map(d => d.canceled), color: chartStatusColors.Cancelled },
    // refunded는 현재 데이터에 없으므로 제외
  ];

  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true, // 누적 막대 그래프
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    colors: barChartSeries.map(s => s.color), // 시리즈별 색상 직접 지정
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: barChartCategories,
      labels: { style: { colors: '#6b7280' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#6b7280' },
        formatter: (value) => { return value ? value.toFixed(0) : '0'; }
      }
    },
    grid: { borderColor: '#e7e7e7', row: { colors: ['transparent', 'transparent'], opacity: 0.5 } },
    legend: { position: 'bottom', horizontalAlign: 'center', offsetY: 5, labels: { colors: '#6b7280' }, itemMargin: { horizontal: 10, vertical: 5 } },
    tooltip: { y: { formatter: (val) => val + "건" } }
  };

  // 2. 원그래프 데이터 및 옵션 (주문 상태 비율)
  const pieChartLabels = Object.keys(orderStatusSummary)
    .map(statusKey => statusDisplayNames[statusKey] || statusKey)
    .filter(label => (orderStatusSummary[Object.keys(statusDisplayNames).find(key => statusDisplayNames[key] === label) || ''] || 0) > 0); // 건수가 0인 항목은 제외
  
  const pieChartSeries = Object.keys(orderStatusSummary)
    .map(statusKey => orderStatusSummary[statusKey] || 0)
    .filter((count, index) => (orderStatusSummary[Object.keys(orderStatusSummary)[index]] || 0) > 0); // 건수가 0인 항목은 시리즈에서도 제외

  const pieChartColors = Object.keys(orderStatusSummary)
    .filter(statusKey => (orderStatusSummary[statusKey] || 0) > 0)
    .map(statusKey => chartStatusColors[statusKey] || '#000000');

  const pieChartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      height: 350,
      toolbar: { show: false }
    },
    labels: pieChartLabels,
    colors: pieChartColors,
    legend: { position: 'bottom', horizontalAlign: 'center', offsetY: 5, labels: { colors: '#6b7280' }, itemMargin: { horizontal: 10, vertical: 5 } },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const seriesName = opts.w.globals.labels[opts.seriesIndex];
        const actualStatusKey = Object.keys(statusDisplayNames).find(key => statusDisplayNames[key] === seriesName);
        const count = actualStatusKey ? orderStatusSummary[actualStatusKey] : '' ;
        return `${seriesName}: ${count}건 (${Number(val).toFixed(1)}%)`;
      },
    },
    tooltip: {
      y: {
        formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
          const label = pieChartLabels[seriesIndex] || '' ; 
          return `${label}: ${value}건`;
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: '총 주문',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0) + '건';
      }
            }
          }
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">최근 주문 현황</h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">주간 주문 상태 (건)</h4>
      {chartData && chartData.length > 0 ? (
            <ReactApexChart options={barChartOptions} series={barChartSeries} type="bar" height={350} />
      ) : (
        <div className="flex items-center justify-center h-[350px]">
              <p className="text-gray-500">주간 주문 데이터가 없습니다.</p>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">주문 상태 비율 (%)</h4>
          {pieChartSeries.length > 0 ? (
            <ReactApexChart options={pieChartOptions} series={pieChartSeries} type="donut" height={350} />
          ) : (
            <div className="flex items-center justify-center h-[350px]">
              <p className="text-gray-500">주문 상태 요약 데이터가 없습니다.</p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrderStatusChart; 
