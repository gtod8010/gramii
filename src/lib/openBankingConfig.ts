export function getOpenBankingEnvConfig() {
  const appEnv = process.env.APP_ENV || 'development'; // 기본값은 개발 환경

  if (appEnv === 'production') {
    return {
      apiBaseUrl: process.env.OPEN_BANKING_API_BASE_URL_PROD,
      accessToken: process.env.OPEN_BANKING_ACCESS_TOKEN_PROD, // 이 토큰은 상황에 따라 다를 수 있음
      fintechUseNum: process.env.OPEN_BANKING_FINTECH_USE_NUM_PROD,
      orgCode: process.env.OPEN_BANKING_ORG_CODE_PROD,
      clientId: process.env.OPEN_BANKING_CLIENT_ID_PROD, // OAuth 인증에 필요
      clientSecret: process.env.OPEN_BANKING_CLIENT_SECRET_PROD, // OAuth 인증에 필요
      redirectUri: process.env.OPEN_BANKING_REDIRECT_URI_PROD, // OAuth 인증에 필요
      isProduction: true,
    };
  } else { // development 또는 기타
    return {
      apiBaseUrl: process.env.OPEN_BANKING_API_BASE_URL_TEST,
      accessToken: process.env.OPEN_BANKING_ACCESS_TOKEN_TEST,
      fintechUseNum: process.env.OPEN_BANKING_FINTECH_USE_NUM_TEST,
      orgCode: process.env.OPEN_BANKING_ORG_CODE_TEST,
      clientId: process.env.OPEN_BANKING_CLIENT_ID_TEST,
      clientSecret: process.env.OPEN_BANKING_CLIENT_SECRET_TEST,
      redirectUri: process.env.OPEN_BANKING_REDIRECT_URI_TEST,
      isProduction: false,
    };
  }
} 
