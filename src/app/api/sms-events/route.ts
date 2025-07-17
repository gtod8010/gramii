// SSE functionality is disabled.
export async function GET(request: Request) {
  console.log('SSE disabled', request);
  return new Response('SSE disabled', { status: 404 });
} 
