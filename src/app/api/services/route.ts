import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { pool } from '@/lib/db';

const serviceSchema = z.object({
  name: z.string().min(1, { message: '서비스 이름을 입력해주세요.' }).max(255),
  service_type_id: z.number().int().positive({ message: '서비스 타입 ID는 양의 정수여야 합니다.' }),
  description: z.string().nullable().optional(),
  price_per_unit: z.number().nonnegative({ message: '개당 가격은 0 이상이어야 합니다.' }).default(0),
  min_order_quantity: z.number().int().min(1, {message: '최소 주문 수량은 1 이상이어야 합니다.' }).default(1),
  max_order_quantity: z.number().int().min(1, {message: '최대 주문 수량은 1 이상이어야 합니다.' })
    .refine(val => val > 0, { message: '최대 주문 수량은 양의 정수여야 합니다.' }),
  is_active: z.boolean().default(true).optional(),
  external_id: z.string().max(255).nullable().optional(),
}).refine(data => {
    if (data.max_order_quantity !== undefined && data.min_order_quantity !== undefined) {
        return data.max_order_quantity >= data.min_order_quantity;
    }
    return true;
}, {
  message: '최대 주문 수량은 최소 주문 수량보다 크거나 같아야 합니다.',
  path: ['max_order_quantity'], 
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const serviceTypeId = searchParams.get('serviceTypeId');

  try {
    let query = 'SELECT s.*, st.name as service_type_name, st.category_id, sc.name as category_name FROM services s JOIN service_types st ON s.service_type_id = st.id JOIN service_categories sc ON st.category_id = sc.id';
    const queryParams = [];

    if (serviceTypeId) {
      query += ' WHERE s.service_type_id = $1';
      queryParams.push(Number(serviceTypeId));
      query += ' ORDER BY s.id ASC'; 
    } else {
      query += ' ORDER BY sc.name ASC, st.name ASC, s.id ASC';
    }

    const result = await pool.query(query, queryParams);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ message: '서비스 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      categoryId,
      newCategoryName,
      serviceTypeId,
      newServiceTypeName,
      serviceName,
      minOrderQuantity,
      maxOrderQuantity,
      pricePerUnit,
      description,
    } = await req.json();

    // 입력값 유효성 검사
    if (
      (categoryId === undefined && !newCategoryName) ||
      (serviceTypeId === undefined && !newServiceTypeName) ||
      !serviceName ||
      minOrderQuantity === undefined ||
      maxOrderQuantity === undefined ||
      pricePerUnit === undefined ||
      !description
    ) {
      return NextResponse.json(
        { message: '필수 입력값을 모두 제공해야 합니다. (카테고리 정보, 서비스 타입 정보, 서비스명, 수량, 가격, 설명)' },
        { status: 400 }
      );
    }

    if (newCategoryName && typeof newCategoryName !== 'string') {
        return NextResponse.json( { message: '새 카테고리 이름은 문자열이어야 합니다.' },{ status: 400 });
    }
    if (categoryId !== undefined && typeof categoryId !== 'number') {
        return NextResponse.json( { message: '카테고리 ID는 숫자여야 합니다.' }, { status: 400 });
    }
    if (serviceTypeId !== undefined && typeof serviceTypeId !== 'number') {
        return NextResponse.json( { message: '서비스 타입 ID는 숫자여야 합니다.' }, { status: 400 });
    }
    if (newServiceTypeName && typeof newServiceTypeName !== 'string') {
        return NextResponse.json( { message: '새 서비스 타입 이름은 문자열이어야 합니다.' },{ status: 400 });
    }
    
    if (
      typeof minOrderQuantity !== 'number' ||
      typeof maxOrderQuantity !== 'number' ||
      typeof pricePerUnit !== 'number'
    ) {
      return NextResponse.json(
        { message: '수량과 가격은 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (minOrderQuantity < 0 || maxOrderQuantity < 0 || pricePerUnit < 0) {
        return NextResponse.json(
            { message: '수량과 가격은 0 이상이어야 합니다.' },
            { status: 400 }
        );
    }

    if (minOrderQuantity > maxOrderQuantity) {
      return NextResponse.json(
        { message: '최소 주문 수량은 최대 주문 수량보다 클 수 없습니다.' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let currentCategoryId: number;
      let createdCategoryInfo: { id: number, name: string } | null = null;

      if (newCategoryName) {
        // 새 카테고리 이름이 제공된 경우
        const existingCategoryResult = await client.query(
          'SELECT id FROM service_categories WHERE name = $1',
          [newCategoryName]
        );
        if (existingCategoryResult.rows.length > 0) {
          currentCategoryId = existingCategoryResult.rows[0].id;
           createdCategoryInfo = { id: currentCategoryId, name: newCategoryName };
        } else {
          const newCategoryInsertResult = await client.query(
            'INSERT INTO service_categories (name) VALUES ($1) RETURNING id, name',
            [newCategoryName]
          );
          currentCategoryId = newCategoryInsertResult.rows[0].id;
          createdCategoryInfo = newCategoryInsertResult.rows[0];
        }
      } else if (categoryId !== undefined) {
        // 기존 카테고리 ID가 제공된 경우
        const categoryExistsResult = await client.query(
          'SELECT id, name FROM service_categories WHERE id = $1',
          [categoryId]
        );
        if (categoryExistsResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            { message: '존재하지 않는 카테고리 ID입니다.' },
            { status: 400 }
          );
        }
        currentCategoryId = categoryExistsResult.rows[0].id;
        createdCategoryInfo = categoryExistsResult.rows[0];
      } else {
        // 이 경우는 앞선 유효성 검사에서 걸러져야 함
        await client.query('ROLLBACK');
        return NextResponse.json({ message: '카테고리 정보가 누락되었습니다.' }, { status: 400 });
      }

      // 2. 서비스 타입 확인 또는 생성 (결정된 currentCategoryId 참조)
      let typeResult;
      let typeId: number;

      if (newServiceTypeName) {
        // 새 서비스 타입 이름이 제공된 경우
        const existingTypeResult = await client.query(
          'SELECT id FROM service_types WHERE name = $1 AND category_id = $2',
          [newServiceTypeName, currentCategoryId]
        );
        if (existingTypeResult.rows.length > 0) {
          typeId = existingTypeResult.rows[0].id;
        } else {
          typeResult = await client.query(
            'INSERT INTO service_types (name, category_id) VALUES ($1, $2) RETURNING id',
            [newServiceTypeName, currentCategoryId]
          );
          typeId = typeResult.rows[0].id;
        }
      } else if (serviceTypeId !== undefined) {
        // 기존 서비스 타입 ID가 제공된 경우
        const typeExistsResult = await client.query(
          'SELECT id FROM service_types WHERE id = $1 AND category_id = $2',
          [serviceTypeId, currentCategoryId]
        );
        if (typeExistsResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            { message: '존재하지 않거나 해당 카테고리에 속하지 않는 서비스 타입 ID입니다.' },
            { status: 400 }
          );
        }
        typeId = typeExistsResult.rows[0].id;
      } else {
        // 이 경우는 앞선 유효성 검사에서 걸러져야 함
        await client.query('ROLLBACK');
        return NextResponse.json({ message: '서비스 타입 정보가 누락되었습니다.' }, { status: 400 });
      }
      
      // 기존 코드에서 typeName을 사용하던 부분을 newServiceTypeName 또는 조회된 타입 이름으로 대체해야 함 (응답 데이터 구성 시)
      const finalTypeName = newServiceTypeName ? newServiceTypeName.trim() :
                            (await client.query('SELECT name FROM service_types WHERE id = $1', [typeId])).rows[0]?.name;

      // 3. 세부 서비스 생성
      const serviceResult = await client.query(
        `INSERT INTO services 
          (service_type_id, name, description, min_order_quantity, max_order_quantity, price_per_unit) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, name, description, min_order_quantity, max_order_quantity, price_per_unit, created_at`,
        [
          typeId,
          serviceName,
          description,
          minOrderQuantity,
          maxOrderQuantity,
          pricePerUnit,
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json(
        {
          message: '서비스가 성공적으로 등록되었습니다.',
          service: serviceResult.rows[0],
          category: createdCategoryInfo,
          type: { id: typeId, name: finalTypeName, category_id: currentCategoryId }
        },
        { status: 201 }
      );
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Service registration error:', error);
      return NextResponse.json(
        { message: '서비스 등록 중 오류가 발생했습니다.', error: (error as Error).message },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Invalid request body:', error);
    return NextResponse.json(
      { message: '요청 처리 중 오류가 발생했습니다.', error: (error as Error).message },
      { status: 400 }
    );
  }
} 