import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { pool } from '@/lib/db';

// 서비스 수정을 위한 스키마
const serviceUpdateSchema = z.object({
  name: z.string().min(1, { message: '서비스 이름을 입력해주세요.' }).max(255).optional(),
  service_type_id: z.number().int().positive({ message: '서비스 타입 ID는 양의 정수여야 합니다.' }).optional(),
  description: z.string().nullable().optional(),
  price_per_unit: z.number().nonnegative({ message: '개당 가격은 0 이상이어야 합니다.' }).optional(),
  min_order_quantity: z.number().int().min(1, {message: '최소 주문 수량은 1 이상이어야 합니다.' }).optional(),
  max_order_quantity: z.number().int().min(1, {message: '최대 주문 수량은 1 이상이어야 합니다.' }).optional(), 
  is_active: z.boolean().optional(),
  external_id: z.string().max(255).nullable().optional(),
}).refine(data => {
    // min_order_quantity나 max_order_quantity 중 하나라도 제공되면, 다른 하나는 기존 값과 비교하거나 함께 제공되어야 함
    // 둘 다 제공된 경우 max >= min 이어야 함
    if (data.max_order_quantity !== undefined && data.min_order_quantity !== undefined) {
        return data.max_order_quantity >= data.min_order_quantity;
    }
    // 하나만 제공된 경우 (예: min_order_quantity만 바뀜), 이 refine은 통과시키고 PUT 핸들러에서 기존 값과 비교
    return true; 
  }, {
  message: '최대 주문 수량은 최소 주문 수량보다 크거나 같아야 합니다.',
  path: ['max_order_quantity'], 
});

// 특정 서비스 조회 (GET)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ message: '유효하지 않은 서비스 ID입니다.' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      'SELECT s.*, st.name as service_type_name, sc.name as category_name FROM services s JOIN service_types st ON s.service_type_id = st.id JOIN service_categories sc ON st.category_id = sc.id WHERE s.id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ message: '서비스를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ message: '서비스 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 특정 서비스 수정 (PUT)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ message: '유효하지 않은 서비스 ID입니다.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsedData = serviceUpdateSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ message: '잘못된 입력 값입니다.', errors: parsedData.error.flatten().fieldErrors }, { status: 400 });
    }

    const updateData = parsedData.data;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: '수정할 내용을 입력해주세요.' }, { status: 400 });
    }

    if (updateData.service_type_id) {
      const typeExists = await pool.query('SELECT id FROM service_types WHERE id = $1', [updateData.service_type_id]);
      if (typeExists.rows.length === 0) {
        return NextResponse.json({ message: '존재하지 않는 서비스 타입 ID입니다.' }, { status: 400 });
      }
    }
    
    const currentServiceResult = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    if (currentServiceResult.rows.length === 0) {
        return NextResponse.json({ message: '수정할 서비스를 찾을 수 없습니다.' }, { status: 404 });
    }
    const currentService = currentServiceResult.rows[0];

    // min/max quantity 유효성 검사 (하나만 업데이트될 경우 기존 값과 비교)
    const newMinQuantity = updateData.min_order_quantity ?? currentService.min_order_quantity;
    const newMaxQuantity = updateData.max_order_quantity ?? currentService.max_order_quantity;

    if (newMinQuantity !== undefined && newMaxQuantity !== undefined && newMaxQuantity < newMinQuantity) {
        return NextResponse.json({ message: '최대 주문 수량은 최소 주문 수량보다 크거나 같아야 합니다.' , errors: {max_order_quantity: ['최대 주문 수량은 최소 주문 수량보다 크거나 같아야 합니다.']}}, { status: 400 });
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    // 각 필드가 undefined가 아닐 때만 업데이트 목록에 추가
    // description, external_id는 null로 업데이트 가능해야 하므로, updateData에 해당 키가 존재하면 업데이트 시도
    Object.keys(updateData).forEach(key => {
        const typedKey = key as keyof typeof updateData;
        if (updateData[typedKey] !== undefined) {
            updateFields.push(`${key} = $${paramCount++}`);
            updateValues.push(updateData[typedKey]);
        }
    });
    
    if (updateFields.length === 0) {
        return NextResponse.json({ message: '수정할 내용이 없습니다. (모든 값이 undefined)' }, { status: 400 });
    }

    updateValues.push(id);
    const queryString = `UPDATE services SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(queryString, updateValues);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: '서비스를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating service:', error);
    // @ts-ignore
    if (error.code === '23505') { 
        // @ts-ignore
        if (error.constraint === 'services_service_type_id_name_key') { 
             return NextResponse.json({ message: '해당 서비스 타입 내에 동일한 이름의 서비스가 이미 존재합니다.' }, { status: 409 });
        }
    }
    return NextResponse.json({ message: '서비스 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 특정 서비스 삭제 (DELETE)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ message: '유효하지 않은 서비스 ID입니다.' }, { status: 400 });
  }

  try {
    const orderItemsExist = await pool.query('SELECT id FROM order_items WHERE service_id = $1', [id]);
    if (orderItemsExist.rows.length > 0) {
      return NextResponse.json({ message: '해당 서비스를 참조하는 주문 내역이 있어 삭제할 수 없습니다.' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ message: '서비스를 찾을 수 없거나 이미 삭제되었습니다.' }, { status: 404 });
    }
    return NextResponse.json({ message: '서비스가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting service:', error);
    // @ts-ignore // DELETE에서는 23503 에러를 위에서 이미 처리함.
    return NextResponse.json({ message: '서비스 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 