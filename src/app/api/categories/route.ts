import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; // pool 대신 query 함수를 import
import { z } from 'zod'; // 유효성 검사를 위해 zod 사용

// 카테고리 생성을 위한 스키마 정의
const createCategorySchema = z.object({
  name: z.string().min(1, { message: '카테고리 이름은 필수입니다.' }).max(100, { message: '카테고리 이름은 100자를 넘을 수 없습니다.' }),
  description: z.string().max(255, { message: '설명은 255자를 넘을 수 없습니다.' }).optional(),
});

// 모든 카테고리 조회 (GET)
export async function GET() {
  try {
    const result = await query('SELECT * FROM service_categories ORDER BY name ASC'); // pool.query 대신 query 사용
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: '카테고리 조회 중 오류가 발생했습니다.', error: String(error) }, { status: 500 });
  }
}

// 새 카테고리 생성 (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: '입력값이 유효하지 않습니다.', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, description } = validation.data;

    // 이름 중복 확인 (선택 사항이지만 권장)
    const existingCategory = await query('SELECT * FROM service_categories WHERE name = $1', [name]); // pool.query 대신 query 사용
    if (existingCategory.rows.length > 0) {
      return NextResponse.json({ message: '이미 존재하는 카테고리 이름입니다.' }, { status: 409 }); // 409 Conflict
    }

    const result = await query(
      'INSERT INTO service_categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    ); // pool.query 대신 query 사용

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    // Zod 에러와 다른 에러를 구분해서 처리할 수도 있습니다.
    if (error instanceof z.ZodError) {
        return NextResponse.json({ message: '입력값 유효성 검사 실패', errors: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ message: '카테고리 생성 중 오류가 발생했습니다.', error: String(error) }, { status: 500 });
  }
} 
