import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { pool } from '@/lib/db';
import { DatabaseError } from 'pg';

// 서비스 타입 생성을 위한 스키마
const serviceTypeSchema = z.object({
  name: z.string().min(1, { message: '이름을 입력해주세요.' }),
  category_id: z.number().int().positive({ message: '카테고리 ID는 양의 정수여야 합니다.' }),
});

// 서비스 타입 조회 (GET)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');

  try {
    if (categoryId) {
      const result = await pool.query('SELECT * FROM service_types WHERE category_id = $1 ORDER BY id', [Number(categoryId)]);
      return NextResponse.json(result.rows);
    } else {
      const result = await pool.query('SELECT * FROM service_types ORDER BY id');
      return NextResponse.json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching service types:', error);
    return NextResponse.json({ message: '서비스 타입 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 새 서비스 타입 생성 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedData = serviceTypeSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ message: '잘못된 입력 값입니다.', errors: parsedData.error.errors }, { status: 400 });
    }

    const { name, category_id } = parsedData.data;

    // 해당 category_id가 service_categories 테이블에 존재하는지 확인
    const categoryExists = await pool.query('SELECT id FROM service_categories WHERE id = $1', [category_id]);
    if (categoryExists.rows.length === 0) {
      return NextResponse.json({ message: '존재하지 않는 카테고리 ID입니다.' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO service_types (name, category_id) VALUES ($1, $2) RETURNING *',
      [name, category_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating service type:', error);
    if (error instanceof DatabaseError && error.code === '23505' && error.constraint === 'service_types_category_id_name_key') {
      return NextResponse.json({ message: '해당 카테고리 내에 동일한 서비스 타입 이름이 이미 존재합니다.' }, { status: 409 });
    }
    return NextResponse.json({ message: '서비스 타입 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 
