import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

function yearRangeKst(year?: number) {
  const y = year ?? new Date().getUTCFullYear();
  const startUtc = Date.UTC(y, 0, 1, -9, 0, 0);
  const endUtc = Date.UTC(y + 1, 0, 1, -9, 0, 0);
  return { y, startIso: new Date(startUtc).toISOString(), endIso: new Date(endUtc).toISOString() };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const yearParam = url.searchParams.get('year');
  const year = yearParam ? parseInt(yearParam, 10) : undefined;
  const { y, startIso, endIso } = yearRangeKst(year);

  const client = await pool.connect();
  try {
    const salesQuery = `
      SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS ym, COALESCE(SUM(total_price),0) AS v
      FROM orders
      WHERE created_at >= $1 AND created_at < $2
      GROUP BY 1 ORDER BY 1
    `;
    const vendorQuery = `
      SELECT to_char(date_trunc('month', o.created_at), 'YYYY-MM') AS ym,
             COALESCE(SUM(COALESCE(o.vendor_total_cost, (
               CASE 
                 WHEN s.external_id ~ '^\\d+$' THEN (
                   CASE 
                     WHEN (s.external_id::integer) >= 40000 THEN ((rs.rate/1000.0) * o.quantity)
                     WHEN (s.external_id::integer) >= 20000 THEN ((rs.rate/1000.0) * o.quantity)
                     ELSE ((rs.rate/1000.0) * o.quantity)
                   END
                 ) ELSE 0 END
             ))),0) AS v
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
      GROUP BY 1 ORDER BY 1
    `;
    const depositQuery = `
      SELECT to_char(date_trunc('month', confirmed_at), 'YYYY-MM') AS ym, COALESCE(SUM(amount),0) AS v
      FROM deposit_requests
      WHERE status='completed' AND confirmed_at >= $1 AND confirmed_at < $2
      GROUP BY 1 ORDER BY 1
    `;

    const [salesRes, vendorRes, depositRes] = await Promise.all([
      client.query(salesQuery, [startIso, endIso]),
      client.query(vendorQuery, [startIso, endIso]),
      client.query(depositQuery, [startIso, endIso])
    ]);

    const toMap = (rows: Array<{ym: string, v: string | number}>) => Object.fromEntries(rows.map(r => [r.ym, Number(r.v || 0)]));
    const salesMap = toMap(salesRes.rows);
    const vendorMap = toMap(vendorRes.rows);
    const depositMap = toMap(depositRes.rows);

    const ymList = Array.from({ length: 12 }, (_, i) => `${y}-${String(i + 1).padStart(2, '0')}`);
    const items = ymList.map(ym => ({
      month: ym,
      sales_total: salesMap[ym] ?? 0,
      vendor_cost_total: vendorMap[ym] ?? 0,
      deposit_total: depositMap[ym] ?? 0,
      gross_margin: (salesMap[ym] ?? 0) - (vendorMap[ym] ?? 0),
    }));

    return NextResponse.json({ year: y, items });
  } catch (error) {
    console.error('settlement monthly-breakdown error:', error);
    return NextResponse.json({ error: 'failed to get monthly breakdown' }, { status: 500 });
  } finally {
    client.release();
  }
}


