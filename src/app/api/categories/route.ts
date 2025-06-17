import { NextResponse, NextRequest } from 'next/server';
import { pool } from '@/lib/db';

// 모든 카테고리 조회 (GET)
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM service_categories ORDER BY display_order ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: '카테고리 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 새로운 카테고리 추가 (POST)
export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ message: '카테고리 이름은 필수입니다.' }, { status: 400 });
    }
    
    // 중복 이름 검사
    const existingCategory = await pool.query('SELECT id FROM service_categories WHERE name = $1', [name]);
    if (existingCategory.rows.length > 0) {
      return NextResponse.json({ message: '이미 존재하는 카테고리 이름입니다.' }, { status: 409 }); // 409 Conflict
    }

    const result = await pool.query(
      'INSERT INTO service_categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ message: '카테고리 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 
