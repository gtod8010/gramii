import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authorization token not provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const result = await pool.query(
      'UPDATE deposit_requests SET is_tax_invoice_processed = true WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Deposit request not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tax invoice processed successfully', id: result.rows[0].id });
  } catch (error) {
    // We cannot reliably get `params.id` here if `await params` fails.
    // We log the generic error instead.
    console.error(`Error processing tax invoice for request:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
