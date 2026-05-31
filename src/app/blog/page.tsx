import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '旅行プランガイド | タビ — AI旅行コンシェルジュ',
  description: 'AIが作るリアルな旅行プランのガイド集。京都・沖縄・北海道など人気エリアの具体的な旅行プランをご紹介。',
};

const ARTICLES = [
  {
    slug: 'kyoto-2nights3days',
    title: '【2025年最新】京都2泊3日モデルプラン — 金閣寺・嵐山・祇園を効率よく巡る',
    description: '京都を2泊3日で楽しむための完全ガイド。実在するホテル・レストランの名前入りで、そのまま使えるスケジュールをAIが作成。',
    tag: '京都 · 2泊3日',
    icon: '🎋',
  },
  {
    slug: 'okinawa-couple',
    title: '【カップル向け】沖縄2泊3日ロマンティックプラン — 美ら海水族館・古宇利島・ビーチリゾート',
    description: 'カップルで行く沖縄旅行の完全プラン。フォトジェニックなスポットと絶品グルメを詰め込んだ2泊3日の旅程。',
    tag: '沖縄 · カップル',
    icon: '🏖️',
  },
  {
    slug: 'hokkaido-family',
    title: '【家族旅行】北海道2泊3日プラン — 札幌・小樽・富良野を子連れで楽しむ',
    description: '子連れで行く北海道旅行の完全ガイド。小さなお子様がいるご家族でも安心のスケジュールと宿泊先をご紹介。',
    tag: '北海道 · 家族',
    icon: '🐻',
  },
];

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-sky-500 hover:text-sky-600 mb-6 inline-block">← トップに戻る</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">旅行プランガイド</h1>
        <p className="text-gray-500 mb-10">AIが作るリアルな旅行プランのお手本集。参考にして、あなただけのプランを作ってみてください。</p>

        <div className="space-y-4">
          {ARTICLES.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`}
              className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-sky-200 transition-all">
              <div className="flex items-start gap-4">
                <span className="text-3xl mt-1">{a.icon}</span>
                <div>
                  <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">{a.tag}</span>
                  <h2 className="font-bold text-gray-900 mt-2 mb-1 leading-snug">{a.title}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{a.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl p-6 text-white text-center">
          <p className="font-bold text-lg mb-2">あなただけのプランを無料で作成</p>
          <p className="text-sm opacity-80 mb-4">選ぶだけで3分、AIがリアルな旅行プランを生成します</p>
          <Link href="/plan"
            className="inline-block bg-white text-sky-600 font-bold px-8 py-3 rounded-full hover:shadow-lg transition-all">
            今すぐ作る →
          </Link>
        </div>
      </div>
    </main>
  );
}
