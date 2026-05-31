import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '【2025年最新】京都2泊3日モデルプラン — 金閣寺・嵐山・祇園を効率よく巡る | タビ',
  description: '京都を2泊3日で楽しむための完全ガイド。金閣寺・嵐山・伏見稲荷・祇園を効率よく巡るルートを、実在するホテル・レストランの名前入りでご紹介。AIがそのまま使えるプランを作成します。',
  keywords: ['京都 旅行プラン', '京都 2泊3日', '京都 観光モデルコース', '京都 ホテル おすすめ', '京都 グルメ'],
  openGraph: {
    title: '【2025年最新】京都2泊3日モデルプラン | タビ',
    description: '金閣寺・嵐山・祇園を効率よく巡る京都2泊3日の完全ガイド。実在するホテル・レストラン名入り。',
  },
};

export default function KyotoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="text-sm text-sky-500 hover:text-sky-600 mb-6 inline-block">← ガイド一覧に戻る</Link>

        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-8 text-white mb-8">
          <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">京都 · 2泊3日</span>
          <h1 className="text-2xl font-bold mt-3 mb-2 leading-snug">京都2泊3日モデルプラン<br />金閣寺・嵐山・祇園を効率よく巡る</h1>
          <p className="text-sm opacity-80">実在するホテル・レストラン名入りの完全ガイド</p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-5 mb-8 border border-amber-100">
          <p className="text-sm text-amber-800 font-medium">📌 このプランのポイント</p>
          <ul className="mt-2 space-y-1 text-sm text-amber-700">
            <li>・移動の無駄がない効率的なルート設計</li>
            <li>・予算3〜10万円（1人あたり）に対応</li>
            <li>・混雑を避ける早朝観光テクニック付き</li>
            <li>・地元民おすすめの穴場グルメも紹介</li>
          </ul>
        </div>

        {[
          {
            day: 1, theme: '嵐山・金閣寺エリア',
            schedule: [
              { time: '9:00', place: '天龍寺（嵐山）', type: 'spot', desc: '世界遺産の庭園。竹林の小径と合わせて午前中に訪問すると混雑を避けられます。', price: '入園料500円〜' },
              { time: '10:30', place: '嵐山 竹林の小径', type: 'spot', desc: '朝9時台が最も空いていてフォトジェニック。早めの訪問がおすすめ。', price: '無料' },
              { time: '12:00', place: '嵯峨野 湯豆腐 竹仙', type: 'meal', desc: '嵐山の老舗湯豆腐店。庭園を眺めながら食べる京豆腐は絶品。', price: '昼食2,500円〜' },
              { time: '14:00', place: '金閣寺（鹿苑寺）', type: 'spot', desc: '午後は光の加減で金箔が美しく輝きます。入場後すぐの撮影スポットを確保して。', price: '入場料500円' },
              { time: '18:00', place: 'ホテルカンラ京都', type: 'stay', desc: '烏丸五条に位置するデザインホテル。京都らしさと現代的な快適さを両立。', price: '1泊15,000円〜' },
              { time: '19:00', place: '祇をん 丸山', type: 'meal', desc: '祇園の老舗懐石料亭。特別な夕食に相応しい一軒。要予約。', price: '夕食8,000円〜' },
            ],
          },
          {
            day: 2, theme: '伏見稲荷・東山エリア',
            schedule: [
              { time: '7:00', place: '伏見稲荷大社', type: 'spot', desc: '千本鳥居は早朝7時台が圧倒的に空いています。インスタ映えの撮影はこの時間帯に。', price: '無料' },
              { time: '10:00', place: '清水寺', type: 'spot', desc: '世界遺産の清水の舞台。二年坂・三年坂も合わせて散策を。', price: '入場料400円' },
              { time: '12:30', place: '阿古屋茶屋（清水坂）', type: 'meal', desc: '清水寺門前の名物わらび餅と抹茶のセット。行列必至の人気店。', price: '抹茶セット1,000円' },
              { time: '14:00', place: '南禅寺', type: 'spot', desc: '水路閣（煉瓦造りのアーチ橋）がインスタ映えポイント。拝観無料エリアも広い。', price: '無料〜600円' },
              { time: '17:00', place: '先斗町', type: 'spot', desc: '鴨川沿いの石畳の路地。夕暮れ時の散策が最高。', price: '無料' },
              { time: '19:00', place: 'イノダコーヒー 本店', type: 'meal', desc: '京都の老舗喫茶。夕食後のコーヒータイムに。昭和レトロな雰囲気が人気。', price: 'コーヒー750円〜' },
            ],
          },
          {
            day: 3, theme: '錦市場・二条城',
            schedule: [
              { time: '9:00', place: '錦市場', type: 'spot', desc: '「京の台所」と呼ばれる市場。朝9時台は比較的空いていて食べ歩きが楽しめます。', price: '食べ歩き1,000〜2,000円' },
              { time: '11:00', place: '二条城', type: 'spot', desc: '世界遺産。鶯張りの廊下と障壁画は必見。所要約1.5時間。', price: '入場料800円' },
              { time: '13:00', place: 'ランチ 京都 割烹 晴鴨楼', type: 'meal', desc: '二条城近くの割烹料理店。京料理の昼膳をリーズナブルに楽しめます。', price: '昼膳2,500円〜' },
              { time: '15:00', place: 'JR京都駅', type: 'transport', desc: '帰途へ。駅構内の伊勢丹でお土産を購入するのがおすすめ。', price: '' },
            ],
          },
        ].map((day) => (
          <div key={day.day} className="bg-white rounded-2xl p-6 mb-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{day.day}</div>
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
          <h3 className="font-bold text-amber-800 mb-3">💡 京都旅行のコツ</h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li>• <strong>紅葉・桜シーズンは3〜4ヶ月前の予約が必須</strong>。ホテルが先に埋まります</li>
            <li>• 人気スポットは<strong>開門直後か夕方遅め</strong>が空いていてフォトジェニック</li>
            <li>• 市バス1日券（700円）が移動に便利。観光スポット間の移動コストが下がります</li>
            <li>• <strong>錦市場は朝9時前後が狙い目</strong>。昼前は観光客で激混みに</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl p-6 text-white text-center">
          <p className="font-bold text-lg mb-2">あなた専用の京都プランを無料で作成</p>
          <p className="text-sm opacity-80 mb-4">予算・人数・旅のスタイルに合わせてAIがカスタマイズします</p>
          <Link href="/plan"
            className="inline-block bg-white text-sky-600 font-bold px-8 py-3 rounded-full hover:shadow-lg transition-all">
            京都プランを作る →
          </Link>
        </div>
      </div>
    </main>
  );
}
