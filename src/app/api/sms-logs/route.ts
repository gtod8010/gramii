import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authorization token not provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const client = await pool.connect();
    try {
      const query = `
        SELECT id, sender, body, received_at
        FROM sms_logs
        ORDER BY received_at DESC
        LIMIT 200;
      `;
      const result = await client.query(query);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching sms logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sms logs' },
      { status: 500 }
    );
  }
} 
