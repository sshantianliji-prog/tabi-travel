'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  TravelType, Duration, Budget, Region, Interest, AccommodationType, TravelStyle, Season,
  TravelPreferences,
  TRAVEL_TYPE_LABELS, DURATION_LABELS, BUDGET_LABELS, REGION_LABELS, REGION_ICONS, REGION_GROUPS,
  INTEREST_LABELS, INTEREST_ICONS,
  ACCOMMODATION_LABELS, ACCOMMODATION_ICONS,
  TRAVEL_STYLE_LABELS, TRAVEL_STYLE_ICONS,
  SEASON_LABELS, SEASON_ICONS,
} from '@/types/travel';

const TRAVEL_TYPE_ICONS: Record<TravelType, string> = { solo: '🧳', couple: '💑', friends: '👫', family: '👨‍👩‍👧‍👦' };
const DURATION_ICONS: Record<Duration, string> = { 'day-trip': '☀️', '1night2days': '🌙', '2nights3days': '🌟', '3plus': '🗓️' };
const BUDGET_ICONS: Record<Budget, string> = {
  'under10k': '🪙', '10k-30k': '💴', '30k-50k': '💰', '50k-80k': '💳',
  '80k-120k': '✨', '120k-200k': '💎', '200k-300k': '👑', 'over300k': '🌟',
};

const STEPS = ['旅行タイプ', '期間', '予算', '出発地', '目的地', '興味テーマ', '宿泊スタイル', 'スタイル・季節'];

interface SessionMember { name: string; joinedAt: string; }
interface Session { id: string; hostName: string; members: SessionMember[]; plan?: object; }
type Phase = 'lobby' | 'form' | 'waiting' | 'generating';

