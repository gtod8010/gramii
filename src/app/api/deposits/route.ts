import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth'; // 사용자 ID를 가져오는 함수 (구현 필요)

// recharge/page.tsx의 RechargeHistoryItem 인터페이스와 유사하게 정의
interface DepositRequestItem {
  id: number;
  paymentMethod: string; // '무통장입금' 고정 또는 deposit_requests 테이블에 저장된 값
  amount: number;
  status: string; // deposit_requests.status
  depositDate: string; // deposit_requests.requested_at 또는 confirmed_at
  accountNumber?: string; // 계좌번호 필드 추가
  // 필요에 따라 depositorName 등 추가 필드 포함 가능
}

interface DepositsApiResponse {
  deposits: DepositRequestItem[];
  totalPages: number;
  currentPage: number;
  totalDeposits: number;
}

const ITEMS_PER_PAGE = 5; // recharge/page.tsx와 동일하게 설정

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || ITEMS_PER_PAGE.toString(), 10);
  const offset = (page - 1) * limit;

  try {
    const client = await pool.connect();
    try {
      // 전체 카운트 쿼리
      const countQuery = 'SELECT COUNT(*) FROM deposit_requests WHERE user_id = $1';
      const countResult = await client.query(countQuery, [userId]);
      const totalDeposits = parseInt(countResult.rows[0].count, 10);
      const totalPages = Math.ceil(totalDeposits / limit);

      // 실제 데이터 조회 쿼리
      // requested_at을 depositDate로 사용하고, status를 포함합니다.
      // paymentMethod는 현재 '무통장입금'으로 고정하거나, deposit_requests에 관련 필드가 있다면 사용합니다.
      const dataQuery = `
        SELECT 
          id, 
          amount, 
          status, 
          requested_at as "depositDate",
          depositor_name as "depositorName",
          account_number as "accountNumber"
        FROM deposit_requests 
        WHERE user_id = $1
        ORDER BY requested_at DESC
        LIMIT $2 OFFSET $3;
      `;
      const dataResult = await client.query(dataQuery, [userId, limit, offset]);

      const deposits: DepositRequestItem[] = dataResult.rows.map(row => ({
        id: row.id,
        paymentMethod: '무통장입금', // 현재는 고정값
        amount: row.amount,
        status: row.status,
        depositDate: row.depositDate.toISOString(), // ISO 문자열로 변환
        accountNumber: row.accountNumber, // 계좌번호 추가
        // depositorName: row.depositorName, // 필요시 추가
      }));

      const response: DepositsApiResponse = {
        deposits,
        totalPages,
        currentPage: page,
        totalDeposits,
      };

      return NextResponse.json(response);

    } catch (dbError) {
      console.error('Database error fetching deposit requests:', dbError);
      return NextResponse.json({ error: 'Failed to fetch deposit requests due to a database issue.' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error processing request for deposits:', error);
    return NextResponse.json({ error: 'Invalid request or server error.' }, { status: 400 });
  }
} 
 