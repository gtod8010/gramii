import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: Request) {
  const { amount, depositorName, userId, accountNumber, receiptType, receiptInfo } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: User ID is missing' }, { status: 401 });
  }
  
  if (!amount || typeof amount !== 'number' || amount <= 0 || !depositorName || typeof depositorName !== 'string') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  if (receiptType === 'tax_invoice' && (typeof receiptInfo !== 'object' || receiptInfo === null)) {
    return NextResponse.json({ error: '세금계산서 정보가 올바르지 않습니다.' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = `
      INSERT INTO deposit_requests (user_id, amount, depositor_name, status, account_number, receipt_type, matched_tran_info)
      VALUES ($1, $2, $3, 'pending', $4, $5, $6)
      RETURNING id
    `;
    
    const receiptInfoJson = receiptInfo ? JSON.stringify(receiptInfo) : null;

    const result = await client.query(query, [userId, amount, depositorName, accountNumber, receiptType, receiptInfoJson]);

    await client.query('COMMIT');

    return NextResponse.json({ 
      message: 'Recharge request submitted successfully',
      depositId: result.rows[0].id 
    }, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to create recharge request:', error);
    return NextResponse.json({ error: 'Failed to create recharge request' }, { status: 500 });
  } finally {
    client.release();
  }
} 
