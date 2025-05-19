import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// 데이터베이스 쿼리를 실행하는 함수
// 필요에 따라 더 복잡한 트랜잭션 처리 등을 추가할 수 있습니다.
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

// 단일 클라이언트 연결이 필요한 경우 (예: 트랜잭션)
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

// 기본 Pool 객체를 직접 export 할 수도 있습니다 (필요한 경우)
// export const dbPool = getPool();
