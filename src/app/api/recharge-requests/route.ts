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
      INSERT INTO deposit_requests (user_id, amount, depositor_name, status, account_number, receipt_type, receipt_info)
      VALUES ($1, $2, $3, 'pending', $4, $5, $6)
      RETURNING id
    `;
    
    const receiptInfoJson = receiptInfo ? JSON.stringify(receiptInfo) : null;

    const result = await client.query(query, [userId, amount, depositorName, accountNumber, receiptType, receiptInfoJson]);

    const newDepositId: number = result.rows[0].id;

    // 신청 직후, 이미 도착해 있는 SMS가 있는지 즉시 역매칭 시도 (정확 일치 정책)
    // 최근 3일 내 SMS에서 금액과 입금자명이 정확히 일치하는 가장 최신 건을 찾음
    const recentSmsQuery = `
      SELECT id, sender, body, received_at
      FROM sms_logs
      WHERE received_at >= NOW() - INTERVAL '3 days'
      ORDER BY received_at DESC
      LIMIT 500
    `;
    const { rows: smsRows } = await client.query(recentSmsQuery);

    // JS 파서: sms-incoming과 동일한 규칙으로 정확한 이름/금액 파싱
    const parseSms = (body: string): { name: string | null, amt: number | null } => {
      let name: string | null = null;
      let amt: number | null = null;

      if (body.includes('[카카오뱅크]')) {
        const m = body.match(/입금 ([\d,]+)원\n([^\n]+)/);
        if (m && m[1] && m[2]) {
          amt = parseInt(m[1].replace(/,/g, ''), 10);
          name = m[2].trim();
        }
      } else if (body.includes('[KB')) {
        const lines = body.split('\n').map(l => l.trim());
        const idx = lines.findIndex(l => l.startsWith('입금'));
        if (idx > 0 && idx < lines.length - 1) {
          const amountStr = lines[idx + 1].replace(/[^0-9]/g, '');
          if (amountStr) {
            amt = parseInt(amountStr, 10);
            name = lines[idx - 1];
          }
        }
      } else {
        const lines = body.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const amountIdx = lines.findIndex(l => /^입금\s*[\d,]+원$/.test(l) || l === '입금');
        if (amountIdx !== -1) {
          let amountCandidate: string | null = null;
          if (/^입금\s*[\d,]+원$/.test(lines[amountIdx])) {
            amountCandidate = (lines[amountIdx].match(/([\d,]+)원$/)?.[1] || '').replace(/,/g, '');
          } else if (lines[amountIdx] === '입금' && amountIdx + 1 < lines.length) {
            amountCandidate = lines[amountIdx + 1].replace(/[^0-9]/g, '');
          }
          if (amountCandidate && amountCandidate.length > 0) {
            amt = parseInt(amountCandidate, 10);
          }
          const isProbableName = (s: string) => {
            if (!s) return false;
            if (s.includes('잔액')) return false;
            if (/[0-9*]/.test(s)) return false;
            return /^[A-Za-z가-힣\s]{2,20}$/.test(s);
          };
          const after = lines.slice(amountIdx + 1, amountIdx + 4);
          const nameAfter = after.find(isProbableName);
          if (nameAfter) {
            name = nameAfter.trim();
          } else {
            const before = lines.slice(Math.max(0, amountIdx - 3), amountIdx).reverse();
            const nameBefore = before.find(isProbableName);
            if (nameBefore) name = nameBefore.trim();
          }
        }
      }
      return { name, amt };
    };

    let matched = false;
    for (const s of smsRows) {
      const { name, amt } = parseSms(String(s.body || ''));
      if (name && amt !== null && !Number.isNaN(amt)) {
        if (name === depositorName && amt === amount) {
          // 정확 일치 → 즉시 충전 처리
          await client.query(`UPDATE deposit_requests SET status='completed', confirmed_at=NOW() WHERE id=$1`, [newDepositId]);
          const updatedUser = await client.query(`UPDATE users SET points = points + $1 WHERE id = $2 RETURNING points`, [amount, userId]);
          const balanceAfter = updatedUser.rows[0].points;
          await client.query(
            `INSERT INTO point_transactions (user_id, amount, transaction_type, balance_after_transaction)
             VALUES ($1, $2, 'deposit', $3)`,
            [userId, amount, balanceAfter]
          );
          matched = true;
          break;
        }
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({ 
      message: matched ? 'Recharge request submitted and auto-matched.' : 'Recharge request submitted successfully',
      depositId: newDepositId,
      autoMatched: matched
    }, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to create recharge request:', error);
    return NextResponse.json({ error: 'Failed to create recharge request' }, { status: 500 });
  } finally {
    client.release();
  }
} 
