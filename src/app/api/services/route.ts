import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth'; // 가상의 인증 유틸리티 함수

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const serviceTypeId = searchParams.get('serviceTypeId');
  const limit = searchParams.get('limit');

  let userId: number | null = null;
  try {
    userId = await getUserIdFromRequest(request); 
  } catch (authError) {
    console.warn("인증되지 않은 사용자의 서비스 목록 요청 또는 인증 오류:", authError);
  }

  try {
    const selectClauses = [
      's.*',
      'st.name as service_type_name',
      'sc.name as category_name',
      's.special_id',
      'sp.name as special_name'
    ];
    let joinClause = `
      FROM services s
      JOIN service_types st ON s.service_type_id = st.id
      JOIN service_categories sc ON st.category_id = sc.id
      LEFT JOIN specials sp ON s.special_id = sp.id
    `;
    
    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    if (userId) {
      selectClauses.push('usp.custom_price');
      joinClause += ` 
        LEFT JOIN user_service_prices usp 
          ON s.id = usp.service_id AND usp.user_id = $${paramIndex++}
      `;
      queryParams.push(userId);
    } else {
      selectClauses.push('NULL AS custom_price');
    }

    let query = `SELECT ${selectClauses.join(', ')} ${joinClause}`;

    // WHERE 절 구성
    const whereConditions: string[] = [];
    if (serviceTypeId) {
      whereConditions.push(`s.service_type_id = $${queryParams.length + 1}`); 
      queryParams.push(Number(serviceTypeId));
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    // ORDER BY 절 구성
    if (serviceTypeId) {
      query += ` ORDER BY s.id ASC`;
    } else {
      query += ` ORDER BY sc.name ASC, st.name ASC, s.id ASC`;
    }

    if (limit) {
      const limitValue = parseInt(limit, 10);
      if (!isNaN(limitValue) && limitValue > 0) {
        query += ` LIMIT $${queryParams.length + 1}`;
        queryParams.push(limitValue);
      }
    }
    
    // console.log("Executing query:", query, queryParams); // 디버깅용 로그
    const result = await pool.query(query, queryParams);
    
    // 후처리 로직은 custom_price가 항상 존재하므로 (NULL 또는 값) 더 이상 필요하지 않을 수 있음
    // 하지만, 만약의 경우를 대비해 유지하거나, row.custom_price가 undefined인 경우만 처리하도록 수정 가능
    const servicesWithCustomPrice = result.rows.map(row => ({
      ...row,
      // custom_price는 이제 쿼리에서 NULL AS custom_price로 처리되므로 항상 존재
      // 다만, DB에서 명시적으로 NULL이 아닌 undefined를 반환하는 경우가 있다면 아래 로직 유효
      custom_price: row.custom_price === undefined ? null : row.custom_price,
      special_name: row.special_name === undefined ? null : row.special_name,
      special_id: row.special_id === undefined ? null : row.special_id
    }));

    return NextResponse.json(servicesWithCustomPrice);

  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ message: '서비스 조회 중 오류가 발생했습니다.', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      category_id: categoryId,
      new_category_name: newCategoryName,
      service_type_id: serviceTypeId,
      new_service_type_name: newServiceTypeName,
      service_name: serviceName,
      min_order_quantity: minOrderQuantity,
      max_order_quantity: maxOrderQuantity,
      price_per_unit: pricePerUnit,
      description,
    } = await req.json();

    // 입력값 유효성 검사
    if (
      (categoryId === undefined && !newCategoryName) ||
      (serviceTypeId === undefined && !newServiceTypeName) ||
      !serviceName ||
      minOrderQuantity === undefined ||
      maxOrderQuantity === undefined ||
      pricePerUnit === undefined
    ) {
      return NextResponse.json(
        { message: '필수 입력값을 모두 제공해야 합니다. (카테고리 정보, 서비스 타입 정보, 서비스명, 수량, 가격)' },
        { status: 400 }
      );
    }

    if (newCategoryName && typeof newCategoryName !== 'string') {
        return NextResponse.json( { message: '새 카테고리 이름은 문자열이어야 합니다.' },{ status: 400 });
    }
    if (!newCategoryName && categoryId !== undefined && typeof categoryId !== 'number') {
        return NextResponse.json( { message: '카테고리 ID는 숫자여야 합니다.' }, { status: 400 });
    }
    if (!newServiceTypeName && serviceTypeId !== undefined && typeof serviceTypeId !== 'number') {
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
