import { NextResponse } from 'next/server';
import { query, pool } from '@/lib/db';
import { z } from 'zod';

// 카테고리 수정을 위한 스키마 (생성과 유사하지만 모든 필드가 옵셔널일 수 있음)
const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(255).optional(),
});

// 특정 카테고리 조회 (GET by ID) - 필요시 추가 가능
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json({ message: '유효하지 않은 카테고리 ID입니다.' }, { status: 400 });
    }

    const result = await query('SELECT * FROM service_categories WHERE id = $1', [categoryId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: '카테고리를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching category ${params.id}:`, error);
    return NextResponse.json({ message: '카테고리 조회 중 오류 발생', error: String(error) }, { status: 500 });
  }
}


// 특정 카테고리 수정 (PUT)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json({ message: '유효하지 않은 카테고리 ID입니다.' }, { status: 400 });
    }

    const body = await request.json();
    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: '입력값이 유효하지 않습니다.', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, description } = validation.data;

    if (!name && description === undefined) {
        return NextResponse.json({ message: '수정할 내용이 없습니다.'}, { status: 400 });
    }

    // 이름 변경 시 중복 확인 (자기 자신은 제외)
    if (name) {
      const existingCategory = await query('SELECT * FROM service_categories WHERE name = $1 AND id != $2', [name, categoryId]);
      if (existingCategory.rows.length > 0) {
        return NextResponse.json({ message: '이미 존재하는 카테고리 이름입니다.' }, { status: 409 });
      }
    }

    // 기존 카테고리 정보 가져오기 (업데이트할 필드만 선택적으로 변경하기 위함)
    const currentCategoryResult = await query('SELECT * FROM service_categories WHERE id = $1', [categoryId]);
    if (currentCategoryResult.rows.length === 0) {
      return NextResponse.json({ message: '수정할 카테고리를 찾을 수 없습니다.' }, { status: 404 });
    }
    const currentCategory = currentCategoryResult.rows[0];

    const newName = name || currentCategory.name;
    const newDescription = description !== undefined ? description : currentCategory.description;

    const result = await query(
      'UPDATE service_categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [newName, newDescription, categoryId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: '카테고리 업데이트에 실패했습니다.' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error(`Error updating category ${params.id}:`, error);
    if (error instanceof z.ZodError) {
        return NextResponse.json({ message: '입력값 유효성 검사 실패', errors: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ message: '카테고리 수정 중 오류가 발생했습니다.', error: String(error) }, { status: 500 });
  }
}

// 특정 카테고리 삭제 (DELETE)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const categoryIdParam = params.id;
  const client = await pool.connect(); 
  try {
    const categoryId = parseInt(categoryIdParam, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json({ message: '유효하지 않은 카테고리 ID입니다.' }, { status: 400 });
    }

    await client.query('BEGIN');

    const serviceTypesResult = await client.query(
      'SELECT id FROM service_types WHERE category_id = $1',
      [categoryId]
    );
    const serviceTypeIds = serviceTypesResult.rows.map(st => st.id);

    if (serviceTypeIds.length > 0) {
      const servicePlaceholders = serviceTypeIds.map((_, i) => `$${i + 1}`).join(',');
      await client.query(
        `DELETE FROM services WHERE service_type_id IN (${servicePlaceholders})`,
        serviceTypeIds
      );

      await client.query(
        'DELETE FROM service_types WHERE category_id = $1',
        [categoryId]
      );
    }

    const result = await client.query('DELETE FROM service_categories WHERE id = $1 RETURNING *', [categoryId]);

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: '삭제할 카테고리를 찾을 수 없습니다.' }, { status: 404 });
    }

    await client.query('COMMIT');

    return NextResponse.json({ message: '카테고리 및 관련 하위 항목들이 성공적으로 삭제되었습니다.', deletedCategory: result.rows[0] });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(`Error deleting category ${categoryIdParam} and its dependencies:`, error);
    return NextResponse.json({ message: '카테고리 삭제 중 오류가 발생했습니다.', error: String(error) }, { status: 500 });
  } finally {
    client.release();
  }
} 
