import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db'; // db.ts 파일 경로에 맞게 수정해주세요.
import bcrypt from 'bcrypt'; // bcrypt 임포트
import jwt from 'jsonwebtoken'; // jwt 임포트

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: '아이디와 비밀번호를 모두 입력해주세요.' }, { status: 400 });
    }

    // --- 경고 ---
    // 아래 코드는 비밀번호를 해시하지 않고 일반 텍스트로 비교합니다.
    // 이는 매우 위험하며, 실제 프로덕션 환경에서는 절대 사용해서는 안 됩니다.
    // 이후 반드시 bcrypt 등을 사용하여 비밀번호 해싱을 구현해야 합니다.
    // --- 경고 ---

    const userQueryText = 'SELECT id, username, email, password, role, name, phone_number, points, admin_referral_code FROM users WHERE username = $1';
    const result = await query(userQueryText, [username]);

    if (result.rows.length === 0) {
      // 사용자가 존재하지 않음
      return NextResponse.json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' }, { status: 401 });
    }

    const user = result.rows[0];

    // 저장된 해시된 비밀번호와 입력된 비밀번호 비교
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      // 비밀번호 불일치
      return NextResponse.json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' }, { status: 401 });
    }

    // 로그인 성공: JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-fallback-secret-key',
      { expiresIn: '7d' } // 토큰 유효기간: 7일
    );

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as { password?: string }).password;

    return NextResponse.json({
      message: '로그인 성공',
      user: userWithoutPassword,
      token: token, // 응답에 토큰 추가
    }, { status: 200 });

  } catch (error) {
    console.error('Login API error:', error);
    // 클라이언트에게 너무 자세한 오류 메시지를 보내지 않도록 주의
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
