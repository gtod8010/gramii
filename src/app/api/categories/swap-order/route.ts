import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const { category1, category2 } = await request.json();

    if (!category1 || !category2) {
      return NextResponse.json({ message: '두 개의 카테고리 정보가 필요합니다.' }, { status: 400 });
    }

    await client.query('BEGIN');

    // 1. category1의 순서를 임시 값으로 변경
    await client.query(
      'UPDATE service_categories SET display_order = -1 WHERE id = $1',
      [category1.id]
    );

    // 2. category2의 순서를 category1의 원래 순서로 변경
    await client.query(
      'UPDATE service_categories SET display_order = $1 WHERE id = $2',
      [category1.display_order, category2.id]
    );

    // 3. 임시 값으로 바꿨던 category1의 순서를 category2의 원래 순서로 변경
    await client.query(
      'UPDATE service_categories SET display_order = $1 WHERE id = $2',
      [category2.display_order, category1.id]
    );

    await client.query('COMMIT');

    return NextResponse.json({ message: '순서가 성공적으로 변경되었습니다.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error swapping categories order:', error);
    return NextResponse.json({ message: '순서 변경 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    client.release();
  }
} 
