import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth'; // 실제 사용자 ID를 가져오는 함수

interface RechargeRequestPayload {
  amount: number;
  depositorName: string;
}

function getAppEnvConfig() {
  const appEnv = process.env.APP_ENV || 'development'; // 기본값은 개발 환경

  if (appEnv === 'production') {
    return {
      apiBaseUrl: process.env.OPEN_BANKING_API_BASE_URL_PROD,
      accessToken: process.env.OPEN_BANKING_ACCESS_TOKEN_PROD,
      fintechUseNum: process.env.OPEN_BANKING_FINTECH_USE_NUM_PROD,
      orgCode: process.env.OPEN_BANKING_ORG_CODE_PROD,
      isProduction: true,
    };
  } else { // development 또는 기타
    return {
      apiBaseUrl: process.env.OPEN_BANKING_API_BASE_URL_TEST,
      accessToken: process.env.OPEN_BANKING_ACCESS_TOKEN_TEST,
      fintechUseNum: process.env.OPEN_BANKING_FINTECH_USE_NUM_TEST,
      orgCode: process.env.OPEN_BANKING_ORG_CODE_TEST,
      isProduction: false,
    };
  }
}

// 은행거래고유번호 생성 함수 (이용기관코드(앞10자리) + 'U' + 이용기관부여번호(뒤9자리))
// 이용기관부여번호는 하루동안 유일성을 보장해야 함 (여기서는 현재 시간을 기반으로 생성)
function generateBankTranId() {
  const config = getAppEnvConfig();
  const orgCode = config.orgCode || 'M202501310'; // 기본값
  const uniqueNum = Date.now().toString().slice(-9);
  return `${orgCode}U${uniqueNum.padStart(9, '0')}`;
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: RechargeRequestPayload = await request.json();
    const { amount, depositorName } = body;

    if (!amount || !depositorName) {
      return NextResponse.json({ error: 'Amount and depositor name are required' }, { status: 400 });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    if (typeof depositorName !== 'string' || depositorName.trim() === '') {
      return NextResponse.json({ error: 'Invalid depositor name' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // deposit_requests 테이블이 있다고 가정합니다.
      // 필요한 컬럼: user_id, amount, depositor_name, status, requested_at, receipt_type
      const query = `
        INSERT INTO deposit_requests 
          (user_id, amount, depositor_name, status, requested_at, receipt_type)
        VALUES ($1, $2, $3, $4, NOW(), $5)
        RETURNING id, status, requested_at;
      `;
      
      const initialStatus = 'pending'; // 또는 'requested' 등 초기 상태값
      const receiptType = 'none';

      const result = await client.query(query, [
        userId,
        amount,
        depositorName.trim(),
        initialStatus,
        receiptType
      ]);

      return NextResponse.json({
        message: 'Recharge request submitted successfully.',
        request: result.rows[0]
      }, { status: 201 });

    } catch (dbError) {
      console.error('Database error while creating recharge request:', dbError);
      return NextResponse.json({ error: 'Failed to submit recharge request due to a database issue.' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error processing recharge request:', error);
    return NextResponse.json({ error: 'Invalid request payload or server error.' }, { status: 400 });
  }
} 
 