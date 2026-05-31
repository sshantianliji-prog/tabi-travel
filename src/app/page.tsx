import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">

      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center pb-16">
        <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
          ✨ 完全無料 — 旅行プランを今すぐ作成
        </div>

        <div className="text-7xl mb-4">✈️</div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          旅行、もっと
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">気軽に。</span>
        </h1>

        <p className="text-lg text-gray-500 mb-3 max-w-lg">
          AI旅行コンシェルジュ「タビ」が、実在するホテル・レストラン・観光スポットを組み合わせた<strong className="text-gray-700">本物の旅行プランを無料で作成</strong>します。
        </p>
        <p className="text-sm text-gray-400 mb-10">
          選ぶだけ・3分で完成 — 子どもからお年寄りまで、どなたでも
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/plan"
            className="px-10 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            ひとりで計画する →
          </Link>
          <Link href="/plan?mode=group"
            className="px-10 py-4 bg-white border-2 border-sky-400 text-sky-600 text-lg font-semibold rounded-full shadow hover:shadow-lg hover:scale-105 transition-all duration-200">
            👥 グループで計画する
          </Link>
        </div>

        <p className="text-xs text-gray-400">登録不要・クレジットカード不要・完全無料</p>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <p className="text-center text-sm font-bold text-gray-400 tracking-widest mb-10">タビが選ばれる理由</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: '🎯', title: '選ぶだけ・3分完成', desc: '旅行タイプ・予算・エリアなど7つの項目を選ぶだけ。難しい入力や調査は一切不要' },
            { icon: '🏨', title: '実在するスポットを提案', desc: 'AIが実在するホテル・レストラン・観光スポットを選んでプランに組み込みます' },
            { icon: '👥', title: 'グループ旅行も解決', desc: 'みんなの希望を入力してAIが全員が満足できるプランを自動で作成。「どこ行く？」問題を解決' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-8 text-white text-center mb-16">
          <p className="text-sm font-medium opacity-80 mb-2">タビのミッション</p>
          <h2 className="text-2xl font-bold mb-3">「老若男女すべての人々が、<br className="hidden sm:block" />もっと気軽に旅行に行くきっかけを」</h2>
          <p className="text-sm opacity-80">旅行の計画が面倒で諦めていた方、どこに行けばいいかわからない方、<br className="hidden sm:block" />グループでまとまらない方——タビが全部解決します。</p>
        </div>

        {/* How it works */}
        <p className="text-center text-sm font-bold text-gray-400 tracking-widest mb-8">使い方は3ステップ</p>
        <div className="flex flex-col md:flex-row gap-4 mb-16">
          {[
            { step: '1', title: '条件を選ぶ', desc: '旅行タイプ・期間・予算・地域などを選択' },
            { step: '2', title: 'タビがプランを作成', desc: 'AIが実在するスポットを組み合わせて数秒で完成' },
            { step: '3', title: '旅に出かける', desc: 'プランをシェアして、そのまま予約サイトへ' },
          ].map((s) => (
            <div key={s.step} className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">{s.step}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Bottom */}
        <div className="text-center">
          <Link href="/plan"
            className="inline-block px-12 py-5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
            無料でプランを作る →
          </Link>
          <p className="text-xs text-gray-400 mt-3">47都道府県対応 · グループ旅行対応 · 完全無料</p>
        </div>
      </div>

    </main>
  );
}
