import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = parseInt(id, 10);

  // TODO: 관리자만 접근 가능하도록 인증/인가 로직 추가 필요

  if (isNaN(userId)) {
    return NextResponse.json({ message: '유효하지 않은 사용자 ID입니다.' }, { status: 400 });
  }

  try {
    const query = `
      SELECT 
        pt.id,
        pt.user_id,
        pt.transaction_type,
        pt.amount,
        pt.related_order_id,
        pt.created_at,
        pt.balance_after_transaction,
        -- 관련 주문 정보 (있는 경우)
        o.order_status,
        o.quantity as order_quantity,
        o.total_price as order_total_price,
        s.name as service_name
      FROM point_transactions pt
      LEFT JOIN orders o ON pt.related_order_id = o.id
      LEFT JOIN services s ON o.service_id = s.id
      WHERE pt.user_id = $1
      ORDER BY pt.created_at DESC;
    `;
    
    const result = await pool.query(query, [userId]);
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error(`Error fetching point transactions for user ${userId}:`, error);
    return NextResponse.json({ message: '포인트 거래 내역 조회 중 오류가 발생했습니다.', error: (error as Error).message }, { status: 500 });
  }
} 
 