import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth'; // 실제 사용자 ID를 가져오는 함수

interface RechargeRequestPayload {
  amount: number;
  depositorName: string;
  // receiptType: 'none'; // 현재는 항상 'none'이므로 요청 본문에 필수는 아님
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

interface VerifyRechargePayload {
  requestId: number;
}

export async function PATCH(request: NextRequest) {
  const adminUserId = await getUserIdFromRequest(request); // 관리자/시스템 호출자인지 확인 필요
  if (!adminUserId) { // TODO: 실제로는 관리자 권한을 확인해야 합니다.
    return NextResponse.json({ error: 'Unauthorized for this operation' }, { status: 403 });
  }

  try {
    const body: VerifyRechargePayload = await request.json();
    const { requestId } = body;

    if (!requestId || typeof requestId !== 'number') {
      return NextResponse.json({ error: 'Valid requestId is required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // 1. 충전 요청 정보 가져오기
      const requestQuery = 'SELECT id, user_id, amount, depositor_name, status, requested_at FROM deposit_requests WHERE id = $1';
      const requestResult = await client.query(requestQuery, [requestId]);

      if (requestResult.rows.length === 0) {
        return NextResponse.json({ error: 'Recharge request not found' }, { status: 404 });
      }

      const rechargeRequest = requestResult.rows[0];

      if (rechargeRequest.status !== 'pending') {
        return NextResponse.json({ error: `Request already processed with status: ${rechargeRequest.status}` }, { status: 409 });
      }

      const config = getAppEnvConfig();

      // 2. 오픈뱅킹 거래 내역 조회
      const accessToken = config.accessToken;
      const fintechUseNum = config.fintechUseNum;
      const apiBaseUrl = config.apiBaseUrl;

      if (!accessToken || !fintechUseNum || !apiBaseUrl) {
        let errorMessage = 'OpenBanking service not configured for the current environment:';
        if (!apiBaseUrl) errorMessage += ' API Base URL missing.';
        if (!accessToken) errorMessage += ' Access Token missing.';
        if (!fintechUseNum) errorMessage += ' Fintech Use Number missing.';
        console.error(errorMessage, `APP_ENV: ${process.env.APP_ENV}`);
        return NextResponse.json({ error: 'OpenBanking service configuration error.' }, { status: 500 });
      }

      const bankTranId = generateBankTranId();
      const inquiryType = 'I'; // 입금내역 조회
      
      // 조회 기간 설정 (요청 시간 기준 30분 전 ~ 10분 후)
      const requestedAt = new Date(rechargeRequest.requested_at);
      const fromDateTime = new Date(requestedAt.getTime() - 30 * 60 * 1000); // 30분 전
      const toDateTime = new Date(requestedAt.getTime() + 10 * 60 * 1000);   // 10분 후

      const formatDate = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, '');
      const formatTime = (date: Date) => date.toISOString().slice(11, 19).replace(/:/g, '');

      const fromDate = formatDate(fromDateTime);
      const fromTime = formatTime(fromDateTime);
      const toDate = formatDate(toDateTime);
      const toTime = formatTime(toDateTime);
      const sortOrder = 'D'; // 최신순 (Descending)
      const tranDtime = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);


      const openBankingUrl = new URL(`${apiBaseUrl}/v2.0/account/transaction_list/fin_num`);
      openBankingUrl.searchParams.append('bank_tran_id', bankTranId);
      openBankingUrl.searchParams.append('fintech_use_num', fintechUseNum);
      openBankingUrl.searchParams.append('inquiry_type', inquiryType);
      openBankingUrl.searchParams.append('inquiry_base', 'D'); // 일자 기준 (시간도 함께 사용됨)
      openBankingUrl.searchParams.append('from_date', fromDate);
      openBankingUrl.searchParams.append('from_time', fromTime);
      openBankingUrl.searchParams.append('to_date', toDate);
      openBankingUrl.searchParams.append('to_time', toTime);
      openBankingUrl.searchParams.append('sort_order', sortOrder);
      openBankingUrl.searchParams.append('tran_dtime', tranDtime);
      // page_record_cnt, next_page_yn 등 페이징 처리 필요 시 추가 구현

      console.log(`[${config.isProduction ? 'PROD' : 'TEST'}] Fetching transactions from OpenBanking: ${openBankingUrl.toString()}`);

      const obResponse = await fetch(openBankingUrl.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!obResponse.ok) {
        const errorData = await obResponse.json();
        console.error('OpenBanking API error:', errorData);
        return NextResponse.json({ error: 'Failed to fetch transaction list from OpenBanking', details: errorData.rsp_message || obResponse.statusText }, { status: obResponse.status });
      }

      const obResult = await obResponse.json();

      if (obResult.rsp_code !== 'A0000') {
        console.error('OpenBanking API non-A0000 response:', obResult);
        return NextResponse.json({ error: 'OpenBanking API returned an error', details: obResult.rsp_message }, { status: 400 });
      }
      
      // 3. 입금 내역 확인 및 매칭
      let matchedTransaction = null;
      if (obResult.res_list && obResult.res_list.length > 0) {
        for (const transaction of obResult.res_list) {
          // 입금자명(print_content 또는 다른 유사 필드)과 금액(tran_amt)이 일치하는지 확인
          // 주의: 실제 입금자명 필드는 API 응답 명세에 따라 다를 수 있으며, 부분 일치 등의 로직이 필요할 수 있습니다.
          // 여기서는 print_content에 입금자명이 포함되어 있고, tran_amt가 일치한다고 가정합니다.
          const transactionAmount = parseInt(transaction.tran_amt, 10);
          // 금융결제원 API 문서의 `print_content`는 통장인자내용을 의미합니다.
          // 실제 입금자명은 `branch_name` 등에 있을 수도 있고, `print_content`에 특정 패턴으로 포함될 수도 있습니다.
          // 여기서는 `print_content`에 `rechargeRequest.depositor_name`이 포함되는지 확인합니다.
          if (transaction.inout_type === '입금' &&
              transactionAmount === rechargeRequest.amount &&
              transaction.print_content && 
              transaction.print_content.includes(rechargeRequest.depositor_name)) {
            matchedTransaction = transaction;
            break;
          }
        }
      }

      if (!matchedTransaction) {
        return NextResponse.json({ error: 'Matching deposit transaction not found. Please check later or contact support.' }, { status: 404 });
      }

      // 4. DB 업데이트 (트랜잭션 사용)
      await client.query('BEGIN');
      try {
        const updateRequestQuery = 'UPDATE deposit_requests SET status = $1, confirmed_at = NOW(), matched_tran_info = $2 WHERE id = $3';
        await client.query(updateRequestQuery, ['completed', JSON.stringify(matchedTransaction) ,requestId]);

        const updateUserQuery = 'UPDATE users SET points = points + $1 WHERE id = $2';
        await client.query(updateUserQuery, [rechargeRequest.amount, rechargeRequest.user_id]);
        
        // (선택) 포인트 지급 내역을 별도 테이블에 기록 (예: user_point_transactions)

        await client.query('COMMIT');
        return NextResponse.json({ message: 'Recharge confirmed and points credited successfully.' });

      } catch (txError) {
        await client.query('ROLLBACK');
        console.error('Transaction error during recharge confirmation:', txError);
        return NextResponse.json({ error: 'Failed to update database during confirmation.' }, { status: 500 });
      }

    } catch (dbError) {
      console.error('Database connection or query error:', dbError);
      return NextResponse.json({ error: 'Database operation failed.' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error processing recharge confirmation:', error);
    // 요청 본문 파싱 오류 등
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid request or internal server error.' }, { status: 400 });
  }
} 
 