import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '【家族旅行】北海道2泊3日プラン — 札幌・小樽・富良野を子連れで楽しむ | タビ',
  description: '子連れで行く北海道旅行の完全ガイド。札幌・小樽・富良野を巡る2泊3日のモデルコース。小さなお子様がいるご家族でも安心のスケジュールと実在する宿泊先をご紹介。',
  keywords: ['北海道 家族旅行', '北海道 子連れ', '北海道 2泊3日', '札幌 観光', '富良野 旅行'],
  openGraph: {
    title: '【家族旅行】北海道2泊3日プラン | タビ',
    description: '札幌・小樽・富良野を子連れで楽しむ北海道2泊3日の完全ガイド。',
  },
};

export default function HokkaidoFamilyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="text-sm text-sky-500 hover:text-sky-600 mb-6 inline-block">← ガイド一覧に戻る</Link>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white mb-8">
          <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">北海道 · 家族 · 2泊3日</span>
          <h1 className="text-2xl font-bold mt-3 mb-2 leading-snug">北海道家族旅行2泊3日<br />札幌・小樽・富良野プラン</h1>
          <p className="text-sm opacity-80">子連れでも安心。大自然と絶品グルメを家族で満喫</p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-5 mb-8 border border-amber-100">
          <p className="text-sm text-amber-800 font-medium">📌 このプランのポイント</p>
          <ul className="mt-2 space-y-1 text-sm text-amber-700">
            <li>・子どもが喜ぶ体験型スポットを厳選</li>
            <li>・移動距離を抑えた無理のないルート</li>
            <li>・予算5〜15万円（4人家族の目安）</li>
            <li>・夏（7〜8月）のラベンダーシーズンに最適</li>
          </ul>
        </div>

        {[
          {
            day: 1, theme: '札幌到着・円山動物園・すすきの',
            schedule: [
              { time: '10:00', place: '札幌市円山動物園', desc: '北海道在来種のエゾヒグマやホッキョクグマが人気。子どもが大喜びする北海道ならではの動物たちに会えます。', price: '入場料800円（大人）・無料（高校生以下）' },
              { time: '13:00', place: 'ジンギスカン だるま 本店', desc: '札幌の老舗ジンギスカン専門店。ラム肉が苦手なお子様でもスープで煮込む食べ方なら食べやすい。', price: '昼食1,500円〜' },
              { time: '15:00', place: '大倉山ジャンプ競技場', desc: 'リフトで上がった展望台からの札幌市内の眺望が絶景。夏でも涼しく気持ちいいスポット。', price: 'リフト往復600円' },
              { time: '18:00', place: 'JRタワーホテル日航札幌', desc: '札幌駅直結で移動が楽。ファミリールームが広く、子連れに人気の高い宿。', price: '1泊20,000円〜（4名）' },
              { time: '19:00', place: '海鮮居酒屋 北の味紀行 札幌本店', desc: '新鮮な北海道海鮮を家族でわいわい食べられる居酒屋。子ども用メニューも充実。', price: '夕食2,000円〜' },
            ],
          },
          {
            day: 2, theme: '小樽・運河散策',
            schedule: [
              { time: '9:00', place: '小樽運河', desc: '明治時代の石造り倉庫が立ち並ぶ景観は圧巻。朝早めの訪問がベスト。ガス燈と運河の組み合わせが写真映え。', price: '無料' },
              { time: '10:30', place: '小樽オルゴール堂 本館', desc: '子どもが喜ぶオルゴール専門店。自分でオルゴールを作る体験（有料）も人気。', price: '入場無料・体験2,000円〜' },
              { time: '12:00', place: '小樽 かね庄', desc: '小樽の人気寿司店。北海道の新鮮ネタをリーズナブルに楽しめる。ランチの握りセットがお得。', price: '昼食2,000円〜' },
              { time: '14:00', place: '小樽水族館', desc: '北海道唯一の水族館。イルカ・トドのショーは子どもに大人気。野外展示も広く一日楽しめます。', price: '入場料1,500円（大人）・500円（小学生）' },
              { time: '19:00', place: 'ホテルノルド小樽', desc: '運河沿いのクラシカルなホテル。小樽散策の拠点に最適。', price: '1泊15,000円〜（4名）' },
            ],
          },
          {
            day: 3, theme: '富良野ラベンダー・帰路',
            schedule: [
              { time: '8:30', place: 'ファーム富田（富良野）', desc: '日本で最も有名なラベンダー農場。7月中旬〜8月上旬が見頃のピーク。ラベンダーソフトクリームは必食。', price: '無料（一部有料）' },
              { time: '11:00', place: '富良野チーズ工房', desc: '地元のチーズ・バター作り体験ができる工房。子どもに人気の体験コンテンツ。', price: '体験1,000円〜' },
              { time: '12:30', place: 'レストラン フラノ寶亭留', desc: '富良野の食材を使ったランチ。大きな窓から見えるラベンダー畑が最高のロケーション。', price: '昼食2,500円〜' },
              { time: '15:00', place: '新千歳空港', desc: '空港内のロイズチョコレートワールドやどさんこファクトリーでお土産の最終購入を。', price: '' },
            ],
          },
        ].map((day) => (
          <div key={day.day} className="bg-white rounded-2xl p-6 mb-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{day.day}</div>
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
          <h3 className="font-bold text-amber-800 mb-3">💡 北海道家族旅行のコツ</h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li>• <strong>レンタカーは空港近くで借りるのが最安</strong>。4人以上ならミニバンが快適</li>
            <li>• <strong>ラベンダーは7月中旬〜8月上旬が最盛期</strong>。この時期は3ヶ月前予約必須</li>
            <li>• 北海道は広い。<strong>「札幌と富良野を1日で」は無理</strong>。ゆとりあるルート設計を</li>
            <li>• <strong>新千歳空港は3時間前到着推奨</strong>。夏の混雑でチェックインに時間がかかります</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white text-center">
          <p className="font-bold text-lg mb-2">あなたの家族に合った北海道プランを無料で作成</p>
          <p className="text-sm opacity-80 mb-4">子どもの年齢・人数・予算に合わせてAIがカスタマイズ</p>
          <Link href="/plan"
            className="inline-block bg-white text-emerald-600 font-bold px-8 py-3 rounded-full hover:shadow-lg transition-all">
            北海道プランを作る →
          </Link>
        </div>
      </div>
    </main>
  );
}
