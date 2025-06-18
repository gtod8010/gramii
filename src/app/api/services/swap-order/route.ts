import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const { service1, service2 } = await request.json();

    if (!service1 || !service2) {
      return NextResponse.json({ message: '두 개의 서비스 정보가 필요합니다.' }, { status: 400 });
    }

    await client.query('BEGIN');

    // 1. service1의 순서를 임시 값(-1)으로 변경
    await client.query(
      'UPDATE services SET display_order = -1 WHERE id = $1',
      [service1.id]
    );

    // 2. service2의 순서를 service1의 원래 순서로 변경
    await client.query(
      'UPDATE services SET display_order = $1 WHERE id = $2',
      [service1.display_order, service2.id]
    );

    // 3. 임시 값으로 바꿨던 service1의 순서를 service2의 원래 순서로 변경
    await client.query(
      'UPDATE services SET display_order = $1 WHERE id = $2',
      [service2.display_order, service1.id]
    );

    await client.query('COMMIT');

    return NextResponse.json({ message: '순서가 성공적으로 변경되었습니다.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error swapping services order:', error);
    return NextResponse.json({ message: '순서 변경 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    client.release();
  }
} 
