import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // JWT 토큰 검증 및 관리자 권한 확인
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const resolvedParams = await params;
    const requestId = parseInt(resolvedParams.id);
    if (isNaN(requestId)) {
      return NextResponse.json({ error: 'Invalid request ID' }, { status: 400 });
    }

    const { adminMemo } = await request.json();

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // 1. 충전 요청 정보 조회
      const getRequestQuery = `
        SELECT id, user_id, amount, status, depositor_name
        FROM deposit_requests
        WHERE id = $1
      `;
      const requestResult = await client.query(getRequestQuery, [requestId]);

      if (requestResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: '충전 요청을 찾을 수 없습니다.' }, { status: 404 });
      }

      const depositRequest = requestResult.rows[0];

      if (depositRequest.status !== 'pending') {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: `이미 처리된 요청입니다. 현재 상태: ${depositRequest.status}` }, 
          { status: 400 }
        );
      }

      // 2. 충전 요청 상태를 'completed'로 변경
      const updateRequestQuery = `
        UPDATE deposit_requests
        SET status = 'completed', 
            confirmed_at = NOW(),
            admin_memo = $1
        WHERE id = $2
        RETURNING *;
      `;
      const updateResult = await client.query(updateRequestQuery, [
        adminMemo || `관리자 수동 처리 (${decoded.email})`,
        requestId
      ]);

      // 3. 사용자 포인트 증가
      const updateUserQuery = `
        UPDATE users 
        SET points = points + $1 
        WHERE id = $2
        RETURNING points, name, email;
      `;
      const userUpdateResult = await client.query(updateUserQuery, [
        depositRequest.amount, 
        depositRequest.user_id
      ]);
      
      if (userUpdateResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
      }

      const updatedUser = userUpdateResult.rows[0];
      const finalBalance = updatedUser.points;

      // 4. 포인트 거래 내역 추가
      const transactionQuery = `
        INSERT INTO point_transactions (user_id, amount, transaction_type, balance_after_transaction, related_order_id)
        VALUES ($1, $2, 'deposit', $3, NULL)
        RETURNING *
      `;
      await client.query(transactionQuery, [
        depositRequest.user_id, 
        depositRequest.amount, 
        finalBalance
      ]);

      await client.query('COMMIT');

      console.log(`Manual recharge completed by admin ${decoded.email}: Request ID ${requestId}, User: ${updatedUser.name} (${updatedUser.email}), Amount: ${depositRequest.amount}`);

      return NextResponse.json({
        message: '충전이 완료되었습니다.',
        processedRequest: updateResult.rows[0],
        userInfo: {
          name: updatedUser.name,
          email: updatedUser.email,
          newBalance: finalBalance
        }
      }, { status: 200 });

    } catch (dbError) {
      await client.query('ROLLBACK');
      console.error('Database transaction failed during manual recharge:', dbError);
      return NextResponse.json({ error: 'Database transaction failed' }, { status: 500 });
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error in manual recharge completion:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
