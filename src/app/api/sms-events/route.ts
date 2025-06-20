import { serverEmitter } from '@/lib/events';

export async function GET(request: Request) {
  // Server-Sent Events를 위한 스트림 생성
  const stream = new ReadableStream({
    start(controller) {
      const onTestReceived = () => {
        controller.enqueue(`data: {"status":"ok"}\n\n`);
      };

      serverEmitter.on('sms-test-received', onTestReceived);

      // 클라이언트 연결이 끊어지면 리스너 정리
      request.signal.onabort = () => {
        serverEmitter.off('sms-test-received', onTestReceived);
        controller.close();
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 
