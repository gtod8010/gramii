import { NextRequest, NextResponse } from 'next/server';
import { getOpenBankingEnvConfig } from '@/lib/openBankingConfig'; // 수정된 경로

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // TODO: state 파라미터 검증 로직 (CSRF 방지)
  // 이전 /auth/start에서 저장해둔 state와 현재 받은 state를 비교해야 합니다.

  if (error) {
    console.error(`OpenBanking callback error: ${error} - ${errorDescription}`);
    // 사용자에게 오류 페이지를 보여주거나, 에러 정보를 포함한 페이지로 리디렉션합니다.
    return NextResponse.json({ message: 'OpenBanking authentication failed.', error, errorDescription }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ message: 'Authorization code not found.' }, { status: 400 });
  }

  const config = getOpenBankingEnvConfig();
  if (!config.apiBaseUrl || !config.clientId || !config.clientSecret || !config.redirectUri) {
    console.error('OpenBanking callback config missing:', config);
    return NextResponse.json({ error: 'OpenBanking configuration error for token request' }, { status: 500 });
  }

  try {
    const tokenUrl = `${config.apiBaseUrl}/oauth/2.0/token`;
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', config.clientId);
    params.append('client_secret', config.clientSecret);
    params.append('redirect_uri', config.redirectUri);
    params.append('grant_type', 'authorization_code');

    console.log(`[${config.isProduction ? 'PROD' : 'TEST'}] Requesting OpenBanking token from: ${tokenUrl}`);

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.rsp_code) { // rsp_code는 오픈뱅킹 자체 오류 코드
      console.error('Failed to obtain OpenBanking token:', tokenData);
      return NextResponse.json({ message: 'Failed to obtain access token.', details: tokenData.rsp_message || tokenData.error_description || 'Unknown error' }, { status: tokenResponse.status });
    }

    // TODO: 발급받은 access_token, refresh_token, user_seq_no 등을 안전하게 저장 (예: DB, 암호화된 세션/쿠키)
    // console.log('OpenBanking Token Data:', tokenData);

    // 성공 시, 사용자를 특정 페이지로 리디렉션하거나 성공 메시지를 반환합니다.
    // 예: 메인 페이지로 리디렉션하면서 토큰 정보를 안전하게 전달 (또는 서버 세션에 저장)
    // return NextResponse.redirect(new URL('/dashboard', request.url));
    return NextResponse.json({ message: 'Access Token obtained successfully!', accessToken: tokenData.access_token, refreshToken: tokenData.refresh_token, userSeqNo: tokenData.user_seq_no, scope: tokenData.scope, expiresIn: tokenData.expires_in });

  } catch (err) {
    console.error('Error in OpenBanking callback token request:', err);
    return NextResponse.json({ message: 'Internal server error during token request.' }, { status: 500 });
  }
} 
 