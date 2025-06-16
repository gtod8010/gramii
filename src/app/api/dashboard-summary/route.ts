import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { QueryResult } from 'pg';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // 1. 예치금 잔액 (users.points)
    const userPointsResult: QueryResult = await client.query(
      'SELECT points FROM users WHERE id = $1',
      [userId]
    );
    const currentPoints = userPointsResult.rows.length > 0 ? userPointsResult.rows[0].points : 0;

    // 2. 총 사용금액 (point_transactions에서 order_payment 합계)
    const totalSpentResult: QueryResult = await client.query(
      "SELECT COALESCE(SUM(ABS(amount)), 0) as total_spent FROM point_transactions WHERE user_id = $1 AND transaction_type = 'order_payment'",
      [userId]
    );
    const totalSpent = totalSpentResult.rows[0].total_spent;

    // 3. 총 주문 건수
    const totalOrdersResult: QueryResult = await client.query(
      'SELECT COUNT(*) as total_orders FROM orders WHERE user_id = $1',
      [userId]
    );
    const totalOrders = totalOrdersResult.rows[0].total_orders;

    // 4. 주문 상태별 건수
    const orderStatusSummaryResult: QueryResult = await client.query(
      "SELECT order_status, COUNT(*) as count FROM orders WHERE user_id = $1 GROUP BY order_status",
      [userId]
    );
    const orderStatusSummary = orderStatusSummaryResult.rows.reduce((acc, row) => {
      acc[row.order_status] = parseInt(row.count, 10);
      return acc;
    }, {} as Record<string, number>);

    // 5. 최근 7일간 일자별 주문 상태 변화 (차트용 데이터) - 쿼리 수정
    const chartDataQuery = `
      WITH date_series AS (
        SELECT generate_series(
          current_date - interval '6 days', 
          current_date, 
          '1 day'::interval
        )::date AS order_date
      )
      SELECT 
        to_char(d.order_date, 'MM-DD') as date,
        COALESCE(SUM(CASE WHEN o.order_status = 'pending' THEN 1 ELSE 0 END), 0) AS pending,
        COALESCE(SUM(CASE WHEN o.order_status = 'processing' THEN 1 ELSE 0 END), 0) AS processing,
        COALESCE(SUM(CASE WHEN o.order_status = 'completed' THEN 1 ELSE 0 END), 0) AS completed,
        COALESCE(SUM(CASE WHEN o.order_status = 'partial' THEN 1 ELSE 0 END), 0) AS partial,
        COALESCE(SUM(CASE WHEN o.order_status = 'canceled' THEN 1 ELSE 0 END), 0) AS canceled,
        COALESCE(SUM(CASE WHEN o.order_status = 'refunded' THEN 1 ELSE 0 END), 0) AS refunded
      FROM date_series d
      LEFT JOIN orders o ON DATE(o.created_at) = d.order_date AND o.user_id = $1
      GROUP BY d.order_date
      ORDER BY d.order_date ASC;
    `;
    const chartDataResult: QueryResult = await client.query(chartDataQuery, [userId]);
    
    // 쿼리에서 이미 원하는 형태로 데이터를 가공했으므로, JS에서의 추가 변환 작업이 거의 필요 없습니다.
    // 숫자형으로 변환해주는 정도만 처리합니다.
    const recentOrderStatusChartData = chartDataResult.rows.map(row => ({
      date: row.date,
      pending: parseInt(row.pending, 10),
      processing: parseInt(row.processing, 10),
      completed: parseInt(row.completed, 10),
      partial: parseInt(row.partial, 10),
      canceled: parseInt(row.canceled, 10),
      refunded: parseInt(row.refunded, 10),
    }));

    // API 응답에서 키 이름을 'canceled'로 통일 (기존: cancelled)
    const sanitizedOrderStatusSummary: Record<string, number> = {};
    for (const key in orderStatusSummary) {
        if (key === 'cancelled') {
             sanitizedOrderStatusSummary['canceled'] = orderStatusSummary[key];
        } else {
             sanitizedOrderStatusSummary[key] = orderStatusSummary[key];
        }
    }

    return NextResponse.json({
      currentPoints: parseFloat(currentPoints),
      totalSpent: parseFloat(totalSpent),
      totalOrders: parseInt(totalOrders, 10),
      orderStatusSummary: sanitizedOrderStatusSummary, // 수정된 summary 전달
      recentOrderStatusChartData, // 수정된 데이터 전달
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    let errorMessage = 'Failed to fetch dashboard summary';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage, details: error }, { status: 500 });
  } finally {
    client.release();
  }
} 
