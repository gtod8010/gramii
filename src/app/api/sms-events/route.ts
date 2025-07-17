// SSE functionality is disabled.
export async function GET(request: Request) {
  return new Response('SSE disabled', { status: 404 });
} 
