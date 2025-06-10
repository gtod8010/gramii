import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { pool } from '@/lib/db';
import { DatabaseError } from 'pg';

const serviceTypeUpdateSchema = z.object({
  name: z.string().min(1, { message: '이름을 입력해주세요.' }).optional(),
  category_id: z.number().int().positive({ message: '카테고리 ID는 양의 정수여야 합니다.' }).optional(),
});

// 특정 서비스 타입 조회 (GET)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);

  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ message: '유효하지 않은 서비스 타입 ID입니다.' }, { status: 400 });
  }

  try {
    const result = await pool.query('SELECT * FROM service_types WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: '서비스 타입을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching service type:', error);
    return NextResponse.json({ message: '서비스 타입 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 특정 서비스 타입 수정 (PUT)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);

  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ message: '유효하지 않은 서비스 타입 ID입니다.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsedData = serviceTypeUpdateSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ message: '잘못된 입력 값입니다.', errors: parsedData.error.errors }, { status: 400 });
    }

    const { name, category_id } = parsedData.data;

    if (!name && !category_id) {
      return NextResponse.json({ message: '수정할 내용을 입력해주세요.' }, { status: 400 });
    }

    // 카테고리 ID가 제공된 경우, 해당 카테고리가 존재하는지 확인
    if (category_id) {
      const categoryExists = await pool.query('SELECT id FROM service_categories WHERE id = $1', [category_id]);
      if (categoryExists.rows.length === 0) {
        return NextResponse.json({ message: '존재하지 않는 카테고리 ID입니다.' }, { status: 400 });
      }
    }

    // 현재 서비스 타입 정보 가져오기 (업데이트할 필드만 선택적으로 사용하기 위함)
    const currentServiceTypeResult = await pool.query('SELECT * FROM service_types WHERE id = $1', [id]);
    if (currentServiceTypeResult.rows.length === 0) {
      return NextResponse.json({ message: '서비스 타입을 찾을 수 없습니다.' }, { status: 404 });
    }
    const currentServiceType = currentServiceTypeResult.rows[0];

    const newName = name || currentServiceType.name;
    const newCategoryId = category_id || currentServiceType.category_id;

    const result = await pool.query(
      'UPDATE service_types SET name = $1, category_id = $2 WHERE id = $3 RETURNING *',
      [newName, newCategoryId, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: '서비스 타입을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating service type:', error);
    if (error instanceof DatabaseError && error.code === '23505' && error.constraint === 'service_types_category_id_name_key') {
      return NextResponse.json({ message: '해당 카테고리 내에 동일한 서비스 타입 이름이 이미 존재합니다.' }, { status: 409 });
    }
    return NextResponse.json({ message: '서비스 타입 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 특정 서비스 타입 삭제 (DELETE)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);

  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ message: '유효하지 않은 서비스 타입 ID입니다.' }, { status: 400 });
  }

  try {
    // 해당 서비스 타입을 참조하는 서비스가 있는지 확인
    const servicesExist = await pool.query('SELECT id FROM services WHERE type_id = $1', [id]);
    if (servicesExist.rows.length > 0) {
      return NextResponse.json({ message: '해당 서비스 타입을 사용하는 서비스가 존재하여 삭제할 수 없습니다.' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM service_types WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: '서비스 타입을 찾을 수 없거나 이미 삭제되었습니다.' }, { status: 404 });
    }

    return NextResponse.json({ message: '서비스 타입이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting service type:', error);
    return NextResponse.json({ message: '서비스 타입 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 
