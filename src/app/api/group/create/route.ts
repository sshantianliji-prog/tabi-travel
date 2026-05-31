import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/group-store';
import { TravelPreferences } from '@/types/travel';

export async function POST(req: NextRequest) {
  const { hostName, preferences }: { hostName: string; preferences: TravelPreferences } = await req.json();
  if (!hostName || !preferences) {
    return NextResponse.json({ error: '名前と条件は必須です' }, { status: 400 });
  }
  const session = createSession(hostName, preferences);
  return NextResponse.json({ sessionId: session.id });
}
