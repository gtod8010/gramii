import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// 임시 사용자 ID (테스트용)
// const MOCK_USER_ID = 1; // 특별 단가를 테스트하고 싶은 사용자의 ID로 설정
// const MOCK_ADMIN_ID = 2; // 관리자 역할 테스트용 ID (필요하다면)

interface JwtPayload {
  userId: number;
  // 토큰에 다른 정보가 있다면 여기에 추가
}

export async function getUserIdFromRequest(request: NextRequest): Promise<number | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    console.log('[Auth] Authorization header missing');
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('[Auth] Token missing from header');
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key') as JwtPayload;
    if (decoded && typeof decoded.userId === 'number') {
      return decoded.userId;
    }
    return null;
  } catch (error) {
    console.error('[Auth] Invalid token:', error);
    return null;
  }
}

// 필요하다면 사용자 역할을 가져오는 임시 함수도 만들 수 있습니다.
export async function getUserRoleFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key') as { role?: string };
    return decoded.role || null;
  } catch (error) {
    console.error('[Auth] Invalid token:', error);
    return null;
  }
} 
 