export default function GroupPage() {
  const params = useParams();
  const sessionId = typeof params?.sessionId === 'string' ? params.sessionId : '';
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [phase, setPhase] = useState<Phase>('lobby');
  const [myName, setMyName] = useState('');
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<Partial<TravelPreferences>>({ interests: [] });
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/group/${sessionId}`);
      if (res.ok) setSession(await res.json());
    } catch { /* silent */ }
  }, [sessionId]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  useEffect(() => {
    if (phase !== 'waiting') return;
    const id = setInterval(fetchSession, 3000);
    return () => clearInterval(id);
  }, [phase, fetchSession]);

  function advance() { setStep((s) => s + 1); }

  function selectSingle<T extends keyof Omit<TravelPreferences, 'interests'>>(key: T, value: TravelPreferences[T]) {
    setPrefs((p) => ({ ...p, [key]: value }));
    setTimeout(advance, 200);
  }

  function toggleInterest(interest: Interest) {
    setPrefs((p) => {
      const cur = p.interests ?? [];
      return { ...p, interests: cur.includes(interest) ? cur.filter((i) => i !== interest) : [...cur, interest] };
    });
  }

  function isComplete(): boolean {
    return !!(prefs.travelType && prefs.duration && prefs.budget && prefs.region &&
      (prefs.interests ?? []).length > 0 && prefs.accommodationType && prefs.travelStyle && prefs.season);
  }

  async function handleJoin() {
    setError('');
    if (!isComplete()) { setError('全ての項目を入力してください'); return; }
    try {
      const res = await fetch(`/api/group/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: myName, preferences: prefs }),
      });
      if (!res.ok) throw new Error('参加に失敗しました');
      await fetchSession();
      setPhase('waiting');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '参加に失敗しました');
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch(`/api/group/${sessionId}/generate`, { method: 'POST' });
      const data = await res.json();
      if (data.plan) {
        router.push(`/result?plan=${encodeURIComponent(JSON.stringify(data.plan))}&group=true`);
      } else {
        throw new Error(data.error ?? 'プラン生成に失敗しました');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
      setGenerating(false);
    }
  }

  if (!sessionId) return <div className="flex items-center justify-center min-h-screen"><p className="text-red-400">セッションIDが不正です</p></div>;
  if (!session) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-400">読み込み中...</p></div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Lobby */}
        {phase === 'lobby' && (
          <div className="text-center">
            <div className="text-5xl mb-4">👥</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">グループ旅行プランに参加</h1>
            <p className="text-gray-500 mb-6">セッションID: <span className="font-mono font-bold text-sky-600">{sessionId}</span></p>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <p className="text-sm text-gray-500 mb-3">参加済み（{session.members.length}人）</p>
              {session.members.map((m) => (
                <div key={m.joinedAt} className="flex items-center gap-2 py-2 border-b last:border-0">
                  <span className="text-lg">👤</span>
                  <span className="text-gray-800">{m.name}</span>
                </div>
              ))}
            </div>
            <input type="text" placeholder="あなたの名前を入力" value={myName} onChange={(e) => setMyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && myName.trim() && setPhase('form')}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-lg mb-4 focus:border-sky-400 focus:outline-none" />
            <button onClick={() => myName.trim() && setPhase('form')} disabled={!myName.trim()}
              className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-2xl disabled:opacity-40 hover:shadow-lg transition-all">
              希望を入力して参加する →
            </button>
          </div>
        )}

        {/* Form */}
        {phase === 'form' && (
          <div>
            <div className="mb-8">
              <div className="flex gap-1 mb-2">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-gradient-to-r from-sky-500 to-indigo-600' : 'bg-gray-200'}`} />
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">STEP {step + 1} / {STEPS.length}　<span className="font-semibold text-gray-700">{STEPS[step]}</span></p>
            </div>

            {step === 0 && (
              <StepSection title="旅行タイプは？">
                <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(TRAVEL_TYPE_LABELS) as TravelType[]).map((k) => (
                    <ChoiceCard key={k} icon={TRAVEL_TYPE_ICONS[k]} label={TRAVEL_TYPE_LABELS[k]} selected={prefs.travelType === k} onClick={() => selectSingle('travelType', k)} />
                  ))}
                </div>
              </StepSection>
            )}
            {step === 1 && (
              <StepSection title="旅行の期間は？">
                <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(DURATION_LABELS) as Duration[]).map((k) => (
                    <ChoiceCard key={k} icon={DURATION_ICONS[k]} label={DURATION_LABELS[k]} selected={prefs.duration === k} onClick={() => selectSingle('duration', k)} />
                  ))}
                </div>
              </StepSection>
            )}
            {step === 2 && (
              <StepSection title="予算は？（1人あたり・交通費込み）">
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(BUDGET_LABELS) as Budget[]).map((k) => (
                    <ChoiceCard key={k} icon={BUDGET_ICONS[k]} label={BUDGET_LABELS[k]} selected={prefs.budget === k} onClick={() => selectSingle('budget', k)} />
                  ))}
                </div>
              </StepSection>
            )}
            {step === 3 && (
              <StepSection title="どこから出発しますか？">
                <p className="text-center text-sm text-gray-500 mb-4">出発地を選ぶと交通費もプランに含まれます</p>
                <div className="max-h-[360px] overflow-y-auto pr-1 space-y-5 mb-4">
                  {REGION_GROUPS.filter(g => g.label !== 'おまかせ').map((group) => (
                    <div key={group.label}>
                      <p className="text-xs font-bold text-gray-400 tracking-wider mb-2">{group.label}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {group.regions.filter(k => k !== 'ai-suggest').map((key) => (
                          <ChoiceCard key={key} icon={REGION_ICONS[key]} label={REGION_LABELS[key]} selected={prefs.departureRegion === key} onClick={() => selectSingle('departureRegion', key)} compact />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={advance} className="w-full py-3 border border-gray-300 text-gray-500 rounded-2xl text-sm hover:bg-gray-50 transition-all">
                  スキップ（出発地を指定しない）
                </button>
              </StepSection>
            )}
            {step === 4 && (
              <StepSection title="どの都道府県を旅したい？">
                <div className="max-h-[420px] overflow-y-auto pr-1 space-y-5">
                  {REGION_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-xs font-bold text-gray-400 tracking-wider mb-2">{group.label}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {group.regions.map((key) => (
                          <ChoiceCard key={key} icon={REGION_ICONS[key]} label={REGION_LABELS[key]} selected={prefs.region === key} onClick={() => selectSingle('region', key)} compact />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </StepSection>
            )}
            {step === 5 && (
              <StepSection title="興味テーマ（複数OK）">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {(Object.keys(INTEREST_LABELS) as Interest[]).map((k) => (
                    <ChoiceCard key={k} icon={INTEREST_ICONS[k]} label={INTEREST_LABELS[k]} selected={(prefs.interests ?? []).includes(k)} onClick={() => toggleInterest(k)} />
                  ))}
                </div>
                <button onClick={() => (prefs.interests ?? []).length > 0 && advance()} disabled={(prefs.interests ?? []).length === 0}
                  className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-2xl disabled:opacity-40 hover:shadow-lg transition-all">
                  次へ →（{(prefs.interests ?? []).length}つ選択中）
                </button>
              </StepSection>
            )}
            {step === 6 && (
              <StepSection title="どんな宿に泊まりたい？">
                <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(ACCOMMODATION_LABELS) as AccommodationType[]).map((k) => (
                    <ChoiceCard key={k} icon={ACCOMMODATION_ICONS[k]} label={ACCOMMODATION_LABELS[k]} selected={prefs.accommodationType === k} onClick={() => selectSingle('accommodationType', k)} />
                  ))}
                </div>
              </StepSection>
            )}
            {step === 7 && (
              <StepSection title="旅のスタイルと季節">
                <p className="text-xs font-bold text-gray-400 tracking-wider mb-3">旅のスタイル</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {(Object.keys(TRAVEL_STYLE_LABELS) as TravelStyle[]).map((k) => (
                    <ChoiceCard key={k} icon={TRAVEL_STYLE_ICONS[k]} label={TRAVEL_STYLE_LABELS[k]} selected={prefs.travelStyle === k} onClick={() => setPrefs((p) => ({ ...p, travelStyle: k }))} />
                  ))}
                </div>
                <p className="text-xs font-bold text-gray-400 tracking-wider mb-3">旅行する季節</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {(Object.keys(SEASON_LABELS) as Season[]).map((k) => (
                    <ChoiceCard key={k} icon={SEASON_ICONS[k]} label={SEASON_LABELS[k]} selected={prefs.season === k} onClick={() => setPrefs((p) => ({ ...p, season: k }))} />
                  ))}
                </div>
                {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
                <button onClick={handleJoin} disabled={!isComplete()}
                  className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-lg font-semibold rounded-2xl disabled:opacity-40 hover:shadow-lg transition-all">
                  グループに参加する ✅
                </button>
              </StepSection>
            )}

            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="mt-6 text-sm text-gray-400 hover:text-gray-600">← 前に戻る</button>
            )}
          </div>
        )}

        {/* Waiting Room */}
        {phase === 'waiting' && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">参加完了！</h2>
            <p className="text-gray-500 mb-8">全員が揃ったらプランを生成してください</p>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <p className="text-sm font-semibold text-gray-500 mb-4">参加済み（{session.members.length}人）</p>
              {session.members.map((m) => (
                <div key={m.joinedAt} className="flex items-center gap-3 py-3 border-b last:border-0">
                  <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">{m.name[0]}</span>
                  <span className="text-gray-800 font-medium">{m.name}</span>
                  <span className="ml-auto text-xs text-green-500">✓ 入力済み</span>
                </div>
              ))}
            </div>
            <div className="bg-sky-50 rounded-xl px-4 py-3 mb-6 text-sm text-sky-700">
              このURLを仲間に共有：
              <p className="font-mono text-xs mt-1 break-all">{typeof window !== 'undefined' ? window.location.href : ''}</p>
            </div>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button onClick={handleGenerate} disabled={generating}
              className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-lg font-semibold rounded-2xl disabled:opacity-60 hover:shadow-lg transition-all">
              {generating ? 'AIがプランを生成中...' : `${session.members.length}人分のプランを生成する ✨`}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function StepSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h2 className="text-2xl font-bold text-gray-900 mb-5 text-center">{title}</h2>{children}</div>;
}

function ChoiceCard({ icon, label, selected, onClick, compact = false }: {
  icon: string; label: string; selected: boolean; onClick: () => void; compact?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-150 cursor-pointer ${compact ? 'p-2 gap-1' : 'p-5 gap-2'} ${selected ? 'border-sky-500 bg-sky-50 shadow-md scale-105' : 'border-gray-200 bg-white hover:border-sky-300 hover:bg-sky-50'}`}>
      <span className={compact ? 'text-xl' : 'text-3xl'}>{icon}</span>
      <span className={`font-medium text-gray-800 text-center leading-tight ${compact ? 'text-xs' : 'text-sm'}`}>{label}</span>
    </button>
  );
}
