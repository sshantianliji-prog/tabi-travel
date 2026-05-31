'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function PlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGroupMode = searchParams.get('mode') === 'group';

  const [step, setStep] = useState(0);
  const [myName, setMyName] = useState('');
  const [nameEntered, setNameEntered] = useState(false);
  const [prefs, setPrefs] = useState<Partial<TravelPreferences>>({ interests: [] });
  const [creating, setCreating] = useState(false);
  const [apiError, setApiError] = useState('');

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

  function canGenerate(): boolean {
    return !!(prefs.travelStyle && prefs.season);
  }

  async function handleGenerate() {
    setApiError('');
    if (isGroupMode) {
      setCreating(true);
      try {
        const res = await fetch('/api/group/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hostName: myName, preferences: prefs }),
        });
        if (!res.ok) throw new Error('セッション作成に失敗しました');
        const data = await res.json();
        router.push(`/group/${data.sessionId}`);
      } catch (e: unknown) {
        setApiError(e instanceof Error ? e.message : 'エラーが発生しました');
        setCreating(false);
      }
    } else {
      router.push(`/result?prefs=${encodeURIComponent(JSON.stringify(prefs))}`);
    }
  }

  if (isGroupMode && !nameEntered) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">グループ旅行プランを作成</h2>
          <p className="text-gray-500 mb-8">まずあなたの名前を入力してください</p>
          <input
            type="text"
            placeholder="あなたの名前"
            value={myName}
            onChange={(e) => setMyName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && myName.trim() && setNameEntered(true)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-lg mb-4 focus:border-sky-400 focus:outline-none"
          />
          <button
            onClick={() => myName.trim() && setNameEntered(true)}
            disabled={!myName.trim()}
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-2xl disabled:opacity-40 hover:shadow-lg transition-all"
          >次へ →</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {isGroupMode && (
          <div className="mb-6 bg-sky-50 rounded-xl px-4 py-3 text-sm text-sky-700 text-center">
            👥 グループモード — {myName}さんの希望を入力してください
          </div>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-2 flex-1 mx-0.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-gradient-to-r from-sky-500 to-indigo-600' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            STEP {step + 1} / {STEPS.length}　<span className="font-semibold text-gray-700">{STEPS[step]}</span>
          </p>
        </div>

        {/* Step 0: Travel Type */}
        {step === 0 && (
          <StepSection title="誰と旅行しますか？">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(TRAVEL_TYPE_LABELS) as TravelType[]).map((key) => (
                <ChoiceCard key={key} icon={TRAVEL_TYPE_ICONS[key]} label={TRAVEL_TYPE_LABELS[key]} selected={prefs.travelType === key} onClick={() => selectSingle('travelType', key)} />
              ))}
            </div>
          </StepSection>
        )}

        {/* Step 1: Duration */}
        {step === 1 && (
          <StepSection title="旅行の期間は？">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(DURATION_LABELS) as Duration[]).map((key) => (
                <ChoiceCard key={key} icon={DURATION_ICONS[key]} label={DURATION_LABELS[key]} selected={prefs.duration === key} onClick={() => selectSingle('duration', key)} />
              ))}
            </div>
          </StepSection>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <StepSection title="予算はどのくらい？（1人あたり・交通費込み）">
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(BUDGET_LABELS) as Budget[]).map((key) => (
                <ChoiceCard key={key} icon={BUDGET_ICONS[key]} label={BUDGET_LABELS[key]} selected={prefs.budget === key} onClick={() => selectSingle('budget', key)} />
              ))}
            </div>
          </StepSection>
        )}

        {/* Step 3: Departure Region */}
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

        {/* Step 4: Destination Region */}
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

        {/* Step 5: Interests */}
        {step === 5 && (
          <StepSection title="興味のあるテーマ（複数OK）">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(Object.keys(INTEREST_LABELS) as Interest[]).map((key) => (
                <ChoiceCard key={key} icon={INTEREST_ICONS[key]} label={INTEREST_LABELS[key]} selected={(prefs.interests ?? []).includes(key)} onClick={() => toggleInterest(key)} />
              ))}
            </div>
            <button
              onClick={() => (prefs.interests ?? []).length > 0 && advance()}
              disabled={(prefs.interests ?? []).length === 0}
              className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-lg font-semibold rounded-2xl disabled:opacity-40 hover:shadow-lg transition-all"
            >次へ →（{(prefs.interests ?? []).length}つ選択中）</button>
          </StepSection>
        )}

        {/* Step 6: Accommodation */}
        {step === 6 && (
          <StepSection title="どんな宿に泊まりたい？">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(ACCOMMODATION_LABELS) as AccommodationType[]).map((key) => (
                <ChoiceCard key={key} icon={ACCOMMODATION_ICONS[key]} label={ACCOMMODATION_LABELS[key]} selected={prefs.accommodationType === key} onClick={() => selectSingle('accommodationType', key)} />
              ))}
            </div>
          </StepSection>
        )}

        {/* Step 7: Travel Style + Season */}
        {step === 7 && (
          <StepSection title="旅のスタイルと季節">
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-3">旅のスタイル</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(Object.keys(TRAVEL_STYLE_LABELS) as TravelStyle[]).map((key) => (
                <ChoiceCard key={key} icon={TRAVEL_STYLE_ICONS[key]} label={TRAVEL_STYLE_LABELS[key]} selected={prefs.travelStyle === key} onClick={() => setPrefs((p) => ({ ...p, travelStyle: key }))} />
              ))}
            </div>
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-3">旅行する季節</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {(Object.keys(SEASON_LABELS) as Season[]).map((key) => (
                <ChoiceCard key={key} icon={SEASON_ICONS[key]} label={SEASON_LABELS[key]} selected={prefs.season === key} onClick={() => setPrefs((p) => ({ ...p, season: key }))} />
              ))}
            </div>
            {apiError && <p className="text-red-500 text-sm mb-3 text-center">{apiError}</p>}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate() || creating}
              className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-lg font-semibold rounded-2xl disabled:opacity-40 hover:shadow-xl hover:scale-105 transition-all"
            >
              {creating ? '作成中...' : isGroupMode ? 'グループセッションを作成する 👥' : 'AIでプランを生成する ✨'}
            </button>
          </StepSection>
        )}

        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← 前に戻る
          </button>
        )}
      </div>
    </main>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p className="text-gray-400">読み込み中...</p></div>}>
      <PlanContent />
    </Suspense>
  );
}

function StepSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-5 text-center">{title}</h2>
      {children}
    </div>
  );
}

function ChoiceCard({ icon, label, selected, onClick, compact = false }: {
  icon: string; label: string; selected: boolean; onClick: () => void; compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-150 cursor-pointer ${compact ? 'p-2 gap-1' : 'p-5 gap-2'} ${selected ? 'border-sky-500 bg-sky-50 shadow-md scale-105' : 'border-gray-200 bg-white hover:border-sky-300 hover:bg-sky-50'}`}
    >
      <span className={compact ? 'text-xl' : 'text-3xl'}>{icon}</span>
      <span className={`font-medium text-gray-800 text-center leading-tight ${compact ? 'text-xs' : 'text-sm'}`}>{label}</span>
    </button>
  );
}
