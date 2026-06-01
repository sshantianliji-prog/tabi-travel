'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { DiscoverInput, DestinationSuggestion } from '@/app/api/discover/route';
import { REGION_LABELS, REGION_ICONS, REGION_GROUPS } from '@/types/travel';
import type { Region } from '@/types/travel';

// ── 選択肢定義 ─────────────────────────────────────
const MOODS = [
  { id: 'relax',     icon: '😌', label: 'のんびり',  sub: '温泉・のどかな景色' },
  { id: 'active',    icon: '🏃', label: 'アクティブ', sub: 'ハイキング・マリンスポーツ' },
  { id: 'gourmet',   icon: '🍜', label: 'グルメ重視', sub: '食べ歩き・絶品グルメ' },
  { id: 'adventure', icon: '🌟', label: '冒険・非日常', sub: '初めての場所・穴場' },
];

const THEMES = [
  { id: 'nature',  icon: '🏔️', label: '自然・絶景' },
  { id: 'onsen',   icon: '♨️', label: '温泉・癒し' },
  { id: 'culture', icon: '⛩️', label: '歴史・文化' },
  { id: 'sea',     icon: '🏖️', label: '海・ビーチ' },
  { id: 'city',    icon: '🏙️', label: '都市観光' },
  { id: 'food',    icon: '🍱', label: '食べ歩き' },
  { id: 'snow',    icon: '⛷️', label: 'スキー・雪' },
  { id: 'art',     icon: '🎨', label: 'アート・カフェ' },
];

const DURATIONS = [
  { id: 'day-trip',  icon: '☀️', label: '日帰り' },
  { id: '1-2nights', icon: '🌙', label: '1〜2泊' },
  { id: '3plus',     icon: '🗓️', label: '3泊以上' },
];

const BUDGETS = [
  { id: 'low',  icon: '💴', label: '節約',    sub: '〜3万円' },
  { id: 'mid',  icon: '💰', label: '普通',    sub: '3〜10万円' },
  { id: 'high', icon: '💎', label: 'ちょっと贅沢', sub: '10万円〜' },
];

const TRAVEL_TYPES = [
  { id: 'solo',    icon: '🧳', label: 'ひとり' },
  { id: 'couple',  icon: '💑', label: 'カップル' },
  { id: 'friends', icon: '👫', label: '友達' },
  { id: 'family',  icon: '👨‍👩‍👧‍👦', label: '家族' },
];

// ── 行き先カード ────────────────────────────────────
function DestinationCard({
  suggestion, onSelect, index,
}: { suggestion: DestinationSuggestion; onSelect: () => void; index: number }) {
  const photoQuery = `${suggestion.regionLabel} ${suggestion.title} japan travel`;

  return (
    <div className="card-animate bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={onSelect}>

      {/* 写真エリア */}
      <div className="relative h-44 bg-gradient-to-br from-sky-400 to-indigo-500 overflow-hidden">
        <img
          src={`/api/place-photo?q=${encodeURIComponent(photoQuery)}&w=600&h=350`}
          alt={suggestion.regionLabel}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium border border-white/30">
          {suggestion.emoji} {suggestion.regionLabel}
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-white font-bold text-lg leading-tight">{suggestion.title}</p>
          <p className="text-white/80 text-xs mt-0.5">{suggestion.tagline}</p>
        </div>
      </div>

      {/* 内容エリア */}
      <div className="p-5">
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{suggestion.reason}</p>

        <div className="space-y-1.5 mb-4">
          {suggestion.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full shrink-0" />
              {h}
            </div>
          ))}
        </div>

        <div className="bg-sky-50 rounded-xl px-3 py-2 mb-4">
          <p className="text-xs text-sky-700">✨ {suggestion.bestFor}</p>
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all text-sm">
          このプランを作る →
        </button>
      </div>
    </div>
  );
}

