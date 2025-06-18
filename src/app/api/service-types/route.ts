import { NextResponse } from 'next/server';
import { z } from 'zod';
import { pool } from '@/lib/db';
import { NextRequest } from 'next/server';

// 서비스 타입 생성을 위한 스키마
const serviceTypeSchema = z.object({
  name: z.string().min(1, { message: '서비스 타입 이름은 필수입니다.' }),
  category_id: z.number().int().positive({ message: '유효한 카테고리 ID가 필요합니다.' }),
});

// 서비스 타입 조회 (GET)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');

  try {
    if (categoryId) {
      const query = 'SELECT * FROM service_types WHERE category_id = $1 ORDER BY display_order ASC';
      const result = await pool.query(query, [categoryId]);
      return NextResponse.json(result.rows);
    } else {
      const result = await pool.query('SELECT * FROM service_types ORDER BY display_order ASC');
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

    // display_order 자동 계산 (같은 카테고리 내에서)
    const { rows: maxOrderRows } = await pool.query(
      'SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM service_types WHERE category_id = $1',
      [category_id]
    );
    const nextOrder = maxOrderRows[0].next_order;

    const result = await pool.query(
      'INSERT INTO service_types (name, category_id, display_order) VALUES ($1, $2, $3) RETURNING *',
      [name, category_id, nextOrder]
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
