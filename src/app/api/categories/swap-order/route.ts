import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { z } from 'zod';

const swapOrderSchema = z.object({
  category1: z.object({
    id: z.coerce.number(),
    display_order: z.coerce.number(),
  }),
  category2: z.object({
    id: z.coerce.number(),
    display_order: z.coerce.number(),
  }),
});

export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const body = await req.json();
    const parsed = swapOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid input', errors: parsed.error.format() }, { status: 400 });
    }

    const { category1, category2 } = parsed.data;

    // Use a guaranteed non-conflicting temporary value for the swap
    const tempDisplayOrder = -1; 

    await client.query('BEGIN');

    // Step 1: Move category1 to a temporary, non-conflicting display_order
    await client.query(
      'UPDATE service_categories SET display_order = $1 WHERE id = $2',
      [tempDisplayOrder, category1.id]
    );
    
    // Step 2: Move category2 to category1's original (now free) display_order
    await client.query(
      'UPDATE service_categories SET display_order = $1 WHERE id = $2',
      [category1.display_order, category2.id]
    );

    // Step 3: Move category1 (from temp) to category2's original display_order
    await client.query(
      'UPDATE service_categories SET display_order = $1 WHERE display_order = $2',
      [category2.display_order, tempDisplayOrder]
    );

    await client.query('COMMIT');

    return NextResponse.json({ message: 'Order swapped successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error swapping category order:', error);
    return NextResponse.json({ message: 'Error swapping order' }, { status: 500 });
  } finally {
    client.release();
  }
} 
