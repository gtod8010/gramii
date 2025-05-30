import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';
import { z } from 'zod';

// 스페셜 수정을 위한 스키마
const updateSpecialSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(255).optional(),
  service_ids: z.array(z.number()).optional(), // 스페셜에 포함될 서비스 ID 목록 (선택적)
});

// 특정 스페셜 조회 (GET by ID) - 트랜잭션 불필요
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { query } = await import('@/lib/db'); // GET을 위해 query 임시 사용
  try {
    const specialId = parseInt(params.id, 10);
    if (isNaN(specialId)) {
      return NextResponse.json({ message: '유효하지 않은 스페셜 ID입니다.' }, { status: 400 });
    }
    const result = await query('SELECT s.*, array_agg(srv.id) FILTER (WHERE srv.id IS NOT NULL) as service_ids FROM specials s LEFT JOIN services srv ON s.id = srv.special_id WHERE s.id = $1 GROUP BY s.id', [specialId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: '스페셜을 찾을 수 없습니다.' }, { status: 404 });
    }
    const special = result.rows[0];
    // service_ids가 null일 경우 빈 배열로 처리 (GROUP BY + array_agg 특징)
    if (special.service_ids === null) {
      special.service_ids = [];
    }
    return NextResponse.json(special);
  } catch (error) {
    console.error(`Error fetching special ${params.id}:`, error);
    return NextResponse.json({ message: '스페셜 조회 중 오류 발생', error: String(error) }, { status: 500 });
  }
}

// 특정 스페셜 수정 (PUT)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const specialId = parseInt(params.id, 10);
    if (isNaN(specialId)) {
      return NextResponse.json({ message: '유효하지 않은 스페셜 ID입니다.' }, { status: 400 });
    }

    const body = await request.json();
    const validation = updateSpecialSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: '입력값이 유효하지 않습니다.', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, description, service_ids } = validation.data;

    if (!name && description === undefined && service_ids === undefined) {
        return NextResponse.json({ message: '수정할 내용이 없습니다.'}, { status: 400 });
    }

    if (name) {
      const existingSpecial = await client.query('SELECT * FROM specials WHERE name = $1 AND id != $2', [name, specialId]);
      if (existingSpecial.rows.length > 0) {
        return NextResponse.json({ message: '이미 존재하는 스페셜 이름입니다.' }, { status: 409 });
      }
    }

    const currentSpecialResult = await client.query('SELECT * FROM specials WHERE id = $1', [specialId]);
    if (currentSpecialResult.rows.length === 0) {
      return NextResponse.json({ message: '수정할 스페셜을 찾을 수 없습니다.' }, { status: 404 });
    }
    const currentSpecial = currentSpecialResult.rows[0];

    const newName = name || currentSpecial.name;
    const newDescription = description !== undefined ? description : currentSpecial.description;

    const updateResult = await client.query(
      'UPDATE specials SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [newName, newDescription, specialId]
    );

    if (updateResult.rows.length === 0) {
      return NextResponse.json({ message: '스페셜 업데이트에 실패했습니다.' }, { status: 404 });
    }

    if (service_ids !== undefined) {
      await client.query('UPDATE services SET special_id = NULL WHERE special_id = $1', [specialId]);
      if (service_ids.length > 0) {
        for (const serviceId of service_ids) {
          await client.query('UPDATE services SET special_id = $1 WHERE id = $2', [specialId, serviceId]);
        }
      }
    }
    
    await client.query('COMMIT');
    // 업데이트 후 상세 정보를 다시 조회하여 반환 (service_ids 포함)
    const finalResult = await client.query('SELECT s.*, array_agg(srv.id) FILTER (WHERE srv.id IS NOT NULL) as service_ids FROM specials s LEFT JOIN services srv ON s.id = srv.special_id WHERE s.id = $1 GROUP BY s.id', [specialId]);
    const updatedSpecial = finalResult.rows[0];
    if (updatedSpecial.service_ids === null) {
      updatedSpecial.service_ids = [];
    }
    return NextResponse.json(updatedSpecial);

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(`Error updating special ${params.id}:`, error);
    if (error instanceof z.ZodError) {
        return NextResponse.json({ message: '입력값 유효성 검사 실패', errors: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ message: '스페셜 수정 중 오류가 발생했습니다.', error: String(error) }, { status: 500 });
  } finally {
    client.release();
  }
}

// 특정 스페셜 삭제 (DELETE)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const specialId = parseInt(params.id, 10);
    if (isNaN(specialId)) {
      return NextResponse.json({ message: '유효하지 않은 스페셜 ID입니다.' }, { status: 400 });
    }

    await client.query('UPDATE services SET special_id = NULL WHERE special_id = $1', [specialId]);
    const result = await client.query('DELETE FROM specials WHERE id = $1 RETURNING *', [specialId]);

    if (result.rowCount === 0) {
      await client.query('ROLLBACK'); // 삭제할 대상이 없으면 롤백
      return NextResponse.json({ message: '삭제할 스페셜을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    await client.query('COMMIT');
    return NextResponse.json({ message: '스페셜이 성공적으로 삭제되었습니다.', deletedSpecial: result.rows[0] });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(`Error deleting special ${params.id}:`, error);
    return NextResponse.json({ message: '스페셜 삭제 중 오류가 발생했습니다.', error: String(error) }, { status: 500 });
  } finally {
    client.release();
  }
} 
