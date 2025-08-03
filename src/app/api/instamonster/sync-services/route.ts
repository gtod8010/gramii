import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';
import { PoolClient } from 'pg';

interface InstaMonsterService {
  service: string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
  refill: boolean;
  cancel: boolean;
  dripfeed?: boolean; // 2pm과 필드명을 맞추기 위해 optional로 추가
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
    await ensureTableExists(client);

    const apiKey = process.env.INSTAMONSTER_API_KEY;
    const apiUrl = process.env.INSTAMONSTER_API_URL;

    if (!apiKey || !apiUrl) {
      throw new Error('INSTAMONSTER_API_KEY 또는 INSTAMONSTER_API_URL 환경 변수를 확인해주세요.');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: apiKey, action: 'services' }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`InstaMonster API 통신 오류: ${response.status} ${errorBody}`);
    }

    const allServices: InstaMonsterService[] = await response.json();

    if (!Array.isArray(allServices)) {
      console.error("InstaMonster API 응답이 배열이 아닙니다:", allServices);
      throw new Error('InstaMonster API로부터 유효하지 않은 형식의 데이터를 받았습니다.');
    }

    // 지정된 카테고리 이름 목록으로 필터링
    const targetCategoryNames = [
      '인스타그램 리그램 상위노출 패키지 📈',
      '인스타그램 추천탭 셀프 상위노출 ⭐',
      '인스타그램 추천탭 동영상 작업 🚀',
    ];

    const servicesToSync = allServices.filter(service => 
      targetCategoryNames.includes(service.category)
    );

    await client.query('BEGIN');

    let upsertedCount = 0;
    const ID_OFFSET = 40000; // InstaMonster 서비스 ID에 대한 오프셋

    for (const service of servicesToSync) {
      const realsite_service_id = parseInt(service.service, 10) + ID_OFFSET;
      // InstaMonster는 rate가 이미 최종 가격이므로 1000으로 나누지 않음.
      const rate = parseFloat(service.rate);
      const min_order = parseInt(service.min, 10);
      const max_order = parseInt(service.max, 10);

      if (isNaN(realsite_service_id) || isNaN(rate) || isNaN(min_order) || isNaN(max_order)) {
        console.warn('Skipping invalid service data from InstaMonster:', service);
        continue;
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
        service.dripfeed ?? false, // dripfeed가 없을 수 있으므로 기본값 false
        service.refill,
        service.cancel
      ]);
      upsertedCount++;
    }

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'InstaMonster 서비스 목록이 realsite_services 테이블에 성공적으로 동기화되었습니다.',
      total_services_from_api: allServices.length,
      filtered_services_to_sync: servicesToSync.length,
      processed_services: upsertedCount,
      synced_services: servicesToSync.map(s => ({ id: s.service, name: s.name })),
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to sync services from InstaMonster:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}
