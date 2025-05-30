import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { QueryResult } from 'pg';

interface UserSpecificPriceBody {
  service_id: number;
  custom_price: number;
}

// 특정 사용자의 모든 특별 단가 조회
export async function GET(request: NextRequest, { params }: { params: { id: string } }) { // userId -> id
  const userId = parseInt(params.id, 10); // userId -> id

  if (isNaN(userId)) {
    return NextResponse.json({ message: '유효하지 않은 사용자 ID입니다.' }, { status: 400 });
  }

  // TODO: 관리자 또는 해당 사용자 본인만 접근 가능하도록 인증/인가 로직 추가

  try {
    const query = `
      SELECT 
        usp.id,
        usp.user_id,
        usp.service_id,
        s.name as service_name,
        s.price_per_unit as base_price,
        usp.custom_price,
        usp.created_at,
        usp.updated_at
      FROM user_service_prices usp
      JOIN services s ON usp.service_id = s.id
      WHERE usp.user_id = $1
      ORDER BY s.name;
    `;
    const result: QueryResult = await pool.query(query, [userId]);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(`Error fetching user specific prices for user ${userId}:`, error);
    return NextResponse.json({ message: '사용자 특별 단가 조회 중 오류 발생', error: (error as Error).message }, { status: 500 });
  }
}

// 특정 사용자에게 서비스 특별 단가 설정 또는 업데이트 (UPSERT)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) { // userId -> id
  const userId = parseInt(params.id, 10); // userId -> id

  if (isNaN(userId)) {
    return NextResponse.json({ message: '유효하지 않은 사용자 ID입니다.' }, { status: 400 });
  }

  // TODO: 관리자만 접근 가능하도록 인증/인가 로직 추가

  try {
    const body: UserSpecificPriceBody = await request.json();
    const { service_id, custom_price } = body;

    if (!service_id || custom_price === undefined || custom_price === null) {
      return NextResponse.json({ message: 'service_id 와 custom_price 는 필수입니다.' }, { status: 400 });
    }
    if (custom_price < 0) {
        return NextResponse.json({ message: '가격은 0 이상이어야 합니다.'}, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const upsertQuery = `
        INSERT INTO user_service_prices (user_id, service_id, custom_price)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, service_id) 
        DO UPDATE SET 
          custom_price = EXCLUDED.custom_price,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;
      const result: QueryResult = await client.query(upsertQuery, [userId, service_id, custom_price]);
      
      await client.query('COMMIT');
      return NextResponse.json(result.rows[0], { status: 200 });

    } catch (dbError) {
      await client.query('ROLLBACK');
      console.error(`Database error setting user specific price for user ${userId}, service ${service_id}:`, dbError);
      if ((dbError as any).code === '23503') {
        return NextResponse.json({ message: '존재하지 않는 사용자 또는 서비스 ID입니다.' }, { status: 404 });
      }
      return NextResponse.json({ message: '데이터베이스 처리 중 오류 발생', error: (dbError as Error).message }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error processing request for user specific price:', error);
    return NextResponse.json({ message: '요청 처리 중 오류 발생', error: (error as Error).message }, { status: 400 });
  }
} 
