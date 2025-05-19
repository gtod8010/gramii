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
    }, {});

    // 5. 최근 7일간 일자별 주문 상태 변화 (차트용 데이터)
    // DB 종류에 따라 날짜 함수 및 구문이 다를 수 있습니다. PostgreSQL 기준.
    const chartDataQuery = `
      WITH date_series AS (
        SELECT generate_series(
          current_date - interval '6 days', 
          current_date, 
          '1 day'::interval
        )::date AS order_date
      ),
      daily_orders AS (
        SELECT 
          DATE(created_at) AS order_date,
          order_status,
          COUNT(*) AS count
        FROM orders
        WHERE user_id = $1 AND created_at >= current_date - interval '6 days'
        GROUP BY DATE(created_at), order_status
      )
      SELECT 
        d.order_date,
        COALESCE(do_pending.count, 0) AS "Pending",
        COALESCE(do_processing.count, 0) AS "Processing",
        COALESCE(do_completed.count, 0) AS "Completed",
        COALESCE(do_partial.count, 0) AS "Partial", 
        COALESCE(do_cancelled.count, 0) AS "Cancelled"
      FROM date_series d
      LEFT JOIN daily_orders do_pending ON d.order_date = do_pending.order_date AND do_pending.order_status = 'Pending'
      LEFT JOIN daily_orders do_processing ON d.order_date = do_processing.order_date AND do_processing.order_status = 'Processing'
      LEFT JOIN daily_orders do_completed ON d.order_date = do_completed.order_date AND do_completed.order_status = 'Completed'
      LEFT JOIN daily_orders do_partial ON d.order_date = do_partial.order_date AND do_partial.order_status = 'Partial'
      LEFT JOIN daily_orders do_cancelled ON d.order_date = do_cancelled.order_date AND do_cancelled.order_status = 'Cancelled'
      ORDER BY d.order_date ASC;
    `;
    const chartDataResult: QueryResult = await client.query(chartDataQuery, [userId]);
    
    // 프론트엔드 RecentOrderStatusChart 컴포넌트가 기대하는 ChartDataPoint[] 형태로 가공
    const recentOrderStatusChartData: any[] = chartDataResult.rows.map(r => ({
      date: new Date(r.order_date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }),
      pending: r.Pending,
      processing: r.Processing,
      completed: r.Completed,
      // API 쿼리에서 "Partial"과 "Cancelled"를 사용했으므로, 이를 프론트엔드에서 사용하는 "canceled" 등으로 맞춰야 할 수 있음
      // 현재 RecentOrderStatusChart.tsx는 canceled, refunded를 사용함. API 쿼리 컬럼명과 일치시키거나 여기서 매핑 필요.
      // 우선 API의 컬럼명(대소문자 구분)을 그대로 사용하고, 필요시 프론트엔드에서 조정.
      partial: r.Partial, // 또는  props에 맞게 다른 이름으로 변경 필요
      canceled: r.Cancelled, // API는 Cancelled, 프론트엔드는 canceled
      refunded: 0, // API 쿼리에 Refunded가 없으므로 기본값 0 또는 쿼리 수정 필요
      // API 쿼리에서 반환하는 컬럼명은 "Pending", "Processing", "Completed", "Partial", "Cancelled" 입니다.
      // RecentOrderStatusChart.tsx 에서는 pending, processing, completed, canceled, refunded 를 사용합니다.
      // 여기서 이름을 맞춰줍니다.
    }));

    // 최종 recentOrderStatusChartData는 ChartDataPoint[] 형태가 되어야 함.
    const finalChartData = chartDataResult.rows.map(r => {
      const date = new Date(r.order_date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
      // API 결과의 컬럼 이름은 대문자로 시작 (e.g., r.Pending).
      // RecentOrderStatusChartProps 는 소문자로 시작하는 필드를 기대 (e.g., pending).
      return {
        date: date,
        pending: r.Pending || 0,
        processing: r.Processing || 0,
        completed: r.Completed || 0,
        // 'Partial' 상태를 어떻게 처리할지 결정 필요. 여기서는 일단 0으로.
        // 'canceled'와 'Cancelled' 이름 불일치 해결
        canceled: r.Cancelled || 0,
        // 'refunded'는 현재 쿼리에 없으므로 0으로 설정. 필요시 쿼리 수정.
        refunded: 0, // 예시로 0을 할당. 실제 데이터가 있다면 해당 컬럼 사용.
      };
    });

    return NextResponse.json({
      currentPoints,
      totalSpent,
      totalOrders,
      orderStatusSummary,
      recentOrderStatusChartData: finalChartData, // 수정된 데이터로 교체
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