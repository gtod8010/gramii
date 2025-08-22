import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import crypto from 'crypto';

function getKstDateParts() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  return { y, m, d, iso: `${y}-${m}-${d}` };
}

export async function POST(req: NextRequest) {
  const siteVariant = process.env.NEXT_PUBLIC_SITE_VARIANT || 'gramii';
  const { iso: todayKst } = getKstDateParts();

  const cookiesIn = req.headers.get('cookie') || '';
  let visitorId = cookiesIn.split(';').map(v => v.trim()).find(v => v.startsWith('v_id='))?.split('=')[1] || '';

  // Fallback: IP+UA 해시
  const ip = req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0] || '';
  const ua = req.headers.get('user-agent') || '';
  const fallbackKey = crypto.createHash('sha256').update(`${ip}|${ua}`).digest('hex');

  if (!visitorId) {
    visitorId = crypto.randomUUID();
  }

  const visitorKey = visitorId || fallbackKey;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1) total_views 증가 (upsert)
    await client.query(
      `INSERT INTO page_views_daily(date, site_variant, unique_visitors, total_views)
       VALUES ($1, $2, 0, 1)
       ON CONFLICT(date, site_variant)
       DO UPDATE SET total_views = page_views_daily.total_views + 1, updated_at = NOW()`,
      [todayKst, siteVariant]
    );

    // 2) unique 방문자 체크 (충돌 시 오류 없이 무시)
    const insertFp = await client.query(
      `INSERT INTO visitor_daily_fingerprints(date, site_variant, visitor_key)
       VALUES ($1, $2, $3)
       ON CONFLICT (date, site_variant, visitor_key) DO NOTHING`,
      [todayKst, siteVariant, visitorKey]
    );
    const increasedUnique = (insertFp.rowCount ?? 0) > 0;

    if (increasedUnique) {
      await client.query(
        `UPDATE page_views_daily
         SET unique_visitors = unique_visitors + 1, updated_at = NOW()
         WHERE date = $1 AND site_variant = $2`,
        [todayKst, siteVariant]
      );
    }

    // 최종 값 조회
    const { rows } = await client.query(
      `SELECT unique_visitors, total_views FROM page_views_daily WHERE date=$1 AND site_variant=$2`,
      [todayKst, siteVariant]
    );

    await client.query('COMMIT');

    const res = NextResponse.json({ date: todayKst, site: siteVariant, unique_visitors: rows[0]?.unique_visitors || 0, total_views: rows[0]?.total_views || 0 });
    // 방문자 쿠키 설정(30일)
    res.cookies.set('v_id', visitorId, { path: '/', maxAge: 60 * 60 * 24 * 30, httpOnly: false, sameSite: 'lax' });
    return res;
  } catch (error: unknown) {
    try { await client.query('ROLLBACK'); } catch {}
    const message = error instanceof Error ? error.message : 'fail';
    console.error('track-visit error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    client.release();
  }
}


