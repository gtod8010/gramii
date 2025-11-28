import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const query = `
        SELECT
          dr.id,
          dr.user_id,
          u.name as user_name,
          u.email as user_email,
          dr.amount,
          dr.deposit_amount,
          dr.depositor_name,
          dr.status,
          dr.receipt_type,
          dr.requested_at,
          dr.confirmed_at,
          dr.receipt_info,
          dr.admin_memo,
          dr.account_number,
          dr.is_tax_invoice_processed,
          EXISTS (
            SELECT 1
            FROM sms_logs sl
            WHERE sl.body LIKE '%' || dr.depositor_name || '%'
              AND sl.body LIKE '%' || REPLACE(to_char(COALESCE(dr.deposit_amount, dr.amount), '999,999,999'), ' ', '') || '%'
          ) AS is_sms_received
        FROM
          deposit_requests dr
        JOIN
          users u ON dr.user_id = u.id
        ORDER BY
          dr.requested_at DESC
        LIMIT 200;
      `;
      const result = await client.query(query);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching deposit requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposit requests' },
      { status: 500 }
    );
  }
} 
