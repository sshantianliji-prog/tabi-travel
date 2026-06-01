'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  TravelType, Duration, Budget, Region, Interest, AccommodationType, TravelStyle, Season, TransportMethod,
  TravelPreferences,
  TRAVEL_TYPE_LABELS, DURATION_LABELS, BUDGET_LABELS, REGION_LABELS, REGION_ICONS, REGION_GROUPS,
  INTEREST_LABELS, INTEREST_ICONS,
  ACCOMMODATION_LABELS, ACCOMMODATION_ICONS,
  TRAVEL_STYLE_LABELS, TRAVEL_STYLE_ICONS,
  SEASON_LABELS, SEASON_ICONS,
  TRANSPORT_METHOD_LABELS, TRANSPORT_METHOD_ICONS,
} from '@/types/travel';

const TRAVEL_TYPE_ICONS: Record<TravelType, string> = { solo: '🧳', couple: '💑', friends: '👫', family: '👨‍👩‍👧‍👦' };
const DURATION_ICONS: Record<Duration, string> = { 'day-trip': '☀️', '1night2days': '🌙', '2nights3days': '🌟', '3plus': '🗓️' };
const BUDGET_ICONS: Record<Budget, string> = {
  'under10k': '🪙', '10k-30k': '💴', '30k-50k': '💰', '50k-80k': '💳',
  '80k-120k': '✨', '120k-200k': '💎', '200k-300k': '👑', 'over300k': '🌟',
};

const STEPS = ['旅行タイプ', '人数', '期間', '予算', '出発地', '目的地', '移動手段', '旅行日程', '興味テーマ', '宿泊スタイル', 'スタイル・季節'];
// 日帰りのとき宿泊スタイル(index 9)をスキップする
const ACCOMMODATION_STEP = 9;

function PlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGroupMode = searchParams.get('mode') === 'group';

  const [step, setStep] = useState(0);
  const [stepKey, setStepKey] = useState(0); // アニメーション用キー
  const [goingBack, setGoingBack] = useState(false);
  const [myName, setMyName] = useState('');
  const [nameEntered, setNameEntered] = useState(false);
  const [prefs, setPrefs] = useState<Partial<TravelPreferences>>({ interests: [] });
  const [creating, setCreating] = useState(false);
  const [apiError, setApiError] = useState('');

  function advance(currentPrefs?: Partial<TravelPreferences>) {
    setGoingBack(false);
    setStep((s) => {
      const next = s + 1;
      // 日帰りなら宿泊スタイルステップをスキップ
      const isDayTrip = (currentPrefs ?? prefs).duration === 'day-trip';
      if (next === ACCOMMODATION_STEP && isDayTrip) return next + 1;
      return next;
    });
    setStepKey((k) => k + 1);
  }

  function goBack() {
    setGoingBack(true);
    setStep((s) => {
      const prev = s - 1;
      // 日帰りなら宿泊スタイルステップをスキップ（逆方向）
      if (prev === ACCOMMODATION_STEP && prefs.duration === 'day-trip') return prev - 1;
      return prev;
    });
    setStepKey((k) => k + 1);
  }

  function selectSingle<T extends keyof Omit<TravelPreferences, 'interests'>>(key: T, value: TravelPreferences[T]) {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    setTimeout(() => advance(newPrefs), 200);
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
              <div key={i} className={`h-2 flex-1 mx-0.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-sky-500 to-indigo-600' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            STEP {step + 1} / {STEPS.length}　<span className="font-semibold text-gray-700">{STEPS[step]}</span>
          </p>
        </div>

        {/* ステップコンテンツをアニメーションでラップ */}
        <div key={stepKey} className={goingBack ? 'step-enter-back' : 'step-enter'}>

        {/* Step 0: Travel Type */}
        {step === 0 && (
          <StepSection title="誰と旅行しますか？">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(TRAVEL_TYPE_LABELS) as TravelType[]).map((key) => (
                <ChoiceCard key={key} icon={TRAVEL_TYPE_ICONS[key]} label={TRAVEL_TYPE_LABELS[key]} selected={prefs.travelType === key}
                  onClick={() => {
                    // ソロ・カップルは人数を自動設定してSTEP2(期間)まで一気に進む
                    if (key === 'solo') {
                      const np = { ...prefs, travelType: key, groupSize: 1 };
                      setPrefs(np); setGoingBack(false); setStep(2); setStepKey(k => k + 1);
                    } else if (key === 'couple') {
                      const np = { ...prefs, travelType: key, groupSize: 2 };
                      setPrefs(np); setGoingBack(false); setStep(2); setStepKey(k => k + 1);
                    } else {
                      selectSingle('travelType', key); // friends/familyは人数STEPへ
                    }
                  }} />
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">ソロ・カップルは人数選択をスキップします</p>
          </StepSection>
        )}

        {/* Step 1: Group Size (friends/familyのみ表示) */}
        {step === 1 && (
          <StepSection title="何人で行きますか？">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { size: 3, label: '3人' }, { size: 4, label: '4人' }, { size: 5, label: '5人' },
                { size: 6, label: '6人' }, { size: 8, label: '7〜8人' }, { size: 10, label: '9〜10人' },
                { size: 15, label: '11〜15人' }, { size: 20, label: '16〜20人' }, { size: 99, label: '21人以上' },
              ].map(({ size, label }) => (
                <button key={size} onClick={() => selectSingle('groupSize', size)}
                  className={`py-4 rounded-2xl border-2 font-semibold text-sm transition-all duration-150 ${prefs.groupSize === size ? 'border-sky-500 bg-sky-50 text-sky-700 scale-105 shadow-md' : 'border-gray-200 bg-white text-gray-700 hover:border-sky-300'}`}>
                  <span className="block text-2xl mb-1">👥</span>
                  {label}
                </button>
              ))}
            </div>
          </StepSection>
        )}

        {/* Step 2: Duration */}
        {step === 2 && (
          <StepSection title="旅行の期間は？">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(DURATION_LABELS) as Duration[]).map((key) => (
                <ChoiceCard key={key} icon={DURATION_ICONS[key]} label={DURATION_LABELS[key]} selected={prefs.duration === key} onClick={() => selectSingle('duration', key)} />
              ))}
            </div>
          </StepSection>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <StepSection title="予算は？（1人あたり・交通費込み）">
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(BUDGET_LABELS) as Budget[]).map((key) => (
                <ChoiceCard key={key} icon={BUDGET_ICONS[key]} label={BUDGET_LABELS[key]} selected={prefs.budget === key} onClick={() => selectSingle('budget', key)} />
              ))}
            </div>
          </StepSection>
        )}

        {/* Step 4: Departure Region */}
        {step === 4 && (
          <StepSection title="どこから出発しますか？">
            <p className="text-center text-sm text-gray-500 mb-4">出発地を選ぶと交通費もプランに含まれます</p>
            <div className="overflow-y-auto pr-1 space-y-5 mb-4" style={{ maxHeight: 'calc(100vh - 320px)' }}>
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
            <button onClick={() => advance()} className="w-full py-3 border border-gray-300 text-gray-500 rounded-2xl text-sm hover:bg-gray-50 transition-all sticky bottom-4 bg-white">
              スキップ（出発地を指定しない）
            </button>
          </StepSection>
        )}

        {/* Step 5: Destination Region */}
        {step === 5 && (
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

        {/* Step 6: Transport Method */}
        {step === 6 && (
          <StepSection title="どうやって移動しますか？">
            <p className="text-center text-sm text-gray-500 mb-5">
              {prefs.departureRegion
                ? `${REGION_LABELS[prefs.departureRegion]} → ${prefs.region ? REGION_LABELS[prefs.region] : '目的地'} の移動手段`
                : '目的地への移動手段を選んでください'}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(Object.keys(TRANSPORT_METHOD_LABELS) as TransportMethod[]).map((key) => (
                <ChoiceCard key={key} icon={TRANSPORT_METHOD_ICONS[key]} label={TRANSPORT_METHOD_LABELS[key]}
                  selected={prefs.transportMethod === key} onClick={() => selectSingle('transportMethod', key)} />
              ))}
            </div>
          </StepSection>
        )}

        {/* Step 7: Travel Date */}
        {step === 7 && (
          <StepSection title="いつ旅行しますか？">
            <p className="text-center text-sm text-gray-500 mb-6">日付を選ぶとより具体的なプランになります</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">旅行開始日</label>
              <input
                type="date"
                value={prefs.travelDate ?? ''}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setPrefs((p) => ({ ...p, travelDate: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[7, 14, 30, 60, 90].map((days) => {
                const d = new Date(); d.setDate(d.getDate() + days);
                const str = d.toISOString().split('T')[0];
                const label = days === 7 ? '来週' : days === 14 ? '2週間後' : days === 30 ? '1ヶ月後' : days === 60 ? '2ヶ月後' : '3ヶ月後';
                return (
                  <button key={days} onClick={() => { const np = { ...prefs, travelDate: str }; setPrefs(np); setTimeout(() => advance(np), 200); }}
                    className={`py-2 px-3 rounded-xl border-2 text-xs font-medium transition-all ${prefs.travelDate === str ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600 hover:border-sky-300'}`}>
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => advance()} className="flex-1 py-3 border border-gray-300 text-gray-500 rounded-2xl text-sm hover:bg-gray-50 transition-all">
                スキップ
              </button>
              <button onClick={() => advance()} disabled={!prefs.travelDate}
                className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-2xl disabled:opacity-40 transition-all">
                次へ →
              </button>
            </div>
          </StepSection>
        )}

        {/* Step 8: Interests */}
        {step === 8 && (
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

        {/* Step 9: Accommodation (日帰りの場合スキップ) */}
        {step === ACCOMMODATION_STEP && (
          <StepSection title="どんな宿に泊まりたい？">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(ACCOMMODATION_LABELS) as AccommodationType[]).map((key) => (
                <ChoiceCard key={key} icon={ACCOMMODATION_ICONS[key]} label={ACCOMMODATION_LABELS[key]} selected={prefs.accommodationType === key} onClick={() => selectSingle('accommodationType', key)} />
              ))}
            </div>
          </StepSection>
        )}

        {/* Step 10: Travel Style + Season */}
        {step === 10 && (
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

        </div>{/* step-enter wrapper end */}

        {step > 0 && (
          <button onClick={goBack} className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors">
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
