"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React from "react";
import { statusDisplayNames, statusColors as chartStatusColors } from "@/lib/constants";

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
  
  // 데이터가 있는(0건 초과) 상태만 필터링합니다.
  const activeStatusEntries = Object.entries(orderStatusSummary)
    .filter(([, count]) => count > 0);
  
  // status key를 PascalCase로 변환하는 헬퍼 함수 (예: 'pending' -> 'Pending')
  // statusDisplayNames와 statusColors 객체의 키가 PascalCase일 가능성이 높기 때문입니다.
  const toPascalCase = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  // 필터링된 데이터를 기반으로 라벨, 시리즈, 색상을 생성합니다.
  const pieChartLabels = activeStatusEntries.map(([statusKey, ]) =>
    statusDisplayNames[toPascalCase(statusKey)] || statusKey
  );
  
  const pieChartSeries = activeStatusEntries.map(([, count]) => count);

  const pieChartColors = activeStatusEntries.map(([statusKey, ]) =>
    chartStatusColors[toPascalCase(statusKey)] || '#888888'
  );

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
      // 포매터 로직을 더 간단하게 수정합니다.
      formatter: function (val, opts) {
        const seriesName = opts.w.globals.labels[opts.seriesIndex];
        const count = opts.w.globals.series[opts.seriesIndex];
        return `${seriesName}: ${count}건`;
      },
    },
    tooltip: {
      y: {
        formatter: (value, { seriesIndex }) => {
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
