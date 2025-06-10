import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import { DatabaseError } from 'pg';

const SALT_ROUNDS = 10; // 해시 강도, 숫자가 클수록 보안은 강해지지만 해싱 시간이 오래 걸림

// 6자리 랜덤 코드 생성 함수 (숫자와 대문자 알파벳 조합)
async function generateReferralCode(): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let attempts = 0;
  while (attempts < 10) { // 최대 10번 시도
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // 코드 중복 확인
    const checkQuery = 'SELECT id FROM users WHERE admin_referral_code = $1';
    const result = await query(checkQuery, [code]);
    if (result.rows.length === 0) {
      return code; // 고유한 코드 반환
    }
    attempts++;
  }
  throw new Error('Failed to generate a unique referral code after multiple attempts.');
}

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      phone_number, // 필수
      password,
      referrer_code, // 추천인 코드 (선택)
      role = 'user',
    } = await req.json();

    if (!name || !email || !password || !phone_number) { // referrer_code는 더 이상 필수 아님
      return NextResponse.json({ message: 'Name, email, password, and phone number are required' }, { status: 400 });
    }

    // referrer_code가 제공된 경우에만 유효성 검사
    if (referrer_code && (typeof referrer_code !== 'string' || referrer_code.length !== 6)) {
      return NextResponse.json({ message: 'Referrer code must be a 6-character string if provided' }, { status: 400 });
    }

    // 이메일 중복 확인
    const existingEmailQuery = 'SELECT id FROM users WHERE email = $1';
    const existingEmailResult = await query(existingEmailQuery, [email]);
    if (existingEmailResult.rows.length > 0) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    // 전화번호 중복 확인 (필수 항목이므로 항상 값이 있음)
      const existingPhoneQuery = 'SELECT id FROM users WHERE phone_number = $1';
      const existingPhoneResult = await query(existingPhoneQuery, [phone_number]);
      if (existingPhoneResult.rows.length > 0) {
        return NextResponse.json({ message: 'Phone number already exists' }, { status: 409 });
    }

    // 추천인 ID 조회 (코드로 변경)
    let referrerId = null;
    if (referrer_code) { // referrer_code가 제공된 경우에만 조회
      const referrerQuery = 'SELECT id FROM users WHERE admin_referral_code = $1';
      const referrerResult = await query(referrerQuery, [referrer_code]);
      if (referrerResult.rows.length > 0) {
        referrerId = referrerResult.rows[0].id;
      } else {
        // 입력된 추천인 코드가 존재하지 않을 경우 에러 처리
        return NextResponse.json({ message: `Referrer code \"${referrer_code}\" not found.` }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const adminReferralCode = await generateReferralCode(); // 고유 추천인 코드 생성

    const insertUserQuery = `
      INSERT INTO users (name, email, phone_number, password, role, referrer_id, admin_referral_code) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id, name, email, phone_number, role, referrer_id, admin_referral_code, points, created_at, updated_at 
    `;
    
    const newUserResult = await query(insertUserQuery, [
      name,
      email,
      phone_number, // phone_number는 이제 필수
      hashedPassword,
      role,
      referrerId,
      adminReferralCode,
    ]);

    return NextResponse.json({
      message: 'User registered successfully',
      user: newUserResult.rows[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Registration API error:', error);
    if (error instanceof DatabaseError && error.code === '23505') { // Unique violation
      let violatedField = 'A unique field';
      if (error.constraint === 'users_email_key') violatedField = 'Email';
      if (error.constraint === 'users_phone_number_key') violatedField = 'Phone number';
      if (error.constraint === 'users_admin_referral_code_key') violatedField = 'Admin referral code (system error, please try again)'; 
      return NextResponse.json({ message: `${violatedField} already exists. ${error.detail || ''}` }, { status: 409 });
    }
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
