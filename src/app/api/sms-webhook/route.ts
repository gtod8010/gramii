import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

const WEBHOOK_SECRET = process.env.SMS_WEBHOOK_SECRET;

// 안드로이드 앱에서 보내는 요청 본문 타입
interface SmsWebhookPayload {
  from: string;
  body: string;
  receivedAt: string; // ISO 8601 형식의 문자열 (예: "2023-10-27T10:00:00Z")
}

// KB국민은행 입금 SMS 예시: "[KB국민] 06/18 15:30 444401-01-499150 입금 50,000원 홍길동"
// 위 예시를 파싱하기 위한 정규표현식
const KookminBankSmsRegex = /입금\s+([\d,]+)원\s+([^\s]+)/;

export async function POST(request: NextRequest) {
  // 1. 인증: 헤더의 Authorization 토큰 검증
  const authToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!WEBHOOK_SECRET || authToken !== WEBHOOK_SECRET) {
    console.warn('Unauthorized SMS webhook attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload: SmsWebhookPayload = await request.json();
    const { from, body } = payload;

    // 2. SMS 파싱: 입금액과 입금자명 추출
    const match = body.match(KookminBankSmsRegex);

    if (!match) {
      console.log(`SMS from ${from} did not match the expected format. Body: "${body}"`);
      return NextResponse.json({ message: 'SMS format not supported.' });
    }

    const amountStr = match[1].replace(/,/g, ''); // 쉼표 제거
    const amount = parseInt(amountStr, 10);
    const depositorName = match[2];

    if (isNaN(amount) || !depositorName) {
      console.error(`Failed to parse amount or name from SMS. Body: "${body}"`);
      return NextResponse.json({ error: 'Failed to parse SMS content.' }, { status: 400 });
    }

    // 3. DB에서 일치하는 충전 요청 검색
    const client = await pool.connect();
    let updatedRequest = null;

    try {
      // 최근 3일 내의 'pending' 상태 요청 중에서 입금액과 입금자명이 일치하는 건을 찾음
      const findRequestQuery = `
        SELECT id, user_id, amount, status
        FROM deposit_requests
        WHERE status = 'pending'
          AND amount = $1
          AND depositor_name = $2
          AND requested_at >= NOW() - INTERVAL '3 days'
        ORDER BY requested_at DESC
        LIMIT 1;
      `;
      const requestResult = await client.query(findRequestQuery, [amount, depositorName]);

      if (requestResult.rows.length === 0) {
        console.log(`No matching pending deposit request found for amount: ${amount}, name: ${depositorName}`);
        return NextResponse.json({ message: 'No matching request found.' });
      }

      const requestToProcess = requestResult.rows[0];
      const { id: requestId, user_id: userId } = requestToProcess;

      // 4. 트랜잭션으로 DB 업데이트
      await client.query('BEGIN');
      
      // 4-1. deposit_requests 상태를 'completed'로 변경
      const updateRequestQuery = `
        UPDATE deposit_requests
        SET status = 'completed', confirmed_at = NOW(), matched_tran_info = $1
        WHERE id = $2
        RETURNING *;
      `;
      const updateResult = await client.query(updateRequestQuery, [
        JSON.stringify(payload), // SMS 전체 내용을 저장
        requestId
      ]);
      updatedRequest = updateResult.rows[0];

      // 4-2. users 테이블의 포인트(잔액) 증가
      const updateUserQuery = 'UPDATE users SET points = points + $1 WHERE id = $2';
      await client.query(updateUserQuery, [amount, userId]);

      await client.query('COMMIT');

      console.log(`Successfully processed deposit request ID: ${requestId} for user ID: ${userId}. Amount: ${amount}`);

    } catch (dbError) {
      await client.query('ROLLBACK');
      console.error('Database transaction failed:', dbError);
      return NextResponse.json({ error: 'Database transaction failed.' }, { status: 500 });
    } finally {
      client.release();
    }
    
    return NextResponse.json({ 
      message: 'Recharge processed successfully.',
      processedRequest: updatedRequest 
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing SMS webhook:', error);
    return NextResponse.json({ error: 'Invalid request body or server error.' }, { status: 400 });
  }
} 
