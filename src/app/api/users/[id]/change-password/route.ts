import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: '인증 토큰이 없습니다.' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.id !== parseInt(id, 10)) {
        return NextResponse.json({ message: '권한이 없습니다.' }, { status: 403 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: '모든 필드를 입력해주세요.' }, { status: 400 });
    }

    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }
    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ message: '현재 비밀번호가 일치하지 않습니다.' }, { status: 400 });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
      newPasswordHash,
      id,
    ]);

    return NextResponse.json({ message: '비밀번호가 성공적으로 변경되었습니다.' }, { status: 200 });

  } catch (error) {
    console.error('Password change error:', error);
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
        return NextResponse.json({ message: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 
