import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest) {
  // TODO: 관리자만 접근 가능하도록 인증/인가 로직 추가 필요 (예: useUser 또는 세션 확인)
  try {
    const query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone_number,
        u.role,
        u.points,
        u.admin_referral_code,
        u.referrer_id,
        r.name as referrer_name,
        u.created_at,
        u.updated_at
      FROM users u
      LEFT JOIN users r ON u.referrer_id = r.id
      ORDER BY u.id ASC;
    `;
    
    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: '회원 목록 조회 중 오류가 발생했습니다.', error: (error as Error).message }, { status: 500 });
  }
} 
 