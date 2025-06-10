import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

interface PointsRequestBody {
  amount: number;       // 변경할 포인트 값 (양수 또는 음수)
  // action?: 'adjust' | 'set'; // 현재는 adjust만 사용. 필요시 확장
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  // TODO: 요청한 관리자 ID 가져오기 (예: 세션 또는 JWT 토큰에서)
  // const adminUserId = ...; 

  if (isNaN(userId)) {
    return NextResponse.json({ message: '유효하지 않은 사용자 ID입니다.' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const body: PointsRequestBody = await request.json();
    const { amount: diffAmount } = body; // 여기서 amount는 변경될 차이값을 의미

    if (typeof diffAmount !== 'number') {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: '포인트 값(amount)은 숫자여야 합니다.' }, { status: 400 });
    }

    const updateUserPointsQuery = `
      UPDATE users
      SET points = points + $1
      WHERE id = $2
      RETURNING id, name, email, points;
    `;
    const userUpdateResult = await client.query(updateUserPointsQuery, [diffAmount, userId]);

    if (userUpdateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: '해당 사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    const finalBalance = userUpdateResult.rows[0].points;

    // 포인트 변경 내역 기록
    const insertTransactionQuery = `
      INSERT INTO point_transactions (user_id, amount, transaction_type, balance_after_transaction) 
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    await client.query(insertTransactionQuery, [userId, diffAmount, 'admin_adjustment', finalBalance]);

    await client.query('COMMIT');

    return NextResponse.json({ 
      message: `사용자 ID ${userId}의 포인트가 성공적으로 업데이트되었습니다. 최종 잔액: ${finalBalance}`,
      user: userUpdateResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error updating points for user ${userId}:`, error);
    return NextResponse.json({ message: '포인트 업데이트 중 오류가 발생했습니다.', error: (error as Error).message }, { status: 500 });
  } finally {
    client.release();
  }
} 
 