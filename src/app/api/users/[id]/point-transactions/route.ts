import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id, 10);

  // TODO: 관리자만 접근 가능하도록 인증/인가 로직 추가 필요

  if (isNaN(userId)) {
    return NextResponse.json({ message: '유효하지 않은 사용자 ID입니다.' }, { status: 400 });
  }

  try {
    const query = `
      SELECT 
        id,
        user_id,
        transaction_type,
        amount,
        related_order_id,
        -- description, -- DB에 description 컬럼이 없어 제거
        created_at,
        balance_after_transaction
      FROM point_transactions
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    
    const result = await pool.query(query, [userId]);
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error(`Error fetching point transactions for user ${userId}:`, error);
    return NextResponse.json({ message: '포인트 거래 내역 조회 중 오류가 발생했습니다.', error: (error as Error).message }, { status: 500 });
  }
} 
 