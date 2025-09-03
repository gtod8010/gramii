import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

function getMonthRangeKst(yyyyMm: string) {
  const [y, m] = yyyyMm.split('-').map(v => parseInt(v, 10));
  const startUtc = Date.UTC(y, m - 1, 1, -9, 0, 0);
  const endUtc = Date.UTC(y, m, 1, -9, 0, 0);
  return { startIso: new Date(startUtc).toISOString(), endIso: new Date(endUtc).toISOString() };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const month = url.searchParams.get('month');
  if (!month) return NextResponse.json({ error: 'month is required' }, { status: 400 });
  const { startIso, endIso } = getMonthRangeKst(month);

  const client = await pool.connect();
  try {
    const q = `
      SELECT 
        COALESCE(vendor_name, 
          CASE 
            WHEN s.external_id ~ '^\\d+$' AND (s.external_id::integer) >= 40000 THEN 'instamonster'
            WHEN s.external_id ~ '^\\d+$' AND (s.external_id::integer) >= 20000 THEN '2pm'
            WHEN s.external_id ~ '^\\d+$' THEN 'realsite'
            ELSE 'unknown'
          END
        ) AS vendor_name,
        COUNT(*) AS orders_cnt,
        COALESCE(SUM(COALESCE(o.vendor_total_cost, (
          CASE 
            WHEN s.external_id ~ '^\\d+$' THEN (
              CASE 
                WHEN (s.external_id::integer) >= 40000 THEN ((rs.rate/1000.0) * o.quantity)
                WHEN (s.external_id::integer) >= 20000 THEN ((rs.rate/1000.0) * o.quantity)
                ELSE ((rs.rate/1000.0) * o.quantity)
              END
            ) ELSE 0 END
        ))), 0) AS vendor_total_cost
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
      GROUP BY 1
      ORDER BY vendor_total_cost DESC
    `;
    const { rows } = await client.query(q, [startIso, endIso]);
    return NextResponse.json({ items: rows });
  } catch (e) {
    console.error('vendor breakdown error:', e);
    return NextResponse.json({ error: 'failed to get vendor breakdown' }, { status: 500 });
  } finally {
    client.release();
  }
}


