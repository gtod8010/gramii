"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React from "react";

// react-apexcharts를 동적으로 임포트 (SSR 회피)
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const RecentOrderStatusChart: React.FC = () => {
  // 이미지 2의 범례와 유사한 주문 상태 및 색상 정의
  const series = [
    {
      name: "완료됨",
      data: [30, 40, 35, 50, 49, 60, 70],
    },
    {
      name: "처리중",
      data: [20, 25, 30, 35, 40, 45, 50],
    },
    {
      name: "픽스중",
      data: [10, 15, 12, 18, 20, 22, 25],
    },
    {
      name: "대기중",
      data: [5, 8, 10, 12, 15, 13, 10],
    },
    {
      name: "부분완료됨",
      data: [3, 5, 4, 6, 8, 7, 9],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area', // 영역 차트 또는 'line'
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      }
    },
    colors: ['#22c55e', '#3b82f6', '#f97316', '#6b7280', '#8b5cf6'], // 완료(초록), 처리(파랑), 픽스(주황), 대기(회색), 부분(보라)
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['transparent', 'transparent'], // Alternating row colors
        opacity: 0.5
      },
    },
    xaxis: {
      categories: ['05-05', '05-06', '05-07', '05-08', '05-09', '05-10', '05-11'], // 예시 날짜
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
        formatter: (value) => { return value.toFixed(0); },
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
    // Tailwind CSS를 사용하여 다크 모드에서도 차트 배경이 잘 보이도록 수정
    <div id="recent-order-status-chart" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default RecentOrderStatusChart; 