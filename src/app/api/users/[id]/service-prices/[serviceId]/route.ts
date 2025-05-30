import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { QueryResult } from 'pg';

// 특정 사용자의 특정 서비스에 대한 특별 단가 삭제
export async function DELETE(request: NextRequest, { params }: { params: { id: string, serviceId: string } }) { // userId -> id
  const userId = parseInt(params.id, 10); // userId -> id
  const serviceId = parseInt(params.serviceId, 10);

  if (isNaN(userId) || isNaN(serviceId)) {
    return NextResponse.json({ message: '유효하지 않은 사용자 ID 또는 서비스 ID입니다.' }, { status: 400 });
  }

  // TODO: 관리자만 접근 가능하도록 인증/인가 로직 추가

  try {
    const deleteQuery = `
      DELETE FROM user_service_prices
      WHERE user_id = $1 AND service_id = $2
      RETURNING id;
    `;
    const result: QueryResult = await pool.query(deleteQuery, [userId, serviceId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: '삭제할 특별 단가 설정을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ message: '특별 단가가 성공적으로 삭제되었습니다.' }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting user specific price for user ${userId}, service ${serviceId}:`, error);
    return NextResponse.json({ message: '특별 단가 삭제 중 오류 발생', error: (error as Error).message }, { status: 500 });
  }
} 
