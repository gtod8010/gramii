import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

function getMonthRangeKst(yyyyMm?: string) {
  const now = new Date();
  const [y, m] = (yyyyMm || `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`).split('-').map(v => parseInt(v, 10));
  const startUtc = Date.UTC(y, m - 1, 1, -9, 0, 0); // KST 자정 기준으로 월 시작, UTC 보정(-9h)
  const endUtc = Date.UTC(y, m, 1, -9, 0, 0); // 다음달 1일 KST 자정
  return { startIso: new Date(startUtc).toISOString(), endIso: new Date(endUtc).toISOString(), y, m };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const month = url.searchParams.get('month') || undefined; // YYYY-MM

  const { startIso, endIso, y, m } = getMonthRangeKst(month);

  const client = await pool.connect();
  try {
    // 매출 합계: orders.total_price 월 합
    const salesQuery = `
      SELECT COALESCE(SUM(total_price), 0) AS sales
      FROM orders
      WHERE created_at >= $1 AND created_at < $2
    `;
    const salesRes = await client.query(salesQuery, [startIso, endIso]);
    const salesTotal = Number(salesRes.rows[0]?.sales || 0);

    // 벤더 비용: snapshot 우선, 없으면 계산식으로 보정
    const vendorQuery = `
      SELECT COALESCE(SUM(vendor_total_cost), 0) AS vendor
      FROM orders
      WHERE created_at >= $1 AND created_at < $2
    `;
    const vendorRes = await client.query(vendorQuery, [startIso, endIso]);
    const vendorTotalSnap = Number(vendorRes.rows[0]?.vendor || 0);

    // 스냅샷 누락분(이전 주문 등)에 대한 보정치
    const vendorBackfillQuery = `
      SELECT COALESCE(SUM(
        CASE 
          WHEN o.vendor_total_cost IS NOT NULL THEN 0
          ELSE (
            CASE 
              WHEN s.external_id ~ '^\\d+$' THEN (
                CASE 
                  WHEN (s.external_id::integer) >= 40000 THEN ((rs.rate/1000.0) * o.quantity)
                  WHEN (s.external_id::integer) >= 20000 THEN ((rs.rate/1000.0) * o.quantity)
                  ELSE ((rs.rate/1000.0) * o.quantity)
                END
              ) 
              ELSE 0
            END
          )
        END
      ), 0) AS vendor_backfill
      FROM orders o
      JOIN services s ON o.service_id = s.id
      LEFT JOIN realsite_services rs ON (
        CASE 
          WHEN s.external_id ~ '^\\d+$' AND (s.external_id::integer) >= 40000 THEN (s.external_id::integer) - 40000
          WHEN s.external_id ~ '^\\d+$' AND (s.external_id::integer) >= 20000 THEN (s.external_id::integer) - 20000
          WHEN s.external_id ~ '^\\d+$' THEN (s.external_id::integer)
          ELSE NULL
        END
      ) = rs.realsite_service_id
      WHERE o.created_at >= $1 AND o.created_at < $2
    `;
    const vendorBackfillRes = await client.query(vendorBackfillQuery, [startIso, endIso]);
    const vendorBackfill = Number(vendorBackfillRes.rows[0]?.vendor_backfill || 0);

    const vendorTotal = Math.floor(vendorTotalSnap + vendorBackfill);

    // 입금 합계: deposit_requests.confirmed_at 월 합
    const depositQuery = `
      SELECT COALESCE(SUM(amount), 0) AS deposits
      FROM deposit_requests
      WHERE status = 'completed' AND confirmed_at >= $1 AND confirmed_at < $2
    `;
    const depositRes = await client.query(depositQuery, [startIso, endIso]);
    const depositTotal = Number(depositRes.rows[0]?.deposits || 0);

    const grossMargin = Math.floor(salesTotal - vendorTotal);

    return NextResponse.json({
      month: `${y}-${String(m).padStart(2, '0')}`,
      sales_total: salesTotal,
      vendor_cost_total: vendorTotal,
      gross_margin: grossMargin,
      deposit_total: depositTotal,
    });
  } catch (error) {
    console.error('settlement summary error:', error);
    return NextResponse.json({ error: 'failed to get settlement summary' }, { status: 500 });
  } finally {
    client.release();
  }
}