// ── メインページ ────────────────────────────────────
export default function DiscoverPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0〜3: 質問, 4: ローディング, 5: 結果
  const [travelType, setTravelType] = useState('');
  const [mood, setMood] = useState('');
  const [themes, setThemes] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [departureRegion, setDepartureRegion] = useState<Region | ''>('');
  const [suggestions, setSuggestions] = useState<DestinationSuggestion[]>([]);
  const [error, setError] = useState('');

  function toggleTheme(id: string) {
    setThemes(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id]);
  }

  async function discover() {
    setStep(5); // ローディングステップ番号を+1
    setError('');
    const departureLabel = departureRegion ? REGION_LABELS[departureRegion] : undefined;
    const input: DiscoverInput = { travelType, mood, themes, duration, budget, departureLabel };
    try {
      const res = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (data.__error) throw new Error(data.__error);
      setSuggestions(data.suggestions ?? []);
      setStep(6); // 結果ステップ
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
      setStep(4); // 予算ステップに戻る
    }
  }

  function selectDestination(s: DestinationSuggestion) {
    // 選んだ行き先でプランページへ
    const region = s.region as Region;
    const prefs = {
      travelType,
      region: REGION_LABELS[region] ? region : 'ai-suggest',
      interests: themes.slice(0, 3),
      budget: budget === 'low' ? 'under30k' : budget === 'mid' ? '30k-100k' : '100k-200k',
      duration: duration === 'day-trip' ? 'day-trip' : duration === '3plus' ? '3plus' : '1night2days',
      travelStyle: mood === 'relax' ? 'relaxed' : mood === 'active' ? 'active' : mood === 'gourmet' ? 'gourmet-focus' : 'sightseeing',
      season: new Date().getMonth() < 3 || new Date().getMonth() > 10 ? 'winter' : new Date().getMonth() < 6 ? 'spring' : new Date().getMonth() < 9 ? 'summer' : 'autumn',
    };
    router.push(`/result?prefs=${encodeURIComponent(JSON.stringify(prefs))}`);
  }

  // ── ローディング ──
  if (step === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-950 via-indigo-900 to-purple-900 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">🗾</div>
          <h2 className="text-2xl font-bold text-white mb-2">タビが行き先を探しています</h2>
          <p className="text-white/60 text-sm">あなたにぴったりの場所を4つ選んでいます...</p>
          <div className="mt-8 flex gap-2 justify-center">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── 結果 ──
  if (step === 6) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sky-600 text-sm font-medium mb-2">🎯 あなたへのおすすめ</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">行き先候補が見つかりました</h1>
            <p className="text-gray-500 text-sm">気になる場所をタップしてプランを作りましょう</p>
          </div>

          <div className="space-y-6">
            {suggestions.map((s, i) => (
              <DestinationCard key={i} suggestion={s} index={i} onSelect={() => selectDestination(s)} />
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button onClick={() => { setStep(4); setSuggestions([]); }}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-500 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-all">
              🔄 もう一度探す
            </button>
            <Link href="/plan" className="flex-1 py-3 bg-white border-2 border-sky-400 text-sky-600 rounded-2xl text-sm font-medium text-center hover:bg-sky-50 transition-all">
              行き先を自分で選ぶ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── 質問フロー ──
  const questions = [
    {
      title: '誰と旅行しますか？',
      sub: 'まず旅のメンバーを教えてください',
      content: (
        <div className="grid grid-cols-2 gap-3">
          {TRAVEL_TYPES.map(t => (
            <button key={t.id} onClick={() => { setTravelType(t.id); setTimeout(() => setStep(1), 200); }}
              className={`flex flex-col items-center py-5 rounded-2xl border-2 transition-all ${travelType === t.id ? 'border-sky-500 bg-sky-50 scale-105 shadow-md' : 'border-gray-200 bg-white hover:border-sky-300'}`}>
              <span className="text-4xl mb-2">{t.icon}</span>
              <span className="font-semibold text-gray-800 text-sm">{t.label}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'どんな旅がしたいですか？',
      sub: '気分とテーマを選んでください（テーマは複数OK）',
      content: (
        <div>
          <p className="text-xs font-bold text-gray-400 tracking-wider mb-3">旅の気分</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {MOODS.map(m => (
              <button key={m.id} onClick={() => setMood(m.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${mood === m.id ? 'border-sky-500 bg-sky-50 scale-105 shadow-md' : 'border-gray-200 bg-white hover:border-sky-300'}`}>
                <span className="text-3xl shrink-0">{m.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{m.label}</p>
                  <p className="text-xs text-gray-400">{m.sub}</p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-gray-400 tracking-wider mb-3">興味テーマ（複数OK）</p>
          <div className="grid grid-cols-4 gap-2 mb-5">
            {THEMES.map(t => (
              <button key={t.id} onClick={() => toggleTheme(t.id)}
                className={`flex flex-col items-center py-3 rounded-xl border-2 transition-all text-xs font-medium gap-1 ${themes.includes(t.id) ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 bg-white text-gray-600 hover:border-sky-300'}`}>
                <span className="text-xl">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={!mood || themes.length === 0}
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-2xl disabled:opacity-40 hover:shadow-lg transition-all">
            次へ → ({themes.length}つ選択中)
          </button>
        </div>
      ),
    },
    {
      title: 'どこから出発しますか？',
      sub: '出発地を選ぶとアクセスしやすい旅先を提案します',
      content: (
        <div>
          <div className="overflow-y-auto pr-1 space-y-4 mb-4" style={{ maxHeight: 'calc(100vh - 320px)' }}>
            {REGION_GROUPS.filter(g => g.label !== 'おまかせ').map(group => (
              <div key={group.label}>
                <p className="text-xs font-bold text-gray-400 tracking-wider mb-2">{group.label}</p>
                <div className="grid grid-cols-3 gap-2">
                  {group.regions.filter(k => k !== 'ai-suggest').map(key => (
                    <button key={key} onClick={() => { setDepartureRegion(key as Region); setTimeout(() => setStep(3), 200); }}
                      className={`flex flex-col items-center py-2 px-1 rounded-xl border-2 transition-all text-xs font-medium gap-0.5 ${departureRegion === key ? 'border-sky-500 bg-sky-50 text-sky-700 scale-105' : 'border-gray-200 bg-white text-gray-600 hover:border-sky-300'}`}>
                      <span className="text-lg">{REGION_ICONS[key as Region]}</span>
                      <span className="leading-tight text-center">{REGION_LABELS[key as Region]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(3)} className="w-full py-3 border border-gray-300 text-gray-500 rounded-2xl text-sm hover:bg-gray-50 transition-all sticky bottom-4 bg-white">
            スキップ（どこでも行ける）
          </button>
        </div>
      ),
    },
    {
      title: '旅行の期間は？',
      sub: '大まかな日数を選んでください',
      content: (
        <div className="grid grid-cols-3 gap-4">
          {DURATIONS.map(d => (
            <button key={d.id} onClick={() => { setDuration(d.id); setTimeout(() => setStep(4), 200); }}
              className={`flex flex-col items-center py-6 rounded-2xl border-2 transition-all ${duration === d.id ? 'border-sky-500 bg-sky-50 scale-105 shadow-md' : 'border-gray-200 bg-white hover:border-sky-300'}`}>
              <span className="text-4xl mb-2">{d.icon}</span>
              <span className="font-semibold text-gray-800 text-sm">{d.label}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: '予算感は？',
      sub: '1人あたりの目安金額です',
      content: (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {BUDGETS.map(b => (
              <button key={b.id} onClick={() => setBudget(b.id)}
                className={`flex flex-col items-center py-5 rounded-2xl border-2 transition-all ${budget === b.id ? 'border-sky-500 bg-sky-50 scale-105 shadow-md' : 'border-gray-200 bg-white hover:border-sky-300'}`}>
                <span className="text-4xl mb-2">{b.icon}</span>
                <span className="font-semibold text-gray-800 text-sm">{b.label}</span>
                <span className="text-xs text-gray-400 mt-0.5">{b.sub}</span>
              </button>
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          <button onClick={discover} disabled={!budget}
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-lg font-bold rounded-2xl disabled:opacity-40 hover:shadow-xl hover:scale-105 transition-all">
            🗾 行き先を探す ✨
          </button>
        </div>
      ),
    },
  ];

  const q = questions[step];

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-10">
      <div className="max-w-lg mx-auto">

        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← ホーム</Link>
          <div className="flex gap-1 flex-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-gradient-to-r from-sky-500 to-indigo-600' : 'bg-gray-200'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-400">{step + 1}/{questions.length}</span>
        </div>

        {/* 質問 */}
        <div className="step-enter" key={step}>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{q.title}</h1>
            <p className="text-sm text-gray-500">{q.sub}</p>
          </div>
          {q.content}
        </div>

        {/* 戻るボタン */}
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← 前に戻る
          </button>
        )}
      </div>
    </main>
  );
}
