import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db'; // db.ts 파일 경로에 맞게 수정해주세요.
import bcrypt from 'bcrypt'; // bcrypt 임포트

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // --- 경고 ---
    // 아래 코드는 비밀번호를 해시하지 않고 일반 텍스트로 비교합니다.
    // 이는 매우 위험하며, 실제 프로덕션 환경에서는 절대 사용해서는 안 됩니다.
    // 이후 반드시 bcrypt 등을 사용하여 비밀번호 해싱을 구현해야 합니다.
    // --- 경고 ---

    const userQueryText = 'SELECT id, password, role, email, name, phone_number FROM users WHERE email = $1';
    const result = await query(userQueryText, [email]);

    if (result.rows.length === 0) {
      // 사용자가 존재하지 않음
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const user = result.rows[0];

    // 저장된 해시된 비밀번호와 입력된 비밀번호 비교
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      // 비밀번호 불일치
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // 로그인 성공
    // 실제 애플리케이션에서는 여기서 JWT 같은 세션 토큰을 생성하여 반환해야 합니다.
    // 현재는 사용자 정보 중 비밀번호를 제외하고 반환합니다.
    const { password: _, ...userWithoutPassword } = user; // 비밀번호 필드 제외

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
    }, { status: 200 });

  } catch (error) {
    console.error('Login API error:', error);
    // 클라이언트에게 너무 자세한 오류 메시지를 보내지 않도록 주의
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
