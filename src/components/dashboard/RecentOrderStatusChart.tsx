"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React from "react";
import { statusDisplayNames, chartStatusColors } from "@/lib/constants";

// react-apexcharts를 동적으로 임포트 (SSR 회피)
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// chartData prop의 타입 정의
interface ChartDataPoint {
  date: string; // 'MM-DD' 형식으로 예상
  pending: number;
  in_progress: number; // '진행중' 상태 추가
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

  // constants.ts의 키(소문자)와 일치시킴
  const barChartSeries = [
    { name: statusDisplayNames.completed, data: chartData.map(d => d.completed), color: chartStatusColors.completed },
    { name: statusDisplayNames.partial, data: chartData.map(d => d.partial), color: chartStatusColors.partial },
    { name: statusDisplayNames.processing, data: chartData.map(d => d.processing), color: chartStatusColors.processing },
    { name: statusDisplayNames.in_progress, data: chartData.map(d => d.in_progress), color: chartStatusColors.in_progress },
    { name: statusDisplayNames.pending, data: chartData.map(d => d.pending), color: chartStatusColors.pending },
    { name: statusDisplayNames.canceled, data: chartData.map(d => d.canceled), color: chartStatusColors.canceled },
  ].filter(series => series.name); // 이름이 없는(정의되지 않은) 시리즈는 필터링

  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    colors: barChartSeries.map(s => s.color),
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
        formatter: (value) => value ? value.toFixed(0) : '0'
      }
    },
    grid: { borderColor: '#e7e7e7', row: { colors: ['transparent', 'transparent'], opacity: 0.5 } },
    legend: { position: 'bottom', horizontalAlign: 'center', offsetY: 5, labels: { colors: '#6b7280' }, itemMargin: { horizontal: 10, vertical: 5 } },
    tooltip: { y: { formatter: (val) => val + "건" } }
  };

  // 2. 원그래프 데이터 및 옵션 (주문 상태 비율)
  // toPascalCase 헬퍼 함수 제거
  
  const activeStatusEntries = Object.entries(orderStatusSummary)
    .filter(([statusKey, count]) => count > 0 && statusDisplayNames[statusKey]); // 0건 초과 및 표시 이름이 있는 상태만 필터링
  
  const pieChartLabels = activeStatusEntries.map(([statusKey]) => statusDisplayNames[statusKey]);
  const pieChartSeries = activeStatusEntries.map(([, count]) => count);
  const pieChartColors = activeStatusEntries.map(([statusKey]) => chartStatusColors[statusKey] || '#888888');

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
