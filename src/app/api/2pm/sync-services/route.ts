import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';
import { PoolClient } from 'pg';

// 2pm.co.kr API 응답의 단일 서비스 객체 타입을 정의합니다.
// Realsite과 구조가 동일하므로 거의 그대로 사용합니다.
interface TwoPmService {
  service: string; 
  name: string;
  type: string;
  rate: string; 
  min: string;
  max: string;
  dripfeed: boolean;
  refill: boolean;
  cancel: boolean;
  category: string;
}

// 이 API는 realsite_services 테이블에 데이터를 저장합니다.
async function ensureTableExists(client: PoolClient) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS realsite_services (
      id SERIAL PRIMARY KEY,
      realsite_service_id INTEGER NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100),
      category VARCHAR(255),
      rate NUMERIC(20, 6) NOT NULL,
      min_order INTEGER NOT NULL,
      max_order INTEGER NOT NULL,
      dripfeed BOOLEAN DEFAULT FALSE,
      refill BOOLEAN DEFAULT FALSE,
      cancel BOOLEAN DEFAULT FALSE,
      last_synced_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await client.query(createTableQuery);
}

export async function POST() {
  const client = await getClient();
  try {
    // 1. realsite_services 테이블이 존재하는지 확인합니다.
    await ensureTableExists(client);

    // 2. 2pm API에서 서비스 목록을 가져옵니다.
    const apiKey = process.env.TWOPM_API_KEY; 
    const apiUrl = process.env.TWOPM_API_URL;

    if (!apiKey || !apiUrl) {
      throw new Error('2PM_API_KEY 또는 2PM_API_URL 환경 변수를 확인해주세요.');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: apiKey, action: 'services' }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`2pm API 통신 오류: ${response.status} ${errorBody}`);
    }

    const services: TwoPmService[] = await response.json();

    if (!Array.isArray(services)) {
        console.error("2pm API 응답이 배열이 아닙니다:", services);
        throw new Error('2pm API로부터 유효하지 않은 형식의 데이터를 받았습니다.');
    }

    await client.query('BEGIN');

    let upsertedCount = 0;
    const ID_OFFSET = 20000; // ID 충돌 방지를 위한 오프셋

    for (const service of services) {
      // 2pm 서비스 ID에 20000을 더합니다.
      const realsite_service_id = parseInt(service.service, 10) + ID_OFFSET;
      // rate는 1000으로 나눕니다.
      const rate = parseFloat(service.rate) / 1000;
      const min_order = parseInt(service.min, 10);
      const max_order = parseInt(service.max, 10);

      if (isNaN(realsite_service_id) || isNaN(rate) || isNaN(min_order) || isNaN(max_order)) {
        console.warn('Skipping invalid service data from 2pm:', service);
        continue;
      }
      
      // realsite_services 테이블에 저장합니다.
      const upsertQuery = `
        INSERT INTO realsite_services (
          realsite_service_id, name, type, category, rate, min_order, max_order, dripfeed, refill, cancel, last_synced_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
        )
        ON CONFLICT (realsite_service_id) 
        DO UPDATE SET
          name = EXCLUDED.name,
          type = EXCLUDED.type,
          category = EXCLUDED.category,
          rate = EXCLUDED.rate,
          min_order = EXCLUDED.min_order,
          max_order = EXCLUDED.max_order,
          dripfeed = EXCLUDED.dripfeed,
          refill = EXCLUDED.refill,
          cancel = EXCLUDED.cancel,
          last_synced_at = NOW()
        ;
      `;
      
      await client.query(upsertQuery, [
        realsite_service_id, // 20000이 더해진 ID
        service.name,
        service.type,
        service.category,
        rate, // 1000으로 나눠진 가격
        min_order,
        max_order,
        service.dripfeed,
        service.refill,
        service.cancel
      ]);
      upsertedCount++;
    }

    await client.query('COMMIT');

    return NextResponse.json({
      message: '2pm.co.kr 서비스 목록이 realsite_services 테이블에 성공적으로 동기화되었습니다.',
      total_services_from_api: services.length,
      processed_services: upsertedCount,
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to sync services from 2pm:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
} 
