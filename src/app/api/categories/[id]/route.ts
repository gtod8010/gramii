import { type NextRequest, NextResponse } from 'next/server';
import { query, pool } from '@/lib/db';

// 특정 카테고리 조회 (GET by ID) - 필요시 추가 가능
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json({ message: '유효하지 않은 카테고리 ID입니다.' }, { status: 400 });
    }

    const result = await query('SELECT * FROM service_categories WHERE id = $1', [categoryId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: '카테고리를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    const id = (await (params as Promise<{ id: string }>)).id;
    console.error(`Error fetching category ${id}:`, error);
    return NextResponse.json({ message: '카테고리 조회 중 오류 발생', error: String(error) }, { status: 500 });
  }
}


// 특정 카테고리 수정 (PUT)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    return NextResponse.json({ message: '유효하지 않은 카테고리 ID입니다.' }, { status: 400 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: '카테고리 이름은 필수입니다.' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE service_categories SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [name, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: '카테고리를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ message: '카테고리 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 특정 카테고리 삭제 (DELETE)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    return NextResponse.json({ message: '유효하지 않은 카테고리 ID입니다.' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // 트랜잭션 시작

    // 1. 카테고리에 속한 모든 서비스 타입 ID를 조회합니다.
    const serviceTypesResult = await client.query('SELECT id FROM service_types WHERE category_id = $1', [id]);
    const serviceTypeIds = serviceTypesResult.rows.map(row => row.id);

    if (serviceTypeIds.length > 0) {
      // 2. 해당 서비스 타입들을 참조하는 모든 주문이 있는지 확인합니다. (안전장치)
      const ordersExistResult = await client.query('SELECT id FROM orders WHERE service_id IN (SELECT id FROM services WHERE service_type_id = ANY($1)) LIMIT 1', [serviceTypeIds]);
      if (ordersExistResult.rows.length > 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ message: '해당 카테고리에 속한 서비스에 대한 주문 내역이 존재하여 삭제할 수 없습니다. 주문 내역을 먼저 삭제해주세요.' }, { status: 400 });
      }

      // 3. 해당 서비스 타입에 속한 모든 서비스를 삭제합니다.
      await client.query('DELETE FROM services WHERE service_type_id = ANY($1)', [serviceTypeIds]);
      
      // 4. 해당 카테고리에 속한 모든 서비스 타입을 삭제합니다.
      await client.query('DELETE FROM service_types WHERE category_id = $1', [id]);
    }

    // 5. 마지막으로 카테고리 자체를 삭제합니다.
    const deleteCategoryResult = await client.query('DELETE FROM service_categories WHERE id = $1 RETURNING *', [id]);

    if (deleteCategoryResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: '삭제할 카테고리를 찾을 수 없습니다.' }, { status: 404 });
    }

    await client.query('COMMIT'); // 트랜잭션 커밋
    return NextResponse.json({ message: '카테고리와 관련 모든 서비스가 성공적으로 삭제되었습니다.' });

  } catch (error) {
    await client.query('ROLLBACK'); // 오류 발생 시 롤백
    console.error('Error deleting category:', error);
    return NextResponse.json({ message: '카테고리 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    client.release();
  }
} 
