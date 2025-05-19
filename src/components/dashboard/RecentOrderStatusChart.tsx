"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React from "react";

// react-apexcharts를 동적으로 임포트 (SSR 회피)
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// chartData prop의 타입 정의
interface ChartDataPoint {
  date: string; // 'MM-DD' 형식으로 예상
  pending: number;
  processing: number;
  completed: number;
  canceled: number;
  refunded: number;
}

interface RecentOrderStatusChartProps {
  chartData: ChartDataPoint[];
}

const RecentOrderStatusChart: React.FC<RecentOrderStatusChartProps> = ({ chartData }) => {
  // chartData를 기반으로 series 데이터와 categories를 동적으로 생성
  const categories = chartData.map(data => data.date);
  const series = [
    {
      name: "완료", // "Completed"
      data: chartData.map(data => data.completed),
    },
    {
      name: "처리중", // "Processing"
      data: chartData.map(data => data.processing),
    },
    {
      name: "대기중", // "Pending"
      data: chartData.map(data => data.pending),
    },
    {
      name: "취소", // "Canceled"
      data: chartData.map(data => data.canceled),
    },
    {
      name: "환불", // "Refunded"
      data: chartData.map(data => data.refunded),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      }
    },
    // 색상: 완료(초록), 처리중(파랑), 대기중(주황), 취소(회색), 환불(보라) - 순서대로
    colors: ['#22c55e', '#3b82f6', '#f97316', '#6b7280', '#8b5cf6'], 
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    grid: {
      borderColor: '#e7e7e7', // Tailwind gray-200
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      categories: categories, // 동적으로 생성된 날짜
      labels: {
        style: {
          colors: '#6b7280', // Tailwind gray-500
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6b7280',
        },
        formatter: (value) => { return value ? value.toFixed(0) : '0'; }, // value가 undefined일 수 있으므로 체크
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      offsetY: 5,
      labels: {
        colors: '#6b7280',
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "건";
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
  };

  return (
    <div id="recent-order-status-chart" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      {/* chartData가 유효할 때만 차트 렌더링 */}
      {chartData && chartData.length > 0 ? (
        <ReactApexChart options={options} series={series} type="area" height={350} />
      ) : (
        <div className="flex items-center justify-center h-[350px]">
          <p className="text-gray-500">최근 주문 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default RecentOrderStatusChart; 