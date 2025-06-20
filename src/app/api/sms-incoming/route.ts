import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// 안드로이드 앱에서 보내는 요청 본문 타입
interface SmsWebhookPayload {
  from: string;
  body: string;
  receivedAt: string; // ISO 8601 형식의 문자열 (예: "2023-10-27T10:00:00Z")
}

export async function POST(request: NextRequest) {
  // 인증 로직 제거
  try {
    const payload: SmsWebhookPayload = await request.json();
    const { from, body, receivedAt } = payload;
    
    const client = await pool.connect();
    let updatedRequest = null;

    try {
      // 1. 모든 수신 SMS를 sms_logs 테이블에 기록
      const logSmsQuery = `
        INSERT INTO sms_logs (sender, body, received_at_app)
        VALUES ($1, $2, $3);
      `;
      await client.query(logSmsQuery, [from, body, receivedAt]);

      // 2. 줄 단위로 파싱 (실제 KB국민은행 알림톡 포맷 대응)
      const lines = body.split('\n').map(line => line.trim()).filter(Boolean);
      let depositorName = '';
      let amount = NaN;
      if (lines.length >= 6) {
        depositorName = lines[3];
        const amountStr = lines[5].replace(/,/g, '');
        amount = parseInt(amountStr, 10);
      }

      if (!depositorName || isNaN(amount)) {
        console.log(`SMS from ${from} did not match the expected format. Body: "${body}"`);
        // 파싱 실패 시에도 로그는 남았으므로, 여기서 처리를 중단하고 응답합니다.
        return NextResponse.json({ message: 'SMS format not supported.' });
      }

      // 3. DB에서 일치하는 충전 요청 검색
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

      if (requestResult.rows.length > 0) {
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
      } else {
         console.log(`No matching pending deposit request found for amount: ${amount}, name: ${depositorName}`);
      }

    } catch (dbError) {
      await client.query('ROLLBACK');
      console.error('Database transaction failed:', dbError);
      return NextResponse.json({ error: 'Database transaction failed.' }, { status: 500 });
    } finally {
      client.release();
    }
    
    if (updatedRequest) {
      return NextResponse.json({ 
        message: 'Recharge processed successfully.',
        processedRequest: updatedRequest 
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'SMS logged, but no matching deposit request found.' });
    }

  } catch (error) {
    console.error('Error processing SMS webhook:', error);
    return NextResponse.json({ error: 'Invalid request body or server error.' }, { status: 400 });
  }
} 
