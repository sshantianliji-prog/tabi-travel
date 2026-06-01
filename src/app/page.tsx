'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const FLOAT_ICONS = ['✈️','🗾','🏔️','🌸','🍜','⛩️','🌊','🏖️','🎋','🍣','🦌','♨️','🚅','🎌','🌅','🍱','🏯','🌺'];

function FloatingIcons() {
  const [icons, setIcons] = useState<{ id: number; icon: string; left: number; delay: number; duration: number; size: number }[]>([]);
  useEffect(() => {
    setIcons(Array.from({ length: 18 }, (_, i) => ({
      id: i, icon: FLOAT_ICONS[i % FLOAT_ICONS.length],
      left: Math.random() * 100, delay: Math.random() * 12,
      duration: 10 + Math.random() * 12, size: 1.2 + Math.random() * 1.6,
    })));
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(item => (
        <span key={item.id} className="float-icon" style={{ left: `${item.left}%`, fontSize: `${item.size}rem`, animationDelay: `${item.delay}s`, animationDuration: `${item.duration}s`, opacity: 0 }}>
          {item.icon}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-950 via-indigo-900 to-purple-900">
      <FloatingIcons />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className={`relative z-10 px-4 py-12 min-h-screen flex flex-col transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* ヒーロー */}
        <div className="flex flex-col items-center text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            完全無料 — 登録不要
          </div>
          <div className="text-7xl mb-4">✈️</div>
          <h1 className="text-4xl md:text-6xl font-black mb-3 leading-tight tracking-tight">
            <span className="text-white">旅行、もっと</span>
            <br />
            <span className="hero-gradient-text">気軽に。</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-md leading-relaxed">
            行き先が決まらなくてもOK。<br />
            AIが<span className="text-white font-semibold">あなたにぴったりの旅</span>を提案します
          </p>
        </div>

        {/* 3つの入口 — ここが核心 */}
        <div className="max-w-lg mx-auto w-full space-y-4 flex-1">

          {/* ① 行き先から探す（メイン） */}
          <Link href="/discover"
            className="block bg-gradient-to-r from-sky-400 to-indigo-500 rounded-3xl p-6 shadow-2xl hover:shadow-sky-500/30 hover:scale-[1.02] transition-all duration-200 pulse-cta">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">🗾</div>
              <div className="flex-1">
                <p className="text-white font-black text-lg leading-tight">行き先から探す</p>
                <p className="text-white/80 text-sm mt-0.5">気分・テーマを選ぶだけで<br />AIが旅先を4つ提案</p>
              </div>
              <span className="text-white/60 text-xl">→</span>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {['🏔️ 自然', '♨️ 温泉', '🍜 グルメ', '🏖️ 海', '⛩️ 文化'].map(tag => (
                <span key={tag} className="bg-white/15 text-white/90 text-xs px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </Link>

          {/* ② グループで決める */}
          <Link href="/plan?mode=group"
            className="block bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:bg-white/15 hover:scale-[1.02] transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center text-3xl shrink-0">👥</div>
              <div className="flex-1">
                <p className="text-white font-black text-lg leading-tight">グループで行き先を決める</p>
                <p className="text-white/70 text-sm mt-0.5">全員の希望を入力 → AIが<br className="hidden sm:block" />みんなが満足できるプランを作成</p>
              </div>
              <span className="text-white/40 text-xl">→</span>
            </div>
            <div className="mt-3 bg-white/5 rounded-xl px-3 py-2">
              <p className="text-white/60 text-xs">💡「どこ行く？」問題をAIが解決します</p>
            </div>
          </Link>

          {/* ③ 行き先は決まった */}
          <Link href="/plan"
            className="block bg-white/5 border border-white/15 rounded-3xl p-5 hover:bg-white/10 hover:scale-[1.01] transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl shrink-0">📋</div>
              <div className="flex-1">
                <p className="text-white font-bold text-base">行き先は決まった、プランを作る</p>
                <p className="text-white/50 text-xs mt-0.5">都道府県・予算・日程から詳細プランを生成</p>
              </div>
              <span className="text-white/30 text-lg">→</span>
            </div>
          </Link>
        </div>

        {/* ミッション */}
        <div className="max-w-lg mx-auto w-full mt-8 text-center">
          <p className="text-white/30 text-xs leading-relaxed">
            「老若男女すべての人々が、もっと気軽に旅行に行くきっかけを」
          </p>
        </div>
      </div>
    </main>
  );
}
