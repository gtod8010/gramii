import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const orderId = parseInt(idParam, 10);

  if (isNaN(orderId) || orderId <= 0) {
    return NextResponse.json({ message: '유효하지 않은 주문 ID입니다.' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. 주문 정보 조회
    const orderQuery = `
      SELECT o.id, o.user_id, o.total_price, o.order_status, u.points as current_user_points
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `;
    const orderResult = await client.query(orderQuery, [orderId]);

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: '주문을 찾을 수 없습니다.' }, { status: 404 });
    }

    const order = orderResult.rows[0];
    const { user_id, total_price, order_status, current_user_points } = order;
    
    // total_price를 숫자로 변환 (numeric 타입이므로)
    const totalPriceNum = parseFloat(total_price);

    // 2. 취소 가능한 상태인지 확인 (pending, in_progress만 취소 가능)
    if (!['pending', 'in_progress'].includes(order_status)) {
      await client.query('ROLLBACK');
      return NextResponse.json({ 
        message: `${order_status} 상태의 주문은 취소할 수 없습니다.` 
      }, { status: 400 });
    }

    // 3. 주문 상태를 'cancelled'로 변경
    const updateOrderQuery = `
      UPDATE orders 
      SET order_status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
    `;
    await client.query(updateOrderQuery, [orderId]);

    // 4. 사용자에게 포인트 환불
    const newUserPoints = current_user_points + totalPriceNum;
    const updateUserQuery = `
      UPDATE users 
      SET points = $1 
      WHERE id = $2
    `;
    await client.query(updateUserQuery, [newUserPoints, user_id]);

    // 5. 포인트 환불 거래 기록 추가
    const refundTransactionQuery = `
      INSERT INTO point_transactions (user_id, related_order_id, amount, transaction_type, balance_after_transaction)
      VALUES ($1, $2, $3, 'refund', $4)
    `;
    await client.query(refundTransactionQuery, [user_id, orderId, totalPriceNum, newUserPoints]);

    await client.query('COMMIT');

    return NextResponse.json({ 
      message: '주문이 성공적으로 취소되고 포인트가 환불되었습니다.',
      refundAmount: totalPriceNum,
      newBalance: newUserPoints
    }, { status: 200 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('주문 취소 중 오류 발생:', error);
    return NextResponse.json({ 
      message: '주문 취소 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  } finally {
    client.release();
  }
}
