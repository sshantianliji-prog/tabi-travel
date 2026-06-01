'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const FLOAT_ICONS = ['✈️','🗾','🏔️','🌸','🍜','⛩️','🌊','🏖️','🎋','🍣','🦌','♨️','🚅','🎌','🌅','🍱','🏯','🌺'];

function FloatingIcons() {
  const [icons, setIcons] = useState<{ id: number; icon: string; left: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    const items = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      icon: FLOAT_ICONS[i % FLOAT_ICONS.length],
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 10 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.6,
    }));
    setIcons(items);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item) => (
        <span
          key={item.id}
          className="float-icon"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}rem`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            opacity: 0,
          }}
        >
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

      {/* 浮遊アイコン背景 */}
      <FloatingIcons />

      {/* 星みたいなドット背景 */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* コンテンツ */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* バッジ */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          完全無料 — 今すぐ旅行プランを作成
        </div>

        {/* メインタイトル */}
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight tracking-tight">
          <span className="text-white">旅行、もっと</span>
          <br />
          <span className="hero-gradient-text">気軽に。</span>
        </h1>

        <p className="text-white/70 text-lg md:text-xl mb-3 max-w-lg leading-relaxed">
          AI旅行コンシェルジュ「タビ」が<br className="hidden sm:block" />
          <span className="text-white font-semibold">実在するホテル・グルメ・観光スポット</span>を組み合わせた<br className="hidden sm:block" />
          あなただけのプランを<span className="text-emerald-400 font-bold">無料</span>で作成
        </p>
        <p className="text-white/40 text-sm mb-10">選ぶだけ・3分で完成 · 登録不要</p>

        {/* CTAボタン */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link href="/plan"
            className="pulse-cta px-10 py-5 bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-sky-500/40 hover:scale-105 transition-all duration-200">
            ✈️ ひとりで計画する
          </Link>
          <Link href="/plan?mode=group"
            className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-lg font-semibold rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-200">
            👥 グループで計画する
          </Link>
        </div>

        {/* 特徴3点 */}
        <div className="grid grid-cols-3 gap-4 max-w-lg w-full mb-16">
          {[
            { icon: '⚡', label: '3分で完成' },
            { icon: '🏨', label: '実在施設を提案' },
            { icon: '👥', label: 'グループ対応' },
          ].map((f) => (
            <div key={f.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-3 px-2 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-white/80 text-xs font-medium">{f.label}</p>
            </div>
          ))}
        </div>

        {/* ミッション */}
        <div className="max-w-lg bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5">
          <p className="text-white/50 text-xs mb-1">タビのミッション</p>
          <p className="text-white/90 text-sm font-medium leading-relaxed">
            「老若男女すべての人々が、もっと気軽に<br className="hidden sm:block" />旅行に行くきっかけを創出したい」
          </p>
        </div>
      </div>

      {/* 下スクロールのヒント */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <div className="w-px h-8 bg-white/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
      </div>

    </main>
  );
}
