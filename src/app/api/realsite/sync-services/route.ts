import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';
import { PoolClient } from 'pg'; // pg에서 직접 PoolClient 타입을 가져옵니다.

// Realsite API 응답의 단일 서비스 객체 타입을 정의합니다.
// rate, min, max 등이 문자열로 올 수 있으므로 파싱 전에는 string으로 받습니다.
interface RealSiteService {
  service: string; // 예: "4107"
  name: string;
  type: string;
  rate: string; // 예: "1.32"
  min: string; // 예: "10"
  max: string; // 예: "1000000"
  dripfeed: boolean;
  refill: boolean;
  cancel: boolean;
  category: string;
}

// 데이터베이스 테이블 생성을 위한 함수
async function ensureTableExists(client: PoolClient) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS realsite_services (
      id SERIAL PRIMARY KEY,
      realsite_service_id INTEGER NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100),
      category VARCHAR(255),
      rate NUMERIC(14, 6) NOT NULL,
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
    // 1. Realsite 서비스 테이블이 존재하는지 확인하고, 없으면 생성합니다.
    await ensureTableExists(client);

    // 2. Realsite API에서 서비스 목록을 가져옵니다.
    // 실제 API URL과 키는 환경 변수에서 가져와야 합니다.
    const apiKey = process.env.REALSITE_API_KEY;
    const apiUrl = process.env.REALSITE_API_URL;

    if (!apiKey || !apiUrl) {
      throw new Error('Realsite API 키 또는 URL이 설정되지 않았습니다.');
    }

    // Realsite.shop API 사양에 따라 요청 본문을 구성합니다.
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: apiKey,
        action: 'services', // 'services' 액션으로 모든 서비스 목록을 요청
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Realsite API 통신 오류: ${response.status} ${errorBody}`);
    }

    const services: RealSiteService[] = await response.json();

    if (!Array.isArray(services)) {
        console.error("Realsite API 응답이 배열이 아닙니다:", services);
        throw new Error('Realsite API로부터 유효하지 않은 형식의 데이터를 받았습니다.');
    }

    // 3. 트랜잭션 시작
    await client.query('BEGIN');

    // 4. 가져온 모든 서비스를 DB에 Upsert(Update or Insert) 합니다.
    let upsertedCount = 0;
    for (const service of services) {
      // 숫자형 데이터 파싱 및 유효성 검사
      const realsite_service_id = parseInt(service.service, 10);
      const rate = parseFloat(service.rate);
      const min_order = parseInt(service.min, 10);
      const max_order = parseInt(service.max, 10);

      if (isNaN(realsite_service_id) || isNaN(rate) || isNaN(min_order) || isNaN(max_order)) {
        console.warn('Skipping invalid service data:', service);
        continue; // 유효하지 않은 데이터는 건너뜁니다.
      }
      
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
        realsite_service_id,
        service.name,
        service.type,
        service.category,
        rate,
        min_order,
        max_order,
        service.dripfeed,
        service.refill,
        service.cancel
      ]);
      upsertedCount++;
    }

    // 5. 트랜잭션 커밋
    await client.query('COMMIT');

    return NextResponse.json({
      message: 'Realsite 서비스 목록 동기화가 성공적으로 완료되었습니다.',
      total_services_from_api: services.length,
      processed_services: upsertedCount,
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to sync services from Realsite:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
} 
