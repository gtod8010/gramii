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
    const { userId, serviceId, quantity, totalPrice, requestDetails: linkValue } = body;

    if (!userId || !serviceId || !quantity || !totalPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (quantity <= 0 || totalPrice <= 0) {
      return NextResponse.json({ error: 'Quantity and total price must be positive' }, { status: 400 });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. 사용자 포인트 확인
      const userResult: QueryResult = await client.query('SELECT points FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      const currentUserPoints = userResult.rows[0].points;

      if (currentUserPoints < totalPrice) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
      }

      // 2. 주문 생성
      const orderInsertQuery = `
        INSERT INTO orders (user_id, service_id, quantity, total_price, link, order_status)
        VALUES ($1, $2, $3, $4, $5, 'Pending')
        RETURNING *;
      `;
      const orderResult: QueryResult = await client.query(orderInsertQuery, [
        userId,
        serviceId,
        quantity,
        totalPrice,
        linkValue || null,
      ]);
      const newOrder = orderResult.rows[0];

      // 3. 사용자 포인트 차감
      const updatedPoints = currentUserPoints - totalPrice;
      await client.query('UPDATE users SET points = $1 WHERE id = $2', [updatedPoints, userId]);

      // 4. 포인트 트랜잭션 기록: description 컬럼 및 값 제거
      const pointTransactionQuery = `
        INSERT INTO point_transactions (user_id, related_order_id, amount, transaction_type) 
        VALUES ($1, $2, $3, $4);
      `; // description 컬럼 제거
      await client.query(pointTransactionQuery, [
        userId,
        newOrder.id, 
        -totalPrice, 
        'order_payment',
        // `Payment for order ${newOrder.id}` // description 값 제거
      ]);

      await client.query('COMMIT');

      return NextResponse.json({ message: 'Order created successfully', order: newOrder, updatedUserPoints: updatedPoints }, { status: 201 });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Order creation error:', error);
      let errorMessage = 'Failed to create order';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return NextResponse.json({ error: errorMessage, details: error }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
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
    const queryParams: any[] = [userId];
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
    return NextResponse.json({ error: errorMessage, details: error }, { status: 500 });
  } finally {
    client.release();
  }
} 
