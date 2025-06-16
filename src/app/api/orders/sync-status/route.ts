import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { realsiteToGramiiStatusMap } from '@/lib/constants';

// Realsite API의 상태와 gramii DB 상태를 매핑 -> constants 파일로 이동
// const statusMap: { [key: string]: string } = { ... };

// Realsite API에서 받은 개별 주문 상태 타입
interface RealSiteOrderStatus {
    status: string;
    remains: string;
    // 필요한 다른 필드들...
}

export async function POST(req: NextRequest) {
  const { orderIds } = await req.json();

  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return NextResponse.json({ message: '동기화할 주문 ID 배열이 필요합니다.' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // 1. gramii DB에서 동기화가 필요한 realsite_order_id 목록 조회
    const query = `
      SELECT id, realsite_order_id 
      FROM orders 
      WHERE id = ANY($1::int[]) AND realsite_order_id IS NOT NULL;
    `;
    const { rows: ordersToSync } = await client.query(query, [orderIds]);

    if (ordersToSync.length === 0) {
      return NextResponse.json({ message: '동기화할 Realsite 연동 주문이 없습니다.', updatedCount: 0 });
    }

    const realsiteOrderIds = ordersToSync.map(o => o.realsite_order_id);
    const realsiteOrderIdsString = realsiteOrderIds.join(',');

    // 2. Realsite API에 상태 일괄 조회 요청
    const apiKey = process.env.REALSITE_API_KEY;
    const apiUrl = process.env.REALSITE_API_URL;

    if (!apiKey || !apiUrl) {
      throw new Error('Realsite API 환경 변수가 설정되지 않았습니다.');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: apiKey,
        action: 'status',
        orders: realsiteOrderIdsString,
      }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Realsite API 통신 오류: ${response.status} ${errorBody}`);
    }
    
    const realsiteStatuses: Record<string, RealSiteOrderStatus> = await response.json();
    
    // 3. DB 업데이트 (트랜잭션 사용)
    await client.query('BEGIN');
    
    let updatedCount = 0;
    for (const gramiiOrder of ordersToSync) {
      const realsiteStatus = realsiteStatuses[gramiiOrder.realsite_order_id];
      if (realsiteStatus && realsiteStatus.status) {
        const newStatus = realsiteToGramiiStatusMap[realsiteStatus.status];
        if (newStatus) {
            // processed_quantity도 업데이트 (선택 사항)
            // const initialQuantity = (await client.query('SELECT quantity FROM orders WHERE id = $1', [gramiiOrder.id])).rows[0].quantity;
            // const remains = parseInt(realsiteStatus.remains, 10);
            // const processedQuantity = initialQuantity - remains;
          
            const updateQuery = `UPDATE orders SET order_status = $1 WHERE id = $2 AND order_status != $1;`;
            const updateResult = await client.query(updateQuery, [newStatus, gramiiOrder.id]);
            if (updateResult.rowCount !== null && updateResult.rowCount > 0) {
              updatedCount++;
            }
        }
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({ message: '주문 상태 동기화가 완료되었습니다.', updatedCount });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to sync order statuses:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
} 
