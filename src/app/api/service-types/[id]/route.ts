import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { pool } from '@/lib/db';

const updateServiceTypeSchema = z.object({
  name: z.string().min(1, { message: '서비스 타입 이름은 필수입니다.' }).max(100),
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
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = updateServiceTypeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid input', errors: parsed.error.format() }, { status: 400 });
    }

    const { name } = parsed.data;

    const result = await pool.query(
      'UPDATE service_types SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Service type not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: unknown) {
    console.error(`Error updating service type ${id}:`, error);
     if (error instanceof Object && 'code' in error && error.code === '23505') { // unique_violation
      return NextResponse.json({ message: '해당 카테고리에 동일한 이름의 서비스 타입이 이미 존재합니다.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error updating service type' }, { status: 500 });
  }
}

// 서비스 타입 삭제 (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. 해당 서비스 타입을 참조하는 services 삭제
    await client.query('DELETE FROM services WHERE service_type_id = $1', [id]);
    
    // 2. 서비스 타입 삭제
    const result = await client.query('DELETE FROM service_types WHERE id = $1 RETURNING *', [id]);
    
    await client.query('COMMIT');

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Service type not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Service type and related services deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error deleting service type ${id}:`, error);
    return NextResponse.json({ message: 'Error deleting service type' }, { status: 500 });
  } finally {
    client.release();
  }
} 
