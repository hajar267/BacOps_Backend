import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = ['localhost:8000', '127.0.0.1:8000'];
const INTERNAL_API_URL = process.env.API_INTERNAL_URL ?? 'http://localhost:8000';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }
  if (!ALLOWED_HOSTS.includes(parsed.host)) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 403 });
  }

  try {
    const internalUrl = new URL(url);
    internalUrl.protocol = new URL(INTERNAL_API_URL).protocol;
    internalUrl.host = new URL(INTERNAL_API_URL).host;

    const res = await fetch(internalUrl, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return NextResponse.json({ error: 'Fetch failed' }, { status: res.status });

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'image/jpeg' },
    });
  } catch {
    return NextResponse.json({ error: 'Fetch timed out' }, { status: 504 });
  }
}
