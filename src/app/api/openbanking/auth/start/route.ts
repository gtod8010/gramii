import { NextRequest, NextResponse } from 'next/server';
import { getOpenBankingEnvConfig } from '@/lib/openBankingConfig'; // 수정된 경로

export async function GET(request: NextRequest) {
  const config = getOpenBankingEnvConfig();

  if (!config.apiBaseUrl || !config.clientId || !config.redirectUri) {
    console.error('OpenBanking auth/start config missing:', config);
    return NextResponse.json({ error: 'OpenBanking configuration error for auth start' }, { status: 500 });
  }

  const authorizationUrl = new URL(`${config.apiBaseUrl}/oauth/2.0/authorize`);
  authorizationUrl.searchParams.append('response_type', 'code');
  authorizationUrl.searchParams.append('client_id', config.clientId);
  authorizationUrl.searchParams.append('redirect_uri', config.redirectUri);
  authorizationUrl.searchParams.append('scope', 'login inquiry transfer'); // 필요한 scope
  authorizationUrl.searchParams.append('state', '12345678901234567890123456789012'); // CSRF 방지를 위한 랜덤 문자열 (실제로는 생성 및 검증 필요)
  authorizationUrl.searchParams.append('auth_type', '0'); // 0:최초인증, 2:재인증

  console.log(`[${config.isProduction ? 'PROD' : 'TEST'}] Redirecting to OpenBanking auth: ${authorizationUrl.toString()}`);
  return NextResponse.redirect(authorizationUrl.toString());
} 
