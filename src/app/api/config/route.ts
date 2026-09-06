import { NextResponse } from 'next/server';
import { readConfig, writeConfig } from '@/lib/config-store';
import { parseConfig } from '@/lib/validate';
import { editKeyFromRequest, isValidEditKey } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = await readConfig();
  return NextResponse.json(config, {
    headers: { 'cache-control': 'no-store' },
  });
}

export async function POST(request: Request) {
  if (!isValidEditKey(editKeyFromRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body must be valid JSON' }, { status: 400 });
  }

  const result = parseConfig(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    // Wholesale overwrite, no partial merge - there is exactly one writer.
    await writeConfig(result.value);
  } catch (error) {
    console.error('[config] write failed', error);
    return NextResponse.json({ error: 'Could not save changes' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, config: result.value });
}
