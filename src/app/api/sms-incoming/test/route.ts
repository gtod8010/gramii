import { NextRequest, NextResponse } from 'next/server';
import { serverEmitter } from '@/lib/events';

/**
 * 안드로이드 앱의 'Send Test SMS' 요청을 받으면
 * 실시간 알림 채널에 이벤트를 발생시키는 핸들러.
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문을 받을 수 있지만, 사용하지는 않습니다.
    // 연결 테스트가 목적이므로, 요청이 성공적으로 도달했다는 것만으로 충분합니다.
    const payload = await request.json();
    console.log('Received test payload:', payload);

    // '충전 관리' 페이지에 접속해 있는 관리자에게 실시간 알림을 보낸다.
    serverEmitter.emit('sms-test-received');

    return NextResponse.json(
      { message: 'Test event sent to admin page.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing test request:', error);
    return NextResponse.json(
      { error: 'Invalid test request or server error.' },
      { status: 400 }
    );
  }
} 
