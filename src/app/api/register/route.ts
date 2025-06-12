import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // 해시 강도, 숫자가 클수록 보안은 강해지지만 해싱 시간이 오래 걸림

// 고유한 추천인 코드를 생성하는 함수 (6자리)
async function generateReferralCode(): Promise<string> {
  let code: string;
  let isUnique = false;

  while (!isUnique) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { rows } = await query('SELECT id FROM users WHERE admin_referral_code = $1', [code]);
    if (rows.length === 0) {
      isUnique = true;
    }
  }
  return code!;
}

interface User {
  id: number;
  username: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, name, phone_number, email, referrer_code } = await request.json();

    // 1. 필수 입력값 검증
    if (!username || !password || !name || !phone_number || !email) {
      return NextResponse.json({ message: '모든 필수 항목을 입력해주세요.' }, { status: 400 });
    }

    // 2. 아이디 및 이메일 중복 확인
    const existingUser = await query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      const isUsernameTaken = existingUser.rows.some((user: User) => user.username === username);
      if (isUsernameTaken) {
        return NextResponse.json({ message: '이미 사용 중인 아이디입니다.' }, { status: 409 });
      }
      const isEmailTaken = existingUser.rows.some((user: User) => user.email === email);
      if (isEmailTaken) {
        return NextResponse.json({ message: '이미 등록된 이메일입니다.' }, { status: 409 });
      }
    }

    // 3. 추천인 코드 확인
    let referrerId = null;
    if (referrer_code) {
      const referrerResult = await query(
        'SELECT id FROM users WHERE admin_referral_code = $1',
        [referrer_code.toUpperCase()]
      );
      if (referrerResult.rows.length > 0) {
        referrerId = referrerResult.rows[0].id;
      } else {
        return NextResponse.json({ message: '유효하지 않은 추천인 코드입니다.' }, { status: 400 });
      }
    }

    // 4. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 5. 고유한 관리자 추천인 코드 생성
    const adminReferralCode = await generateReferralCode();

    // 6. 새 사용자 추가
    const newUser = await query(
      `INSERT INTO users (username, password, name, phone_number, email, referrer_id, admin_referral_code, role, points)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'user', 0)
       RETURNING id, username, name, email, role, created_at`,
      [username, hashedPassword, name, phone_number, email, referrerId, adminReferralCode]
    );

    return NextResponse.json({ 
      message: '회원가입이 성공적으로 완료되었습니다.',
      user: newUser.rows[0] 
    }, { status: 201 });

  } catch (error) {
    console.error('Registration API Error:', error);
    // 데이터베이스 에러 코드 '23505'는 unique_violation 입니다.
    // 혹시 모를 동시성 문제로 인해 중복 검사를 통과했더라도 INSERT에서 에러가 날 경우를 대비합니다.
    if (error instanceof Error && 'code' in error && error.code === '23505') {
       if (error.message.includes('users_username_key')) {
         return NextResponse.json({ message: '이미 사용 중인 아이디입니다.' }, { status: 409 });
       }
       if (error.message.includes('users_email_key')) {
         return NextResponse.json({ message: '이미 등록된 이메일입니다.' }, { status: 409 });
       }
    }
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
