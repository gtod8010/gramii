import { NextRequest } from 'next/server';

// 임시 사용자 ID (테스트용)
// const MOCK_USER_ID = 1; // 특별 단가를 테스트하고 싶은 사용자의 ID로 설정
// const MOCK_ADMIN_ID = 2; // 관리자 역할 테스트용 ID (필요하다면)

export async function getUserIdFromRequest(request: NextRequest): Promise<number | null> {
  const testUserHeader = request.headers.get('X-Test-User-Id');
  if (testUserHeader) {
    const userId = parseInt(testUserHeader, 10);
    if (!isNaN(userId)){
        console.log(`[Auth Mock] Returning User ID from header: ${userId}`);
        return userId;
    }
  }
  
  const hardcodedUserId = 6; // 사용자 ID 6으로 하드코딩
  console.log(`[Auth Mock] Returning hardcoded User ID: ${hardcodedUserId}`);
  return hardcodedUserId;

  // 만약 위에서 ID를 특정할 수 없는 경우를 대비한 최종 반환 (현재 로직에서는 hardcodedUserId가 항상 반환됨)
  // console.log('[Auth Mock] No specific user ID determined, returning null.');
  // return null;
}

// 필요하다면 사용자 역할을 가져오는 임시 함수도 만들 수 있습니다.
export async function getUserRoleFromRequest(request: NextRequest): Promise<string | null> {
  // const userId = await getUserIdFromRequest(request);
  // 여기서 userId를 기반으로 역할을 반환하는 로직 추가 가능
  console.log('[Auth Mock] getUserRoleFromRequest called, returning null for role.');
  return null;
} 
 