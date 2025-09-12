import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

// 외부 벤더 서비스 목록을 검색하기 위한 GET 함수 (RealSite, 2PM, InstaMonster)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || ''; // 검색어 파라미터
  const external_id = searchParams.get('external_id'); // external_id로 직접 조회

  const client = await getClient();
  try {
    // realsite_services 테이블에서 서비스들을 검색합니다.
    let fetchQuery = `
      SELECT 
        realsite_service_id, 
        name, 
        min_order, 
        max_order,
        rate,
        category
      FROM realsite_services
    `;

    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    // external_id로 직접 조회하는 경우
    if (external_id) {
      const externalIdNum = parseInt(external_id, 10);
      if (!isNaN(externalIdNum)) {
        // external_id 매핑 규칙에 따라 realsite_service_id 계산
        let realsiteServiceId = externalIdNum;
        
        // 2PM 서비스인 경우 (20000 이상 40000 미만)
        if (externalIdNum >= 20000 && externalIdNum < 40000) {
          realsiteServiceId = externalIdNum - 20000;
        }
        // InstaMonster 서비스인 경우 (40000 이상) - realsite_services 테이블에서 직접 조회
        else if (externalIdNum >= 40000) {
          realsiteServiceId = externalIdNum; // InstaMonster는 오프셋된 ID 그대로 저장됨
        }
        
        whereClauses.push(`realsite_service_id = $1`);
        params.push(realsiteServiceId);
      }
    }
    // 검색어로 조회하는 경우
    else if (query) {
      // 숫자로만 구성된 검색어는 ID로, 그렇지 않으면 이름으로 검색
      if (/^\d+$/.test(query)) {
        whereClauses.push(`realsite_service_id::text ILIKE $1`);
      } else {
        whereClauses.push(`name ILIKE $1`);
      }
      params.push(`%${query}%`);
    }

    if (whereClauses.length > 0) {
      fetchQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    
    fetchQuery += ` ORDER BY category, name LIMIT 50;`;

    const availableServicesResult = await client.query(fetchQuery, params);

    return NextResponse.json(availableServicesResult.rows);

  } catch (error) {
    console.error('Error fetching available realsite services:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: '사용 가능한 Realsite 서비스 목록을 가져오는데 실패했습니다.', details: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
} 
