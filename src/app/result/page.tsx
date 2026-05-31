'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TravelPreferences, REGION_LABELS } from '@/types/travel';
import { getTransportFare, TransportFare as TransportFareType } from '@/lib/transport-fares';

interface ScheduleItem {
  time: string;
  place: string;
  address?: string;
  description: string;
  price?: string;
  type: 'spot' | 'meal' | 'stay' | 'transport';
}
interface DayPlan { day: number; theme: string; schedule: ScheduleItem[]; }
interface TravelPlan {
  title: string;
  destination: string;
  summary: string;
  days: DayPlan[];
  tips: string[];
  estimatedCost: string;
  bookingAdvice?: string;
}

const TYPE_ICONS: Record<string, string> = { spot: '📍', meal: '🍽️', stay: '🏨', transport: '🚃' };

function tryParseJson(text: string): TravelPlan | null {
  // Markdownコードブロックを除去してからJSONを探す
  const cleaned = text
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim();
  const matches = cleaned.match(/\{[\s\S]*\}/g);
  if (!matches) return null;
  for (const m of matches.reverse()) {
    try {
      const parsed = JSON.parse(m);
      // エラーオブジェクトは除外
      if (parsed && typeof parsed === 'object' && '__error' in parsed) return null;
      return parsed as TravelPlan;
    } catch { /* continue */ }
  }
  return null;
}

