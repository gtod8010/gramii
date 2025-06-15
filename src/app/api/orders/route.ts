import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { QueryResult } from 'pg';

interface OrderRequestBody {
  userId: number;
  serviceId: number;
  quantity: number;
  totalPrice: number;
  requestDetails?: string;
}

export async function POST(request: Request) {
  try {
    const body: OrderRequestBody = await request.json();
    const { userId, serviceId, quantity /* , totalPrice, requestDetails: linkValue */ } = body;
    const linkValue = body.requestDetails; // requestDetails가 linkValue로 사용됨

    if (!userId || !serviceId || !quantity ) { // totalPrice는 서버에서 계산하므로 요청에서 제외 가능
      return NextResponse.json({ error: 'Missing required fields: userId, serviceId, quantity' }, { status: 400 });
    }
    if (quantity <= 0) {
      return NextResponse.json({ error: 'Quantity must be positive' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. 서비스 기본 정보 조회 (external_id 추가)
      const serviceBaseInfoQuery = 'SELECT price_per_unit, name, min_order_quantity, max_order_quantity, external_id FROM services WHERE id = $1';
      const serviceBaseInfoResult = await client.query(serviceBaseInfoQuery, [serviceId]);

      if (serviceBaseInfoResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      }
      const serviceInfo = serviceBaseInfoResult.rows[0];
      let finalPricePerUnit = serviceInfo.price_per_unit;

      // 2. 주문 수량 유효성 검사 (min_order_quantity, max_order_quantity 사용)
      if (quantity < serviceInfo.min_order_quantity || quantity > serviceInfo.max_order_quantity) {
        await client.query('ROLLBACK');
        return NextResponse.json({ 
          error: `Order quantity must be between ${serviceInfo.min_order_quantity} and ${serviceInfo.max_order_quantity}` 
        }, { status: 400 });
      }

      // 3. 사용자 특별 단가 조회
      const userSpecificPriceQuery = 'SELECT custom_price FROM user_service_prices WHERE user_id = $1 AND service_id = $2';
      const userSpecificPriceResult = await client.query(userSpecificPriceQuery, [userId, serviceId]);

      if (userSpecificPriceResult.rows.length > 0 && userSpecificPriceResult.rows[0].custom_price !== null) {
        finalPricePerUnit = userSpecificPriceResult.rows[0].custom_price; // 특별 단가 적용
      }

      // 4. 최종 주문 가격 계산
      const calculatedTotalPrice = finalPricePerUnit * quantity;

      // 5. 사용자 포인트 확인 및 차감 (기존 로직과 유사하게 진행)
      const userResult: QueryResult = await client.query('SELECT points FROM users WHERE id = $1 FOR UPDATE', [userId]);
      if (userResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      const currentUserPoints = userResult.rows[0].points;

      if (currentUserPoints < calculatedTotalPrice) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
      }

      // Realsite API 연동 로직 추가
      const externalId = serviceInfo.external_id;
      let realsiteOrderId: number | null = null;

      if (externalId) {
        const apiKey = process.env.REALSITE_API_KEY;
        const apiUrl = process.env.REALSITE_API_URL;

        if (!apiKey || !apiUrl) {
          throw new Error('Realsite API 환경 변수가 설정되지 않았습니다.');
        }

        const realsiteResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: apiKey,
            action: 'add',
            service: externalId,
            link: linkValue,
            quantity: quantity,
          }),
        });

        const realsiteData = await realsiteResponse.json();

        if (!realsiteResponse.ok || realsiteData.error) {
          const errorMessage = `Realsite API 주문 실패: ${realsiteData.error || '알 수 없는 오류'}`;
          console.error(errorMessage);
          // 트랜잭션을 롤백시키기 위해 에러를 throw합니다.
          throw new Error('외부 서비스 주문 연동에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }

        if (!realsiteData.order) {
            console.error('Realsite API 응답에 order ID가 없습니다.', realsiteData);
            throw new Error('외부 서비스로부터 유효하지 않은 응답을 받았습니다.');
        }
        realsiteOrderId = parseInt(realsiteData.order, 10);
      }

      // 6. 주문 생성 (realsite_order_id 컬럼 추가)
      const orderInsertQuery = `
        INSERT INTO orders (user_id, service_id, quantity, total_price, link, order_status, processed_quantity, realsite_order_id)
        VALUES ($1, $2, $3, $4, $5, 'pending', 0, $6)
        RETURNING *;
      `;
      const orderResult: QueryResult = await client.query(orderInsertQuery, [
        userId,
        serviceId,
        quantity,
        calculatedTotalPrice,
        linkValue || null,
        realsiteOrderId,
      ]);
      const newOrder = orderResult.rows[0];

      // 7. 사용자 포인트 차감
      const updatedUserPoints = currentUserPoints - calculatedTotalPrice;
      await client.query('UPDATE users SET points = $1 WHERE id = $2', [updatedUserPoints, userId]);

      // 8. 포인트 트랜잭션 기록 수정: description 컬럼 제거
      const finalBalanceAfterOrder = updatedUserPoints;
      const pointTransactionQuery = `
        INSERT INTO point_transactions (user_id, related_order_id, amount, transaction_type, balance_after_transaction)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
      await client.query(pointTransactionQuery, [
        userId,
        newOrder.id, 
        -calculatedTotalPrice, 
        'order_payment',
        finalBalanceAfterOrder,
      ]);

      await client.query('COMMIT');
      return NextResponse.json({ message: 'Order created successfully', order: newOrder, updatedUserPoints: finalBalanceAfterOrder }, { status: 201 });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Order creation error within transaction:', error);
      let errorMessage = 'Failed to create order';
      let errorCode: string | undefined = undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        if (typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string') {
          errorCode = (error as { code: string }).code;
        }

        if (error.message.includes('orders_user_id_fkey')) {
            errorMessage = 'Invalid user for order.';
        } else if (error.message.includes('orders_service_id_fkey')) {
            errorMessage = 'Invalid service for order.';
        } else if (error.message.includes('users_points_check')) {
            errorMessage = 'User points validation failed.';
        } else if (errorCode === '42703') { 
          console.error('Specific column error:', error)
          errorMessage = `Configuration error: A required data field is missing. Please contact support. (Details: ${error.message})`;
        }
      }
      
      const responseDetails: { message: string, stack?: string, code?: string } = { message: errorMessage };
      if (process.env.NODE_ENV === 'development') {
        responseDetails.stack = error instanceof Error ? error.stack : undefined;
        if (errorCode) {
          responseDetails.code = errorCode;
        }
      }

      return NextResponse.json({ error: errorMessage, details: responseDetails }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Request processing error (before DB connect):', error);
    return NextResponse.json({ error: 'Invalid request body or server error' }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const searchTerm = searchParams.get('searchTerm');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    let query = `
      SELECT 
        o.id, 
        s.name AS "serviceName", 
        o.link, 
        o.quantity AS "initialQuantity", 
        o.processed_quantity AS "processedQuantity",
        (o.quantity - o.processed_quantity) AS "remainingQuantity",
        o.total_price AS "orderPrice", 
        o.created_at AS "orderedAt", 
        o.order_status AS status,
        o.order_status AS "rawStatusText" 
      FROM orders o
      JOIN services s ON o.service_id = s.id
      WHERE o.user_id = $1
    `;
    const queryParams: (string | number)[] = [userId];
    let paramCount = 2;

    if (status) {
      query += ` AND o.order_status = $${paramCount++}`;
      queryParams.push(status);
    }

    if (searchTerm) {
      query += ` AND (s.name ILIKE $${paramCount} OR o.link ILIKE $${paramCount} OR o.id::text ILIKE $${paramCount})`;
      queryParams.push(`%${searchTerm}%`);
    }

    // 먼저 전체 카운트를 가져옵니다 (페이지네이션을 위해).
    const totalResult = await client.query(`SELECT COUNT(*) FROM (${query}) AS count_query`, queryParams.slice(0, paramCount - (searchTerm ? 1: 0) )); // searchTerm의 % 와일드카드 제외하고 카운트
    const totalOrders = parseInt(totalResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalOrders / limit);

    query += ` ORDER BY o.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    queryParams.push(limit, offset);
    
    const result: QueryResult = await client.query(query, queryParams);

    // 프론트엔드 Order 인터페이스와 키 이름을 맞추기 위해 가공
    const orders = result.rows.map(row => ({
      ...row,
      initialQuantity: parseInt(row.initialQuantity, 10), // DB에서 숫자로 오지만, sum() 등 집계함수 결과는 문자열일 수 있으므로 안전하게 parseInt
      processedQuantity: parseInt(row.processedQuantity, 10),
      remainingQuantity: parseInt(row.remainingQuantity, 10),
      orderedAt: new Date(row.orderedAt).toISOString(), 
    }));

    return NextResponse.json({
      orders,
      totalPages,
      currentPage: page,
      totalOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    let errorMessage = 'Failed to fetch orders';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
} 
