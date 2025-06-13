import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.REALSITE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured on the server.' }, { status: 500 });
  }

  try {
    const response = await fetch('https://realsite.shop/api/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: apiKey,
        action: 'services',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Realsite API Error:', errorText);
      return NextResponse.json({ error: `Failed to fetch from external API: ${response.statusText}`, details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error calling Realsite API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to connect to the external service.', details: errorMessage }, { status: 500 });
  }
} 
