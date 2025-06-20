import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, sender, body, received_at_app, created_at FROM sms_logs ORDER BY created_at DESC LIMIT 100'
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching SMS logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SMS logs' },
      { status: 500 }
    );
  }
} 
