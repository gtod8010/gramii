import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
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
  try {
    const categoryId = parseInt(params.id, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json({ message: '유효하지 않은 카테고리 ID입니다.' }, { status: 400 });
    }

    // TODO: 해당 카테고리에 속한 서비스 타입이나 서비스가 있는지 확인하고, 있으면 삭제 못하게 막는 로직 추가 (참조 무결성)
    // 예: SELECT COUNT(*) FROM service_types WHERE category_id = $1
    // 이 결과가 0보다 크면 삭제를 막거나, 사용자에게 경고 후 연관된 항목도 함께 삭제할지 선택하도록 할 수 있습니다.

    const result = await query('DELETE FROM service_categories WHERE id = $1 RETURNING *', [categoryId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: '삭제할 카테고리를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ message: '카테고리가 성공적으로 삭제되었습니다.', deletedCategory: result.rows[0] });
  } catch (error: any) {
    console.error(`Error deleting category ${params.id}:`, error);
    // PostgreSQL 참조 무결성 오류(foreign key constraint) 등을 여기서 처리할 수 있습니다.
    // 예를 들어, error.code === '23503' (foreign_key_violation)
    if (error.code === '23503') {
        return NextResponse.json({ message: '해당 카테고리를 사용하는 서비스 타입 또는 서비스가 존재하여 삭제할 수 없습니다.'}, { status: 409 });
    }
    return NextResponse.json({ message: '카테고리 삭제 중 오류가 발생했습니다.', error: String(error) }, { status: 500 });
  }
} 