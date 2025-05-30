import { NextRequest, NextResponse } from 'next/server';
import { getOpenBankingEnvConfig } from '@/lib/openBankingConfig'; // 수정된 경로

// 은행거래고유번호 생성 함수 (이용기관코드(앞10자리) + 'U' + 이용기관부여번호(뒤9자리))
// 이용기관부여번호는 하루동안 유일성을 보장해야 함 (여기서는 현재 시간을 기반으로 생성)
function generateBankTranIdForTransaction() { // 함수 이름 충돌 방지
  const config = getOpenBankingEnvConfig();
  const orgCode = config.orgCode || 'M202501310'; // 기본값
  const uniqueNum = Date.now().toString().slice(-9);
  return `${orgCode}U${uniqueNum.padStart(9, '0')}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // 요청 파라미터에서 필요한 값들을 가져옵니다.
  // 예: 조회할 계좌의 핀테크이용번호, 조회 기간 등
  // 이 API의 정확한 요청 파라미터는 현재 파일의 기존 로직을 확인해야 합니다.
  // 여기서는 fintech_use_num, from_date, to_date 등을 받는다고 가정합니다.
  const fintech_use_num_param = searchParams.get('fintech_use_num');
  const from_date_param = searchParams.get('from_date'); // YYYYMMDD
  const to_date_param = searchParams.get('to_date');     // YYYYMMDD
  const inquiry_type_param = searchParams.get('inquiry_type') || 'A'; // A:전체, I:입금, O:출금
  const sort_order_param = searchParams.get('sort_order') || 'D'; // D:최신순

  const config = getOpenBankingEnvConfig();

  // AccessToken은 이 API를 호출하는 주체가 이미 가지고 있거나,
  // 특정 사용자의 토큰을 DB 등에서 조회해서 사용해야 합니다.
  // 여기서는 요청 헤더에서 받는다고 가정하거나, config의 것을 임시로 사용합니다.
  let accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    accessToken = config.accessToken; // config의 토큰을 fallback으로 사용 (주의: 어떤 사용자의 토큰인지 명확해야 함)
  }
  
  const fintechUseNumToQuery = fintech_use_num_param || config.fintechUseNum; // 파라미터 우선, 없으면 config 값

  if (!accessToken || !fintechUseNumToQuery || !config.apiBaseUrl) {
    let errorMessage = 'OpenBanking transactions config/param missing:';
    if (!config.apiBaseUrl) errorMessage += ' API Base URL missing.';
    if (!accessToken) errorMessage += ' Access Token missing (from header or config).';
    if (!fintechUseNumToQuery) errorMessage += ' Fintech Use Number missing (from param or config).';
    console.error(errorMessage, `APP_ENV: ${process.env.APP_ENV}`);
    return NextResponse.json({ error: 'OpenBanking service configuration or parameter error.' }, { status: 500 });
  }

  if (!from_date_param || !to_date_param) {
    return NextResponse.json({ error: 'from_date and to_date parameters are required.' }, { status: 400 });
  }

  try {
    const bankTranId = generateBankTranIdForTransaction();
    const tranDtime = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);

    const openBankingUrl = new URL(`${config.apiBaseUrl}/v2.0/account/transaction_list/fin_num`);
    openBankingUrl.searchParams.append('bank_tran_id', bankTranId);
    openBankingUrl.searchParams.append('fintech_use_num', fintechUseNumToQuery);
    openBankingUrl.searchParams.append('inquiry_type', inquiry_type_param);
    openBankingUrl.searchParams.append('inquiry_base', 'D'); 
    openBankingUrl.searchParams.append('from_date', from_date_param);
    openBankingUrl.searchParams.append('to_date', to_date_param);
    openBankingUrl.searchParams.append('sort_order', sort_order_param);
    openBankingUrl.searchParams.append('tran_dtime', tranDtime);
    // from_time, to_time 등 필요시 추가

    console.log(`[${config.isProduction ? 'PROD' : 'TEST'}] Fetching transactions from OpenBanking (transactions route): ${openBankingUrl.toString()}`);

    const obResponse = await fetch(openBankingUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const obResult = await obResponse.json();

    if (!obResponse.ok || obResult.rsp_code !== 'A0000') {
      console.error('OpenBanking API error (transactions route):', obResult);
      return NextResponse.json({ error: 'Failed to fetch transaction list from OpenBanking', details: obResult.rsp_message || 'Unknown error' }, { status: obResponse.status === 200 ? 400 : obResponse.status });
    }

    return NextResponse.json(obResult);

  } catch (err) {
    console.error('Error in OpenBanking transactions route:', err);
    return NextResponse.json({ error: 'Internal server error while fetching transactions.' }, { status: 500 });
  }
} 
 