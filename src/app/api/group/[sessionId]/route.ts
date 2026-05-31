import { NextRequest, NextResponse } from 'next/server';
import { getSession, addMember } from '@/lib/group-store';
import { TravelPreferences } from '@/types/travel';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'セッションが見つかりません' }, { status: 404 });
  return NextResponse.json(session);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const { name, preferences }: { name: string; preferences: TravelPreferences } = await req.json();
  const ok = addMember(sessionId, { name, preferences, joinedAt: new Date().toISOString() });
  if (!ok) return NextResponse.json({ error: 'セッションが見つかりません' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
