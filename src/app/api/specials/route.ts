import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db'; 
import { z } from 'zod';

// 스페셜 생성을 위한 스키마 정의
const createSpecialSchema = z.object({
  name: z.string().min(1, { message: '스페셜 이름은 필수입니다.' }).max(100, { message: '스페셜 이름은 100자를 넘을 수 없습니다.' }),
  description: z.string().max(255, { message: '설명은 255자를 넘을 수 없습니다.' }).optional(),
  service_ids: z.array(z.number()).optional(), // 스페셜에 포함될 서비스 ID 목록 (선택적)
});

// 모든 스페셜 조회 (GET)
export async function GET() {
  const { query, getClient } = await import('@/lib/db'); // getClient 추가
  const client = await getClient(); // 클라이언트 사용
  try {
    // 모든 스페셜 기본 정보 조회
    const specialsResult = await client.query('SELECT * FROM specials ORDER BY created_at DESC'); // 최신순 정렬 또는 이름순 (name ASC)
    const specials = specialsResult.rows;

    // 각 스페셜에 대해 연결된 서비스 ID 목록 조회
    const specialsWithServiceIds = [];
    for (const special of specials) {
      const servicesResult = await client.query(
        'SELECT id FROM services WHERE special_id = $1',
        [special.id]
      );
      const service_ids = servicesResult.rows.map(row => row.id);
      specialsWithServiceIds.push({
        ...special,
        service_ids: service_ids,
      });
    }

    return NextResponse.json(specialsWithServiceIds);
  } catch (error) {
    console.error('Error fetching specials with service_ids:', error);
    return NextResponse.json({ message: '스페셜 및 연결 서비스 ID 조회 중 오류가 발생했습니다.', error: String(error) }, { status: 500 });
  } finally {
    client.release(); // 클라이언트 반환
  }
}

// 새 스페셜 생성 (POST)
export async function POST(request: Request) {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    const body = await request.json();
    const validation = createSpecialSchema.safeParse(body);

    if (!validation.success) {
      // 롤백 전 client release는 불필요, 에러 발생 시 finally에서 처리
      return NextResponse.json({ message: '입력값이 유효하지 않습니다.', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, description, service_ids } = validation.data;

    // 이름 중복 확인
    // TODO: 실제 스페셜 테이블명으로 변경 필요
    const existingSpecial = await client.query('SELECT * FROM specials WHERE name = $1', [name]);
    if (existingSpecial.rows.length > 0) {
      return NextResponse.json({ message: '이미 존재하는 스페셜 이름입니다.' }, { status: 409 });
    }

    // TODO: 트랜잭션 처리 필요 (스페셜 생성 + 서비스 연결)
    const specialResult = await client.query(
      'INSERT INTO specials (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );
    const newSpecial = specialResult.rows[0];

    // service_ids가 제공된 경우, 해당 서비스들을 이 스페셜에 연결
    // 이 부분은 Service 모델에 specialId 필드가 있거나, 별도의 매핑 테이블이 있는 경우에 따라 구현이 달라짐
    if (service_ids && service_ids.length > 0) {
      // 예시: Service 테이블에 special_id 필드가 있다고 가정
      // 실제 서비스 테이블명과 special_id 컬럼명 확인 필요
      for (const serviceId of service_ids) {
        await client.query('UPDATE services SET special_id = $1 WHERE id = $2', [newSpecial.id, serviceId]);
      }
      // TODO: 에러 처리 및 롤백 로직 추가 고려
    }

    await client.query('COMMIT');
    // 생성된 스페셜 정보 (연결된 서비스 정보 포함 여부는 선택)
    return NextResponse.json(newSpecial, { status: 201 });
  } catch (error: any) { 
    await client.query('ROLLBACK');
    console.error('Error creating special:', error);
    if (error instanceof z.ZodError) {
        return NextResponse.json({ message: '입력값 유효성 검사 실패', errors: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ message: '스페셜 생성 중 오류가 발생했습니다.', error: String(error) }, { status: 500 });
  } finally {
    client.release();
  }
} 
 