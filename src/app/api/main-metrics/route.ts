import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // 가정: pool도 export 되어 트랜잭션 등에 사용 가능

export async function GET() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const metricsResult = await client.query('SELECT * FROM main_page_metrics');
    const metrics = metricsResult.rows;

    const now = new Date();
    const todayDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const updatedMetrics: Record<string, number> = {};
    const promises = [];

    for (const metric of metrics) {
      let currentValue = BigInt(metric.current_value);
      const lastCalculatedAt = new Date(metric.last_calculated_at);
      let needsUpdate = false;

      // 시간당 증가 로직
      if (metric.increment_per_hour > 0) {
        const hoursPassed = Math.floor((now.getTime() - lastCalculatedAt.getTime()) / (1000 * 60 * 60));
        if (hoursPassed > 0) {
          currentValue += BigInt(hoursPassed * metric.increment_per_hour);
          needsUpdate = true;
        }
      }

      // 일일 고정 증가 로직
      if (metric.increment_per_day_fixed > 0) {
        const lastIncrementDateStr = metric.last_daily_increment_date ? new Date(metric.last_daily_increment_date).toISOString().split('T')[0] : null;
        // 오늘 날짜와 다르면 증가분을 더하고, 오늘 날짜로 업데이트
        if (lastIncrementDateStr !== todayDate) {
          // 얼마나 많은 날이 지났는지 정확히 계산 (예: 2일 지났으면 2 * 32)
          let daysSinceLastIncrement = 1; // 기본적으로 하루 지났다고 가정
          if (lastIncrementDateStr) {
            const diffTime = Math.abs(now.getTime() - new Date(lastIncrementDateStr).getTime());
            daysSinceLastIncrement = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
          }
          
          // daily_completed는 당일 증가분이므로, base_value_for_daily에 더하거나, 
          // 누적 방식이라면 currentValue에 더함. 여기서는 누적 방식으로 가정.
          // 만약 자정마다 리셋되는 방식이면, currentValue = BigInt(metric.base_value_for_daily) + BigInt(metric.increment_per_day_fixed);
          currentValue += BigInt(daysSinceLastIncrement * metric.increment_per_day_fixed);
          
          promises.push(
            client.query(
              'UPDATE main_page_metrics SET current_value = $1, last_daily_increment_date = $2, last_calculated_at = $3 WHERE metric_id = $4',
              [currentValue.toString(), todayDate, now, metric.metric_id]
            )
          );
          // Update를 promises에 넣었으므로 needsUpdate 플래그는 여기서 직접 관리할 필요 없음 (아래 공통 업데이트 로직과 중복 방지)
        } else if (needsUpdate) { // 시간당 증가는 있었지만, 날짜는 안 바뀐 경우
            promises.push(
              client.query(
                'UPDATE main_page_metrics SET current_value = $1, last_calculated_at = $2 WHERE metric_id = $3',
                [currentValue.toString(), now, metric.metric_id]
              )
            );
        }
      } else if (needsUpdate) { // 시간당 증가만 있고, 일일 증가는 없는 지표가 업데이트 필요한 경우
        promises.push(
          client.query(
            'UPDATE main_page_metrics SET current_value = $1, last_calculated_at = $2 WHERE metric_id = $3',
            [currentValue.toString(), now, metric.metric_id]
          )
        );
      }
      updatedMetrics[metric.metric_id] = Number(currentValue);
    }
    
    if (promises.length > 0) {
        await Promise.all(promises);
    }

    await client.query('COMMIT');
    return NextResponse.json(updatedMetrics);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in /api/main-metrics:', error);
    return NextResponse.json({ message: 'Failed to fetch main page metrics', error: String(error) }, { status: 500 });
  } finally {
    client.release();
  }
} 
