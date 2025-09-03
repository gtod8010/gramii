"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ym = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;

export default function SettlementPage() {
  const [month, setMonth] = useState(ym());
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{sales_total:number; vendor_cost_total:number; gross_margin:number; deposit_total:number;}|null>(null);
  const [series, setSeries] = useState<{month:string; sales_total:number; vendor_cost_total:number; deposit_total:number; gross_margin:number;}[]>([]);
  const [vendorRows, setVendorRows] = useState<{vendor_name:string; orders_cnt:number; vendor_total_cost:number;}[]>([]);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/settlement/summary?month=${month}`);
      const data = await res.json();
      if (res.ok) setSummary({
        sales_total: Number(data.sales_total||0),
        vendor_cost_total: Number(data.vendor_cost_total||0),
        gross_margin: Number(data.gross_margin||0),
        deposit_total: Number(data.deposit_total||0),
      });
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);
  useEffect(() => {
    const y = parseInt(month.slice(0,4), 10);
    (async () => {
      const res = await fetch(`/api/settlement/monthly-breakdown?year=${y}`);
      if (res.ok) {
        const data = await res.json();
        setSeries(data.items || []);
      }
    })();
  }, [month]);

  useEffect(() => {
    (async () => {
      // 벤더별 비용 분해 (선택된 월 기준)
      const res = await fetch(`/api/settlement/vendor-breakdown?month=${month}`);
      if (res.ok) {
        const data = await res.json();
        setVendorRows(data.items || []);
      }
    })();
  }, [month]);

  const cards = useMemo(() => ([
    {
      key: 'deposit',
      title: '입금 합계',
      value: summary?.deposit_total ?? 0,
      desc: '입금합계: 충전 처리가 완료된 금액의 월별 총합'
    },
    {
      key: 'vendor',
      title: '벤더 비용',
      value: summary?.vendor_cost_total ?? 0,
      desc: '벤더 비용: 주문을 통해 벤더사에 지불한 금액의 총합'
    },
    {
      key: 'margin',
      title: '예상 마진',
      value: summary ? ((summary.deposit_total ?? 0) - (summary.vendor_cost_total ?? 0)) : 0,
      desc: '예상 마진: 입금합계 - 벤더비용'
    },
  ]), [summary]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">정산 관리</h2>
        <input
          type="month"
          value={month}
          onChange={(e)=>setMonth(e.target.value)}
          className="border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.key} className="rounded border bg-white dark:bg-gray-900 dark:border-gray-800 p-4">
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <span>{card.title}</span>
              <InfoTooltip text={card.desc} />
            </div>
            <div className="mt-2 text-2xl font-semibold">{loading ? '…' : card.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* 월별 라인차트 */}
      <div className="rounded border bg-white dark:bg-gray-900 dark:border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">월별 추이 (매출 / 벤더비용 / 입금)</h3>
        <MonthlyLineChart items={series} />
      </div>

      {/* 벤더별 분해 테이블 */}
      <div className="rounded border bg-white dark:bg-gray-900 dark:border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">{month} 벤더별 비용</h3>
        <VendorBreakdownTable rows={vendorRows} />
      </div>
    </div>
  );
}

function InfoTooltip({ text }:{ text:string }){
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (!open) return;
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, [open]);

  return (
    <span className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ml-1 inline-flex items-center justify-center w-4 h-4 text-[10px] rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
        aria-label="정보"
        aria-expanded={open}
      >
        ?
      </button>
      {open && (
        <span className="absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap z-10 rounded bg-black/80 text-white text-xs px-2 py-1 shadow">
          {text}
        </span>
      )}
    </span>
  );
}

function MonthlyLineChart({ items }:{ items:{month:string; sales_total:number; vendor_cost_total:number; deposit_total:number; gross_margin:number;}[] }){
  const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
  const categories = items.map(i => i.month);
  const series = [
    { name: '매출', data: items.map(i => i.sales_total) },
    { name: '벤더비용', data: items.map(i => i.vendor_cost_total) },
    { name: '입금', data: items.map(i => i.deposit_total) },
  ];
  const options: ApexCharts.ApexOptions = {
    chart: { type: 'line', height: 320, toolbar: { show:false } },
    stroke: { curve: 'straight', width: 2 },
    xaxis: { categories },
    yaxis: { labels: { formatter: (v:number) => Math.round(v).toLocaleString() } },
    tooltip: { y: { formatter: (v:number)=> Math.round(v).toLocaleString() } },
  };
  return (
    <div className="max-w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <ReactApexChart type="line" options={options} series={series} height={320} />
      </div>
    </div>
  );
}

function VendorBreakdownTable({ rows }:{ rows:{vendor_name:string; orders_cnt:number; vendor_total_cost:number;}[] }){
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[600px] w-full text-sm">
        <thead>
          <tr className="text-left border-b dark:border-gray-800">
            <th className="py-2">벤더</th>
            <th className="py-2">주문 건수</th>
            <th className="py-2">벤더 비용 합계</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.vendor_name} className="border-b last:border-b-0 dark:border-gray-800">
              <td className="py-2">{r.vendor_name || '-'}</td>
              <td className="py-2">{r.orders_cnt.toLocaleString()}</td>
              <td className="py-2">{Math.round(r.vendor_total_cost).toLocaleString()}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td className="py-2 text-gray-500" colSpan={3}>데이터가 없습니다.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


