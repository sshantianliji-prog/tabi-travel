import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '【カップル向け】沖縄2泊3日ロマンティックプラン — 美ら海・古宇利島・ビーチリゾート | タビ',
  description: 'カップルで行く沖縄旅行の完全プラン。美ら海水族館・古宇利島・ビーチリゾートを巡る2泊3日のモデルコース。実在するホテル・レストラン名入りでそのまま使えます。',
  keywords: ['沖縄 カップル 旅行', '沖縄 2泊3日', '沖縄 観光 モデルコース', '沖縄 ホテル カップル', '古宇利島'],
  openGraph: {
    title: '【カップル向け】沖縄2泊3日ロマンティックプラン | タビ',
    description: '美ら海水族館・古宇利島・ビーチリゾートを巡るカップル向け沖縄2泊3日の完全ガイド。',
  },
};

export default function OkinawaCouplePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="text-sm text-sky-500 hover:text-sky-600 mb-6 inline-block">← ガイド一覧に戻る</Link>

        <div className="bg-gradient-to-r from-cyan-400 to-sky-600 rounded-3xl p-8 text-white mb-8">
          <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">沖縄 · カップル · 2泊3日</span>
          <h1 className="text-2xl font-bold mt-3 mb-2 leading-snug">沖縄カップル2泊3日<br />ロマンティックプラン</h1>
          <p className="text-sm opacity-80">美ら海水族館・古宇利島・サンセットビーチを巡る特別な旅</p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-5 mb-8 border border-amber-100">
          <p className="text-sm text-amber-800 font-medium">📌 このプランのポイント</p>
          <ul className="mt-2 space-y-1 text-sm text-amber-700">
            <li>・カップルに人気のフォトジェニックスポット厳選</li>
            <li>・予算5〜10万円（1人あたり）に対応</li>
            <li>・レンタカー利用で自由度の高いルート</li>
            <li>・サンセットが最高に美しいスポット案内</li>
          </ul>
        </div>

        {[
          {
            day: 1, theme: '那覇・首里城エリアでスタート',
            schedule: [
              { time: '10:00', place: '首里城公園', desc: '琉球王国の象徴。再建中の正殿も含めた見学が可能。朝イチで訪問すると比較的空いています。', price: '入場料400円〜' },
              { time: '12:30', place: '首里そば', desc: '首里城近くの老舗沖縄そば専門店。行列必至の人気店ですが、回転が速いので安心を。', price: '沖縄そば900円〜' },
              { time: '14:00', place: '国際通り', desc: '沖縄最大の観光エリア。お土産探しと街歩きに。紅型・シーサーなどの工芸品が揃う。', price: '' },
              { time: '19:00', place: 'ステーキハウス88 国際通り店', desc: '沖縄ステーキの老舗。アメリカンサイズのステーキとオリオンビールでカップルディナー。', price: '夕食3,000円〜' },
              { time: '21:00', place: 'ホテルロイヤルオリオン', desc: '国際通りに隣接する利便性抜群のホテル。リニューアルされた客室が快適。', price: '1泊12,000円〜' },
            ],
          },
          {
            day: 2, theme: '美ら海水族館・古宇利島ドライブ',
            schedule: [
              { time: '9:00', place: '古宇利島', desc: '沖縄北部の離島。古宇利大橋からの景色は息を飲む美しさ。ハートロックはカップル必訪スポット。', price: '無料（橋通行無料）' },
              { time: '12:00', place: 'ヴィラブリゾート内レストラン', desc: '古宇利島のリゾートレストランでランチ。エメラルドグリーンの海を眺めながら食事を。', price: '昼食2,000円〜' },
              { time: '14:00', place: '沖縄美ら海水族館', desc: '世界最大級の水槽「黒潮の海」は圧巻。カップルで入場すると特別な雰囲気に。夕方は比較的空いています。', price: '入場料2,180円' },
              { time: '18:00', place: 'ANAインターコンチネンタル万座ビーチリゾート', desc: '恩納村の最高級リゾートホテル。オーシャンビューの客室からのサンセットが最高。', price: '1泊30,000円〜' },
              { time: '19:00', place: 'ホテル内レストラン「スカイ」', desc: 'ホテル最上階のレストランで夕食。沖縄の食材を使ったコース料理とサンセットビューが最高の演出に。', price: '夕食5,000円〜' },
            ],
          },
          {
            day: 3, theme: '恩納村ビーチ・帰路',
            schedule: [
              { time: '8:00', place: 'ムーンビーチ（恩納村）', desc: '日本有数の美しいビーチ。早朝は地元の人しかいない穴場時間帯。写真撮影に最適。', price: 'ビーチ入場無料' },
              { time: '10:00', place: '万座毛', desc: '象の鼻に見える岩と断崖絶壁が有名なビュースポット。眼下に広がる青い海が絶景。', price: '100円（整備協力金）' },
              { time: '12:00', place: 'マグロ問屋 那覇港', desc: '那覇に戻りマグロ丼でランチ。新鮮な海鮮を那覇港で食べる贅沢な締めくくり。', price: '昼食1,500円〜' },
              { time: '14:00', place: '那覇空港', desc: '出発前に免税店でお土産の最終チェックを。泡盛・紅型雑貨・沖縄塩クッキーが人気。', price: '' },
            ],
          },
        ].map((day) => (
          <div key={day.day} className="bg-white rounded-2xl p-6 mb-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-r from-cyan-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{day.day}</div>
              <div>
                <p className="text-xs text-gray-400">Day {day.day}</p>
                <p className="font-semibold text-gray-900">{day.theme}</p>
              </div>
            </div>
            <div className="space-y-4">
              {day.schedule.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs text-gray-400 w-12 text-right mt-0.5 shrink-0">{item.time}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.place}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    {item.price && <p className="text-xs text-green-600 mt-0.5 font-medium">💴 {item.price}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-amber-50 rounded-2xl p-5 mb-8 border border-amber-100">
          <h3 className="font-bold text-amber-800 mb-3">💡 沖縄カップル旅行のコツ</h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li>• <strong>レンタカーは必須</strong>。那覇空港でのピックアップが便利。早割で安く予約を</li>
            <li>• 夏（7〜8月）は台風シーズン。<strong>9〜10月のオフシーズンが狙い目</strong>で料金も安い</li>
            <li>• <strong>日焼け止めは現地調達でも可</strong>。ドラッグストアが充実しています</li>
            <li>• 古宇利島ハートロックは<strong>干潮時間帯に訪問</strong>するとベストショットが撮れます</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-cyan-400 to-sky-600 rounded-2xl p-6 text-white text-center">
          <p className="font-bold text-lg mb-2">あなただけの沖縄プランを無料で作成</p>
          <p className="text-sm opacity-80 mb-4">旅行スタイルに合わせてAIがカスタマイズします</p>
          <Link href="/plan"
            className="inline-block bg-white text-sky-600 font-bold px-8 py-3 rounded-full hover:shadow-lg transition-all">
            沖縄プランを作る →
          </Link>
        </div>
      </div>
    </main>
  );
}