function TransportFareCard({ fare, from, to }: { fare: TransportFareType; from: string; to: string }) {
  return (
    <div className="bg-white rounded-2xl mb-6 shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-sky-500 px-6 py-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-bold text-base">{fare.icon} 往復交通費の目安</span>
        </div>
        <p className="text-sky-100 text-xs">{from} → {to}</p>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">おすすめ交通手段</p>
            <p className="font-semibold text-gray-900">{fare.method}</p>
            <p className="text-xs text-gray-500 mt-0.5">所要時間: {fare.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">往復料金（目安）</p>
            <p className="text-2xl font-bold text-sky-600">{fare.roundTrip.toLocaleString()}円〜</p>
            <p className="text-xs text-gray-400">片道 {fare.oneWay.toLocaleString()}円〜</p>
          </div>
        </div>

        <div className="bg-sky-50 rounded-xl px-4 py-3 mb-3">
          <p className="text-xs text-sky-700">💡 {fare.tip}</p>
        </div>

        {fare.budgetOption && (
          <div className="bg-green-50 rounded-xl px-4 py-3 mb-3">
            <p className="text-xs text-green-700 font-medium mb-0.5">💰 格安オプション: {fare.budgetOption.method}（片道{fare.budgetOption.oneWay.toLocaleString()}円〜）</p>
            <p className="text-xs text-green-600">{fare.budgetOption.tip}</p>
          </div>
        )}

        <a href={fare.bookingUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors">
          🎫 {fare.bookingName}でチケットを探す
        </a>
      </div>
    </div>
  );
}

function CostBreakdown({ text }: { text: string }) {
  const lines = text.split(/\n|\\n/).map(l => l.trim()).filter(Boolean);

  const isTotal = (l: string) => /合計|総額|トータル/.test(l);
  const extractCost = (l: string) => {
    const m = l.match(/([\d,]+)円/);
    return m ? `${m[1]}円` : null;
  };
  const extractLabel = (l: string) => l.replace(/^[-・•]\s*/, '').replace(/([\d,]+円.*)$/, '').replace(/[:：]$/, '').trim();

  const items = lines.filter(l => !isTotal(l) && (l.includes('円') || l.match(/^[-・•【]/)));
  const totalLine = lines.find(isTotal);
  const totalCost = totalLine ? (totalLine.match(/([\d,]+)円/) ?? [])[1] : null;

  return (
    <div className="bg-white rounded-2xl mb-6 shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-green-500 px-6 py-4">
        <h3 className="font-bold text-white text-base">💴 費用の目安</h3>
        {totalCost && (
          <p className="text-green-100 text-xs mt-0.5">1人あたり合計 <span className="text-white font-bold text-lg ml-1">{totalCost}円</span> 程度</p>
        )}
      </div>
      <div className="p-5">
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((line, i) => {
              const cost = extractCost(line);
              const label = cost ? extractLabel(line) : line.replace(/^[-・•]\s*/, '');
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700 flex-1 pr-3">{label}</span>
                  {cost && <span className="text-sm font-semibold text-green-600 whitespace-nowrap">{cost}</span>}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{text}</p>
        )}
        {totalLine && (
          <div className="mt-3 pt-3 border-t-2 border-green-100 flex justify-between items-center">
            <span className="font-bold text-gray-800 text-sm">合計（目安）</span>
            <span className="font-bold text-green-600 text-base">{totalCost}円〜</span>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingAdviceSection({ text }: { text: string }) {
  const lines = text.split(/\n|\\n/).map(l => l.trim()).filter(Boolean);
  const items = lines.map(l => l.replace(/^[-・•\d+\.]\s*/, '').trim()).filter(Boolean);

  return (
    <div className="bg-white rounded-2xl mb-6 shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-indigo-500 px-6 py-4">
        <h3 className="font-bold text-white text-base">📅 予約のコツ</h3>
        <p className="text-indigo-100 text-xs mt-0.5">失敗しないための本音アドバイス</p>
      </div>
      <div className="p-5 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingLinks({ destination }: { destination: string }) {
  const enc = encodeURIComponent(destination);
  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4">🏨 このプランで予約する</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'じゃらん', icon: '🏨', color: 'bg-orange-500 hover:bg-orange-600', url: `https://www.jalan.net/yadosearch/?freeWord=${enc}` },
          { name: '楽天トラベル', icon: '⛩️', color: 'bg-red-500 hover:bg-red-600', url: `https://travel.rakuten.co.jp/search/keyword/?f_free_word=${enc}` },
          { name: 'Booking.com', icon: '🌐', color: 'bg-blue-600 hover:bg-blue-700', url: `https://www.booking.com/searchresults.ja.html?ss=${enc}` },
          { name: 'Viator（体験）', icon: '🎟️', color: 'bg-green-600 hover:bg-green-700', url: `https://www.viator.com/ja-JP/search?q=${enc}` },
        ].map((l) => (
          <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
            className={`${l.color} text-white rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors`}>
            <span>{l.icon}</span><span>{l.name}</span>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">※ 上記リンクから予約すると運営の収益になります</p>
    </div>
  );
}

function ShareButtons({ title, destination }: { title: string; destination: string }) {
  const [copied, setCopied] = useState(false);
  const shareText = `✈️ ${title}\n📍 ${destination}\n\nAI旅行コンシェルジュ「タビ」が作ったプランが最高すぎた🔥\n老若男女みんなの旅行をもっと気軽に👇`;
  const tagLine = `\n#タビ #AI旅行プラン #旅行`;
  const url = typeof window !== 'undefined' ? window.location.href : '';

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div className="mb-6">
      {/* タビブランドバナー */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl p-5 mb-3 text-white text-center">
        <p className="text-xs font-medium opacity-80 mb-1">このプランは</p>
        <p className="text-xl font-bold tracking-wide">✈️ タビ で作りました</p>
        <p className="text-xs opacity-75 mt-1">AI旅行コンシェルジュ — 無料で使えます</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">📤 このプランをシェア</h3>
        <div className="flex gap-3 flex-wrap">
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + tagLine)}&url=${encodeURIComponent(url)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
            𝕏 でシェア
          </a>
          <a href={`https://line.me/R/msg/text/?${encodeURIComponent(shareText + '\n' + url)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
            💬 LINEで送る
          </a>
          <button onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
            {copied ? '✅ コピーしました' : '🔗 URLをコピー'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">シェアするとお友達も無料で使えます</p>
      </div>
    </div>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const [transportFare, setTransportFare] = useState<TransportFareType | null>(null);
  const [transportFrom, setTransportFrom] = useState('');
  const [transportTo, setTransportTo] = useState('');
  const fetchStarted = useRef(false); // StrictModeの二重実行防止

  useEffect(() => {
    // グループモード：planが直接URLパラメータに入ってくる
    const planParam = searchParams.get('plan');
    if (planParam) {
      try { setPlan(JSON.parse(decodeURIComponent(planParam))); }
      catch { setError('プランの読み込みに失敗しました。もう一度お試しください。'); }
      return;
    }

    // StrictMode二重実行防止
    if (fetchStarted.current) return;
    fetchStarted.current = true;

    const raw = searchParams.get('prefs');
    if (!raw) { router.replace('/plan'); return; }

    let prefs: TravelPreferences;
    try { prefs = JSON.parse(decodeURIComponent(raw)); }
    catch { setError('パラメータが不正です。最初からやり直してください。'); return; }

    // 出発地が設定されている場合は交通費を取得
    if (prefs.departureRegion && prefs.region) {
      const fare = getTransportFare(prefs.departureRegion, prefs.region);
      if (fare) {
        setTransportFare(fare);
        setTransportFrom(REGION_LABELS[prefs.departureRegion] ?? '');
        setTransportTo(REGION_LABELS[prefs.region] ?? '');
      }
    }

    setStreaming(true);
    setError('');

    (async () => {
      try {
        const res = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prefs),
        });

        const data = await res.json();

        if (!res.ok || data.__error) {
          throw new Error(data.__error ?? `APIエラー (${res.status})`);
        }

        setPlan(data as TravelPlan);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'エラーが発生しました');
      } finally {
        setStreaming(false);
      }
    })();

    return () => {};
  }, [searchParams, router]);

  if (streaming || (!plan && !error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
        <div className="text-6xl animate-bounce">✈️</div>
        <p className="text-xl font-semibold text-gray-700">タビがプランを作成中...</p>
        <p className="text-sm text-gray-400">実在するホテル・レストランを本気で選んでいます</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
        <div className="text-5xl">😢</div>
        <p className="text-lg text-red-500 max-w-sm">{error}</p>
        <Link href="/plan" className="px-6 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
          最初からやり直す
        </Link>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <p className="text-sm font-medium opacity-80 mb-1">📍 {plan.destination}</p>
          <h1 className="text-2xl font-bold mb-3">{plan.title}</h1>
          <p className="text-sm opacity-90 leading-relaxed">{plan.summary}</p>
        </div>

        {(plan.days ?? []).map((day) => (
          <div key={day.day} className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{day.day}</div>
              <div>
                <p className="text-xs text-gray-400">Day {day.day}</p>
                <p className="font-semibold text-gray-900">{day.theme}</p>
              </div>
            </div>
            <div className="space-y-5">
              {(day.schedule ?? []).map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs text-gray-400 whitespace-nowrap w-12 text-right mt-1 shrink-0">{item.time}</span>
                  <div className="flex gap-3 flex-1">
                    <span className="text-xl mt-0.5 shrink-0">{TYPE_ICONS[item.type] ?? '📌'}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm">{item.place}</p>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.place + ' ' + (item.address ?? ''))}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-sky-500 hover:text-sky-600 border border-sky-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                          🗺️ 地図
                        </a>
                      </div>
                      {item.address && <p className="text-xs text-sky-500 mt-0.5">📍 {item.address}</p>}
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                      {item.price && <p className="text-xs text-green-600 mt-1 font-medium">💴 {item.price}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-amber-50 rounded-2xl p-6 mb-6 border border-amber-100">
          <h3 className="font-bold text-amber-800 mb-4">💡 旅のコツ</h3>
          <ul className="space-y-2">
            {(plan.tips ?? []).map((tip, i) => (
              <li key={i} className="text-sm text-amber-700 flex gap-2"><span>•</span><span>{tip}</span></li>
            ))}
          </ul>
        </div>

        {transportFare && (
          <TransportFareCard fare={transportFare} from={transportFrom} to={transportTo} />
        )}

        <CostBreakdown text={plan.estimatedCost} />

        {plan.bookingAdvice && (
          <BookingAdviceSection text={plan.bookingAdvice} />
        )}

        <BookingLinks destination={plan.destination} />
        <ShareButtons title={plan.title} destination={plan.destination} />

        <Link href="/plan"
          className="block w-full py-4 border-2 border-sky-500 text-sky-600 font-semibold rounded-2xl text-center hover:bg-sky-50 transition-colors">
          もう一度作る
        </Link>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="text-6xl animate-bounce">✈️</div>
        <p className="text-xl font-semibold text-gray-700">読み込み中...</p>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
