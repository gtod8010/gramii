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

    const siteVariant = process.env.NEXT_PUBLIC_SITE_VARIANT || 'gramii';
    const apiKey = siteVariant === 'orda'
      ? process.env.INSTAMONSTER_API_KEY_ORDA
      : process.env.INSTAMONSTER_API_KEY_GRAMII;
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

    // 지정된 카테고리 이름 목록으로 필터링 (한국인 관련 서비스 및 프리미엄 서비스)
    const targetCategoryNames = [
      // 기존 카테고리
      '인스타그램 리그램 상위노출 패키지 📈',
      '인스타그램 추천탭 셀프 상위노출 ⭐',
      '인스타그램 추천탭 동영상 작업 🚀',
      '인스타그램 한국인 팔로워 👩‍🚀',
      '인스타그램 한국인 좋아요❤',
    ];

    const servicesToSync = allServices.filter(service => 
      targetCategoryNames.includes(service.category)
    );

    await client.query('BEGIN');

    let upsertedCount = 0;
    const ID_OFFSET = 40000; // InstaMonster 서비스 ID에 대한 오프셋
    const remoteIds: number[] = [];

    for (const service of servicesToSync) {
      const realsite_service_id = parseInt(service.service, 10) + ID_OFFSET;
      remoteIds.push(realsite_service_id);
      
      const apiRate = parseFloat(service.rate);
      const min_order = parseInt(service.min, 10);
      const max_order = parseInt(service.max, 10);
      
      // 단위당 가격 계산: Instamonster는 1000단위 요금 체계
      const unitByThousand = apiRate / 1000;
      // Instamonster는 1000단위 요금 체계를 사용하므로 1000으로 나눈 값을 저장
      const rate = unitByThousand;

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

    // 벤더에서 사라진 서비스 비활성화 (external_id 숫자 AND 40000 이상)
    const deactivateMissingQuery = `
      UPDATE services s
      SET is_active = false
      WHERE s.is_active = true
        AND s.external_id ~ '^[0-9]+$'
        AND (s.external_id)::integer >= 40000
        AND NOT ((s.external_id)::integer = ANY($1::int[]));
    `;
    const { rowCount: deactivatedMissingCount } = await client.query(deactivateMissingQuery, [remoteIds]);

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'InstaMonster 서비스 목록이 realsite_services 테이블에 성공적으로 동기화되었습니다.',
      total_services_from_api: allServices.length,
      filtered_services_to_sync: servicesToSync.length,
      processed_services: upsertedCount,
      // 진단 정보: 단가 계산 방식 비교용
      synced_services: servicesToSync.map(s => {
        const apiRate = parseFloat(s.rate);
        const maxQty = parseInt(s.max, 10);
        const byMax = maxQty > 0 ? apiRate / maxQty : 0;
        const byThousand = apiRate / 1000;
        return ({
          id: s.service,
          name: s.name,
          category: s.category,
          original_rate_from_api: s.rate,
          min_quantity: s.min,
          max_quantity: s.max,
          calculated_unit_price_by_max: byMax,
          calculated_unit_price_by_1000: byThousand,
          chosen_unit_price: byThousand,
        });
      }),
      deactivated_missing_on_vendor: deactivatedMissingCount,
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
