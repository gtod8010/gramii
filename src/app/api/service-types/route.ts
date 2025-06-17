import { NextResponse } from 'next/server';
import { z } from 'zod';
import { pool } from '@/lib/db';

// 서비스 타입 생성을 위한 스키마
const serviceTypeSchema = z.object({
  name: z.string().min(1, { message: '서비스 타입 이름은 필수입니다.' }),
  category_id: z.number().int().positive({ message: '유효한 카테고리 ID가 필요합니다.' }),
});

// 서비스 타입 조회 (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId');

  try {
    if (categoryId) {
      const query = 'SELECT * FROM service_types WHERE category_id = $1 ORDER BY name ASC';
      const result = await pool.query(query, [categoryId]);
      return NextResponse.json(result.rows);
    } else {
      const result = await pool.query('SELECT * FROM service_types ORDER BY id');
      return NextResponse.json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching service types:', error);
    return NextResponse.json({ message: 'Error fetching service types' }, { status: 500 });
  }
}

// 새 서비스 타입 생성 (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = serviceTypeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid input', errors: parsed.error.format() }, { status: 400 });
    }

    const { name, category_id } = parsed.data;

    const result = await pool.query(
      'INSERT INTO service_types (name, category_id) VALUES ($1, $2) RETURNING *',
      [name, category_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating service type:', error);
    if (error instanceof Object && 'code' in error && error.code === '23505') { // unique_violation
      return NextResponse.json({ message: '해당 카테고리에 동일한 이름의 서비스 타입이 이미 존재합니다.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error creating service type' }, { status: 500 });
  }
} 
