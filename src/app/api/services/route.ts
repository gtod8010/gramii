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
      'st.category_id',
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
      service_type_id,
      service_name,
      min_order_quantity,
      max_order_quantity,
      price_per_unit,
      description,
      external_id,
    } = await req.json();

    // 입력값 유효성 검사
    if (
      service_type_id === undefined ||
      !service_name ||
      min_order_quantity === undefined ||
      max_order_quantity === undefined ||
      price_per_unit === undefined
    ) {
      return NextResponse.json(
        { message: '필수 입력값을 모두 제공해야 합니다. (서비스 타입, 서비스명, 수량, 가격)' },
        { status: 400 }
      );
    }
    
    if (
      typeof service_type_id !== 'number' ||
      typeof min_order_quantity !== 'number' ||
      typeof max_order_quantity !== 'number' ||
      typeof price_per_unit !== 'number'
    ) {
      return NextResponse.json(
        { message: 'ID, 수량, 가격은 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (min_order_quantity < 0 || max_order_quantity < 0 || price_per_unit < 0) {
        return NextResponse.json(
            { message: '수량과 가격은 0 이상이어야 합니다.' },
            { status: 400 }
        );
    }

    if (min_order_quantity > max_order_quantity) {
      return NextResponse.json(
        { message: '최소 주문 수량은 최대 주문 수량보다 클 수 없습니다.' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // 서비스 타입 존재 여부 확인
      const serviceTypeExists = await client.query('SELECT id FROM service_types WHERE id = $1', [service_type_id]);
      if (serviceTypeExists.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ message: '존재하지 않는 서비스 타입입니다.' }, { status: 400 });
      }

      const newServiceResult = await client.query(
        `INSERT INTO services 
          (service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [
          service_type_id,
          service_name,
          description,
          price_per_unit,
          min_order_quantity,
          max_order_quantity,
          external_id,
        ]
      );

      await client.query('COMMIT');
      
      return NextResponse.json(newServiceResult.rows[0], { status: 201 });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Service creation error:', error);
      return NextResponse.json({ message: '서비스 생성 중 서버 오류가 발생했습니다.' }, { status: 500 });
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Invalid request body:', error);
    return NextResponse.json({ message: '잘못된 요청 형식입니다.' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id || isNaN(parseInt(id, 10))) {
        return NextResponse.json({ message: '유효한 서비스 ID가 필요합니다.' }, { status: 400 });
    }
    const serviceId = parseInt(id, 10);
    
    const {
      service_type_id: serviceTypeId,
      name: serviceName,
      description,
      price_per_unit: pricePerUnit,
      min_order_quantity: minOrderQuantity,
      max_order_quantity: maxOrderQuantity,
      is_active: isActive,
      special_id: specialId,
      external_id: externalId,
    } = await req.json();

    // 입력값 유효성 검사 (필수값 확인)
    if (
      serviceTypeId === undefined ||
      !serviceName ||
      minOrderQuantity === undefined ||
      maxOrderQuantity === undefined ||
      pricePerUnit === undefined ||
      isActive === undefined
    ) {
      return NextResponse.json({ message: '필수 필드를 모두 제공해야 합니다.' }, { status: 400 });
    }

    // 최소/최대 주문 수량 검사
    if (minOrderQuantity > maxOrderQuantity) {
      return NextResponse.json(
        { message: '최소 주문 수량은 최대 주문 수량보다 클 수 없습니다.' },
        { status: 400 }
      );
    }
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const updateResult = await client.query(
            `UPDATE services 
             SET 
               service_type_id = $1, 
               name = $2, 
               description = $3, 
               price_per_unit = $4, 
               min_order_quantity = $5, 
               max_order_quantity = $6, 
               is_active = $7,
               special_id = $8,
               external_id = $9,
               updated_at = NOW()
             WHERE id = $10
             RETURNING *`,
            [
                serviceTypeId,
                serviceName,
                description,
                pricePerUnit,
                minOrderQuantity,
                maxOrderQuantity,
                isActive,
                specialId,
                externalId,
                serviceId
            ]
        );

        if (updateResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ message: '서비스를 찾을 수 없습니다.' }, { status: 404 });
        }

        await client.query('COMMIT');
        
        return NextResponse.json(updateResult.rows[0]);

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Service update error:', error);
        return NextResponse.json({ message: '서비스 업데이트 중 서버 오류가 발생했습니다.' }, { status: 500 });
    } finally {
        client.release();
    }

  } catch (error) {
    console.error('Invalid request body for PUT:', error);
    return NextResponse.json({ message: '잘못된 요청 형식입니다.' }, { status: 400 });
  }
}
