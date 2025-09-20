/**
 * API 요청 래퍼 - 토큰 만료 시 자동 로그아웃 처리
 */

interface ApiWrapperOptions extends RequestInit {
  skipAuth?: boolean; // 인증이 필요 없는 요청인 경우
}

/**
 * 토큰 만료 시간을 확인하여 만료되었는지 체크
 */
export const isTokenExpired = (): boolean => {
  const token = localStorage.getItem('jwtToken');
  const tokenExpiry = localStorage.getItem('jwtTokenExpiry');
  
  if (!token || !tokenExpiry) {
    return true;
  }
  
  const now = Date.now();
  const expiryTime = parseInt(tokenExpiry, 10);
  
  return now >= expiryTime;
};

/**
 * 로그아웃 처리
 */
export const handleLogout = (): void => {
  console.log('토큰이 만료되어 자동 로그아웃됩니다.');
  
  // localStorage 정리
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('jwtTokenExpiry');
  localStorage.removeItem('loggedInUser');
  
  // 로그인 페이지로 리다이렉트
  window.location.href = '/login';
  
  // 사용자에게 알림
  alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
};

/**
 * API 요청 래퍼 함수
 * 토큰 만료 시 자동 로그아웃 처리 포함
 */
export const apiRequest = async (
  url: string, 
  options: ApiWrapperOptions = {}
): Promise<Response> => {
  const { skipAuth = false, ...fetchOptions } = options;
  
  // 인증이 필요한 요청인 경우 토큰 만료 체크
  if (!skipAuth) {
    if (isTokenExpired()) {
      handleLogout();
      throw new Error('Token expired');
    }
    
    // Authorization 헤더 추가
    const token = localStorage.getItem('jwtToken');
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }
  
  // Content-Type 기본값 설정
  if (!fetchOptions.headers) {
    fetchOptions.headers = {};
  }
  
  if (fetchOptions.method && ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method.toUpperCase())) {
    (fetchOptions.headers as Record<string, string>)['Content-Type'] = 
      (fetchOptions.headers as Record<string, string>)['Content-Type'] || 'application/json';
  }
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // 401 에러 시 자동 로그아웃
    if (response.status === 401 && !skipAuth) {
      handleLogout();
      throw new Error('Unauthorized - token expired');
    }
    
    return response;
    
  } catch (error) {
    // 네트워크 오류나 기타 에러
    if (error instanceof Error && error.message !== 'Token expired' && error.message !== 'Unauthorized - token expired') {
      console.error('API request failed:', error);
    }
    throw error;
  }
};

/**
 * JSON 응답을 기대하는 API 요청 헬퍼
 */
export const apiRequestJson = async <T = unknown>(
  url: string,
  options: ApiWrapperOptions = {}
): Promise<T> => {
  const response = await apiRequest(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
    throw new Error(errorMessage);
  }
  
  return response.json();
};

/**
 * GET 요청 헬퍼
 */
export const apiGet = <T = unknown>(url: string, options: Omit<ApiWrapperOptions, 'method'> = {}) => {
  return apiRequestJson<T>(url, { ...options, method: 'GET' });
};

/**
 * POST 요청 헬퍼
 */
export const apiPost = <T = unknown>(url: string, data: unknown, options: Omit<ApiWrapperOptions, 'method' | 'body'> = {}) => {
  return apiRequestJson<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT 요청 헬퍼
 */
export const apiPut = <T = unknown>(url: string, data: unknown, options: Omit<ApiWrapperOptions, 'method' | 'body'> = {}) => {
  return apiRequestJson<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * PATCH 요청 헬퍼
 */
export const apiPatch = <T = unknown>(url: string, data: unknown, options: Omit<ApiWrapperOptions, 'method' | 'body'> = {}) => {
  return apiRequestJson<T>(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE 요청 헬퍼
 */
export const apiDelete = <T = unknown>(url: string, options: Omit<ApiWrapperOptions, 'method'> = {}) => {
  return apiRequestJson<T>(url, { ...options, method: 'DELETE' });
};
