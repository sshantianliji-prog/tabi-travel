import { TravelPreferences } from '@/types/travel';

export interface GroupMember {
  name: string;
  preferences: TravelPreferences;
  joinedAt: string;
}

export interface GroupSession {
  id: string;
  hostName: string;
  members: GroupMember[];
  createdAt: string;
  plan?: object;
}

// In-memory store (works for local dev/demo; production needs Redis or Supabase)
const store = new Map<string, GroupSession>();

export function createSession(hostName: string, hostPrefs: TravelPreferences): GroupSession {
  const id = Math.random().toString(36).substring(2, 10).toUpperCase();
  const session: GroupSession = {
    id,
    hostName,
    members: [{ name: hostName, preferences: hostPrefs, joinedAt: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
  };
  store.set(id, session);
  return session;
}

export function getSession(id: string): GroupSession | undefined {
  return store.get(id);
}

export function addMember(id: string, member: GroupMember): boolean {
  const session = store.get(id);
  if (!session) return false;
  session.members.push(member);
  return true;
}

export function setSessionPlan(id: string, plan: object): void {
  const session = store.get(id);
  if (session) session.plan = plan;
}
