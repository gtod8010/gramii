import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const { serviceType1, serviceType2 } = await request.json();

    if (!serviceType1 || !serviceType2) {
      return NextResponse.json({ message: '두 개의 서비스 타입 정보가 필요합니다.' }, { status: 400 });
    }

    await client.query('BEGIN');

    // 1. serviceType1의 순서를 임시 값으로 변경
    await client.query(
      'UPDATE service_types SET display_order = -1 WHERE id = $1',
      [serviceType1.id]
    );

    // 2. serviceType2의 순서를 serviceType1의 원래 순서로 변경
    await client.query(
      'UPDATE service_types SET display_order = $1 WHERE id = $2',
      [serviceType1.display_order, serviceType2.id]
    );

    // 3. 임시 값으로 바꿨던 serviceType1의 순서를 serviceType2의 원래 순서로 변경
    await client.query(
      'UPDATE service_types SET display_order = $1 WHERE id = $2',
      [serviceType2.display_order, serviceType1.id]
    );

    await client.query('COMMIT');

    return NextResponse.json({ message: '순서가 성공적으로 변경되었습니다.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error swapping service types order:', error);
    return NextResponse.json({ message: '순서 변경 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    client.release();
  }
} 
