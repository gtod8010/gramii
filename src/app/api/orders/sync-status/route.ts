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
    // 1. DB에서 동기화가 필요한 주문 목록 조회 (서비스 ID로 벤더 구분)
    const query = `
      SELECT o.id, o.realsite_order_id, s.external_id
      FROM orders o
      JOIN services s ON o.service_id = s.id
      WHERE o.id = ANY($1::int[]) AND o.realsite_order_id IS NOT NULL;
    `;
    const { rows: ordersToSync } = await client.query(query, [orderIds]);

    if (ordersToSync.length === 0) {
      return NextResponse.json({ message: '동기화할 외부 서비스 연동 주문이 없습니다.', updatedCount: 0 });
    }

    // 2. 벤더별로 주문 분류 (external_id로 구분)
    const realsiteOrders = ordersToSync.filter(o => o.external_id && parseInt(o.external_id) < 20000);
    const twopmOrders = ordersToSync.filter(o => o.external_id && parseInt(o.external_id) >= 20000 && parseInt(o.external_id) < 40000);
    const instamonsterOrders = ordersToSync.filter(o => o.external_id && parseInt(o.external_id) >= 40000);
    
    let allStatuses: Record<string, RealSiteOrderStatus> = {};
    
    // 2-1. RealSite 주문 상태 조회
    if (realsiteOrders.length > 0) {
      const realsiteOrderIds = realsiteOrders.map(o => o.realsite_order_id);
      const realsiteOrderIdsString = realsiteOrderIds.join(',');
      
      const siteVariant = process.env.NEXT_PUBLIC_SITE_VARIANT || 'gramii';
      const apiKey = siteVariant === 'orda'
        ? process.env.REALSITE_API_KEY_ORDA
        : process.env.REALSITE_API_KEY_GRAMII;
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
      allStatuses = { ...allStatuses, ...realsiteStatuses };
    }
    
    // 2-2. 2PM 주문 상태 조회
    if (twopmOrders.length > 0) {
      const twopmOrderIds = twopmOrders.map(o => o.realsite_order_id);
      const twopmOrderIdsString = twopmOrderIds.join(',');
      
      const apiKey = process.env.TWOPM_API_KEY;
      const apiUrl = process.env.TWOPM_API_URL;

      if (!apiKey || !apiUrl) {
        throw new Error('2PM API 환경 변수가 설정되지 않았습니다.');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: apiKey,
          action: 'status',
          orders: twopmOrderIdsString,
        }),
      });

      if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`2PM API 통신 오류: ${response.status} ${errorBody}`);
      }
      
      const twopmStatuses: Record<string, RealSiteOrderStatus> = await response.json();
      allStatuses = { ...allStatuses, ...twopmStatuses };
    }
    
    // 2-3. InstaMonster 주문 상태 조회
    if (instamonsterOrders.length > 0) {
      const instamonsterOrderIds = instamonsterOrders.map(o => o.realsite_order_id);
      const instamonsterOrderIdsString = instamonsterOrderIds.join(',');
      
      const siteVariant = process.env.NEXT_PUBLIC_SITE_VARIANT || 'gramii';
      const apiKey = siteVariant === 'orda'
        ? process.env.INSTAMONSTER_API_KEY_ORDA
        : process.env.INSTAMONSTER_API_KEY_GRAMII;
      const apiUrl = process.env.INSTAMONSTER_API_URL;

      if (!apiKey || !apiUrl) {
        throw new Error('InstaMonster API 환경 변수가 설정되지 않았습니다.');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: apiKey,
          action: 'status',
          orders: instamonsterOrderIdsString,
        }),
      });

      if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`InstaMonster API 통신 오류: ${response.status} ${errorBody}`);
      }
      
      const instamonsterStatuses: Record<string, RealSiteOrderStatus> = await response.json();
      allStatuses = { ...allStatuses, ...instamonsterStatuses };
    }
    
    // 3. DB 업데이트 (트랜잭션 사용)
    await client.query('BEGIN');
    
    let updatedCount = 0;
    for (const order of ordersToSync) {
      const vendorStatus = allStatuses[order.realsite_order_id];
      
      if (vendorStatus && vendorStatus.status) {
        // 모든 벤더의 상태를 동일한 매핑 테이블로 처리
        const newStatus = realsiteToGramiiStatusMap[vendorStatus.status] || vendorStatus.status;
        
        if (newStatus) {
          const updateQuery = `UPDATE orders SET order_status = $1 WHERE id = $2 AND order_status != $1;`;
          const updateResult = await client.query(updateQuery, [newStatus, order.id]);
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
