import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // 해시 강도, 숫자가 클수록 보안은 강해지지만 해싱 시간이 오래 걸림

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      phone_number,
      password,
      referrer_email, // 추천인 이메일 (선택 사항)
      role = 'user',
    } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }

    // 이메일 중복 확인
    const existingEmailQuery = 'SELECT id FROM users WHERE email = $1';
    const existingEmailResult = await query(existingEmailQuery, [email]);
    if (existingEmailResult.rows.length > 0) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    // 전화번호 중복 확인 (phone_number가 UNIQUE이고, 값이 제공된 경우)
    if (phone_number) {
      const existingPhoneQuery = 'SELECT id FROM users WHERE phone_number = $1';
      const existingPhoneResult = await query(existingPhoneQuery, [phone_number]);
      if (existingPhoneResult.rows.length > 0) {
        return NextResponse.json({ message: 'Phone number already exists' }, { status: 409 });
      }
    }

    // 추천인 ID 조회 (이메일 기반)
    let referrerId = null;
    if (referrer_email) {
      const referrerQuery = 'SELECT id FROM users WHERE email = $1';
      const referrerResult = await query(referrerQuery, [referrer_email]);
      if (referrerResult.rows.length > 0) {
        referrerId = referrerResult.rows[0].id;
      } else {
        console.warn(`Referrer email "${referrer_email}" not found.`);
        // 필요시: return NextResponse.json({ message: 'Referrer email not found' }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const insertUserQuery = `
      INSERT INTO users (name, email, phone_number, password, role, referrer_id) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, name, email, phone_number, role, referrer_id 
    `;
    // username 필드 제거됨
    const newUserResult = await query(insertUserQuery, [
      name,
      email,
      phone_number || null,
      hashedPassword,
      role,
      referrerId,
    ]);

    return NextResponse.json({
      message: 'User registered successfully',
      user: newUserResult.rows[0],
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration API error:', error);
    if (error.code === '23505') { // Unique violation
      let violatedField = 'A unique field';
      if (error.constraint === 'users_email_key') violatedField = 'Email';
      if (error.constraint === 'users_phone_number_key') violatedField = 'Phone number';
      // users_username_key 제약조건은 이제 없음
      return NextResponse.json({ message: `${violatedField} already exists. ${error.detail}` }, { status: 409 });
    }
    return NextResponse.json({ message: 'An internal server error occurred', error: error.message }, { status: 500 });
  }
}
