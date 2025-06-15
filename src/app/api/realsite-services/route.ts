import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

// 등록되지 않은 Realsite 서비스 목록을 검색하기 위한 GET 함수
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || ''; // 검색어 파라미터

  const client = await getClient();
  try {
    // 이미 gramii의 'services' 테이블에 등록된 realsite_service_id 목록을 가져옵니다.
    // external_id 컬럼에 realsite_service_id가 저장되어 있다고 가정합니다.
    const registeredServicesResult = await client.query(
      `SELECT external_id FROM services WHERE external_id IS NOT NULL`
    );
    const registeredIds = registeredServicesResult.rows.map(row => parseInt(row.external_id, 10));

    // realsite_services 테이블에서 아직 등록되지 않은 서비스들을 검색합니다.
    // 검색어가 있으면 name 또는 realsite_service_id로 검색합니다.
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

    const params: (string | number | number[])[] = [];
    const whereClauses: string[] = [];

    // 이미 등록된 서비스 제외
    if (registeredIds.length > 0) {
      whereClauses.push(`realsite_service_id NOT IN (${registeredIds.join(',')})`);
    }

    // 검색어 처리
    if (query) {
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
    
    fetchQuery += ` ORDER BY category, name LIMIT 50;`; // 너무 많은 결과를 방지하기 위해 50개로 제한

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
