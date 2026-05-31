import { Region } from '@/types/travel';

// 都道府県 → エリアゾーン
type Zone = 'hokkaido' | 'tohoku' | 'kanto' | 'koshinetsu' | 'hokuriku' | 'tokai' | 'kinki' | 'chugoku' | 'shikoku' | 'kyushu' | 'okinawa';

const REGION_TO_ZONE: Partial<Record<Region, Zone>> = {
  hokkaido: 'hokkaido',
  aomori: 'tohoku', iwate: 'tohoku', miyagi: 'tohoku', akita: 'tohoku', yamagata: 'tohoku', fukushima: 'tohoku',
  ibaraki: 'kanto', tochigi: 'kanto', gunma: 'kanto', saitama: 'kanto', chiba: 'kanto', tokyo: 'kanto', kanagawa: 'kanto',
  niigata: 'koshinetsu', yamanashi: 'koshinetsu', nagano: 'koshinetsu',
  toyama: 'hokuriku', ishikawa: 'hokuriku', fukui: 'hokuriku',
  gifu: 'tokai', shizuoka: 'tokai', aichi: 'tokai', mie: 'tokai',
  shiga: 'kinki', kyoto: 'kinki', osaka: 'kinki', hyogo: 'kinki', nara: 'kinki', wakayama: 'kinki',
  tottori: 'chugoku', shimane: 'chugoku', okayama: 'chugoku', hiroshima: 'chugoku', yamaguchi: 'chugoku',
  tokushima: 'shikoku', kagawa: 'shikoku', ehime: 'shikoku', kochi: 'shikoku',
  fukuoka: 'kyushu', saga: 'kyushu', nagasaki: 'kyushu', kumamoto: 'kyushu', oita: 'kyushu', miyazaki: 'kyushu', kagoshima: 'kyushu',
  okinawa: 'okinawa',
};

const ZONE_LABELS: Record<Zone, string> = {
  hokkaido: '北海道', tohoku: '東北', kanto: '関東', koshinetsu: '甲信越',
  hokuriku: '北陸', tokai: '東海', kinki: '近畿', chugoku: '中国',
  shikoku: '四国', kyushu: '九州', okinawa: '沖縄',
};

export interface TransportFare {
  method: string;
  icon: string;
  oneWay: number;
  roundTrip: number;
  duration: string;
  tip: string;
  bookingName: string;
  bookingUrl: string;
  budgetOption?: {
    method: string;
    oneWay: number;
    tip: string;
  };
}

// ゾーン間の交通費テーブル（片道・正規料金の目安）
// キー: `${小さいゾーン}-${大きいゾーン}` or `${同じゾーン}`
const ZONE_FARES: Record<string, TransportFare> = {
  'kanto-tohoku': {
    method: '新幹線（はやぶさ/やまびこ）', icon: '🚅',
    oneWay: 11000, roundTrip: 22000,
    duration: '1時間30分〜2時間',
    tip: '新幹線eチケット（早割）で3,000円以上お得に',
    bookingName: 'えきねっと', bookingUrl: 'https://www.eki-net.com',
    budgetOption: { method: '高速バス', oneWay: 4000, tip: '夜行バスなら宿泊費も節約できます' },
  },
  'kanto-hokkaido': {
    method: '飛行機（ANA/JAL）', icon: '✈️',
    oneWay: 20000, roundTrip: 40000,
    duration: '1時間30分',
    tip: '早割45で片道8,000円台も。スカイマーク・AIRDOもおすすめ',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
    budgetOption: { method: '新幹線（はやぶさ）', oneWay: 23390, tip: '2024年北陸新幹線延伸後は選択肢が増えました' },
  },
  'kanto-koshinetsu': {
    method: '新幹線（あずさ/かがやき）', icon: '🚅',
    oneWay: 8500, roundTrip: 17000,
    duration: '1時間20分〜2時間',
    tip: 'JR東日本の「えきねっと」で早割あり',
    bookingName: 'えきねっと', bookingUrl: 'https://www.eki-net.com',
    budgetOption: { method: '高速バス', oneWay: 3500, tip: '新宿発の高速バスが多く便利' },
  },
  'kanto-hokuriku': {
    method: '新幹線（かがやき/はくたか）', icon: '🚅',
    oneWay: 14380, roundTrip: 28760,
    duration: '2時間30分',
    tip: '北陸新幹線は早割で2,000円ほど安くなります',
    bookingName: 'えきねっと', bookingUrl: 'https://www.eki-net.com',
    budgetOption: { method: '高速バス', oneWay: 5000, tip: '夜行バスで節約＋移動時間を有効活用' },
  },
  'kanto-tokai': {
    method: '新幹線（のぞみ/ひかり）', icon: '🚅',
    oneWay: 11090, roundTrip: 22180,
    duration: '1時間40分',
    tip: 'EX予約（スマートEX）で200円引き。往復割引も使えます',
    bookingName: 'スマートEX', bookingUrl: 'https://smart-ex.jp',
    budgetOption: { method: '高速バス', oneWay: 3500, tip: '青春18きっぷシーズンは在来線も選択肢' },
  },
  'kanto-kinki': {
    method: '新幹線（のぞみ）', icon: '🚅',
    oneWay: 13870, roundTrip: 27740,
    duration: '2時間30分',
    tip: 'EX予約「EXのぞみファミリー早特」で最大4,000円引き',
    bookingName: 'スマートEX', bookingUrl: 'https://smart-ex.jp',
    budgetOption: { method: '夜行バス（ウィラー等）', oneWay: 4000, tip: '深夜便で宿泊費も節約。片道4,000円〜' },
  },
  'kanto-chugoku': {
    method: '新幹線（のぞみ）', icon: '🚅',
    oneWay: 18380, roundTrip: 36760,
    duration: '3時間50分',
    tip: '飛行機との競合路線。e5489早特で数千円安くなることも',
    bookingName: 'e5489', bookingUrl: 'https://www.jr-odekake.net/railroad/ticket/types/e5489/',
    budgetOption: { method: '飛行機', oneWay: 14000, tip: 'スカイマーク・ソラシドエアが安い' },
  },
  'kanto-shikoku': {
    method: '飛行機', icon: '✈️',
    oneWay: 15000, roundTrip: 30000,
    duration: '1時間15分',
    tip: '早割で8,000円台も。新幹線+特急より早くて安い場合が多い',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
    budgetOption: { method: '高速バス（瀬戸大橋経由）', oneWay: 6000, tip: '夜行バスなら移動費を節約できます' },
  },
  'kanto-kyushu': {
    method: '飛行機（ANA/JAL）', icon: '✈️',
    oneWay: 17000, roundTrip: 34000,
    duration: '1時間45分',
    tip: 'スカイマーク・スターフライヤーも就航。早割で10,000円以下も',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
    budgetOption: { method: '新幹線（のぞみ）', oneWay: 22220, tip: '時間はかかりますが荷物が多いときは便利' },
  },
  'kanto-okinawa': {
    method: '飛行機（ANA/JAL）', icon: '✈️',
    oneWay: 28000, roundTrip: 56000,
    duration: '2時間30分',
    tip: 'LCC（ピーチ・ジェットスター）早割で片道5,000円台も可能',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
    budgetOption: { method: 'LCC（ピーチ等）', oneWay: 8000, tip: '3ヶ月前から予約でかなり安くなります' },
  },
  'tohoku-kinki': {
    method: '新幹線＋のぞみ乗継', icon: '🚅',
    oneWay: 22000, roundTrip: 44000,
    duration: '4時間',
    tip: '飛行機が割安になる距離。比較してみましょう',
    bookingName: 'えきねっと', bookingUrl: 'https://www.eki-net.com',
    budgetOption: { method: '飛行機', oneWay: 16000, tip: '仙台〜伊丹・神戸便が便利' },
  },
  'tohoku-hokkaido': {
    method: '新幹線（はやぶさ）', icon: '🚅',
    oneWay: 16000, roundTrip: 32000,
    duration: '2時間〜3時間',
    tip: 'えきねっと早特で数千円お得に',
    bookingName: 'えきねっと', bookingUrl: 'https://www.eki-net.com',
    budgetOption: { method: '飛行機', oneWay: 12000, tip: '仙台〜新千歳便が安い場合も' },
  },
  'tohoku-okinawa': {
    method: '飛行機（乗継）', icon: '✈️',
    oneWay: 30000, roundTrip: 60000,
    duration: '4時間（乗継含む）',
    tip: '東京乗継が一般的。早めに予約を',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
  },
  'hokkaido-kinki': {
    method: '飛行機（ANA/JAL）', icon: '✈️',
    oneWay: 23000, roundTrip: 46000,
    duration: '2時間',
    tip: '新千歳〜伊丹・神戸・関空の3路線あり。早割で12,000円台も',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
    budgetOption: { method: 'LCC（ピーチ）', oneWay: 10000, tip: '新千歳〜関空便は安い' },
  },
  'hokkaido-kyushu': {
    method: '飛行機（ANA/JAL）', icon: '✈️',
    oneWay: 30000, roundTrip: 60000,
    duration: '2時間30分',
    tip: '早割で15,000円台も。LCCは路線が限られます',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
  },
  'hokkaido-okinawa': {
    method: '飛行機（ANA/JAL）', icon: '✈️',
    oneWay: 40000, roundTrip: 80000,
    duration: '3時間30分（直行）〜5時間（乗継）',
    tip: '直行便は少ない。早めに予約＆LCC比較を',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
  },
  'kinki-chugoku': {
    method: '新幹線（のぞみ/さくら）', icon: '🚅',
    oneWay: 9000, roundTrip: 18000,
    duration: '1時間〜1時間30分',
    tip: 'e5489早特21で最大4,000円引き',
    bookingName: 'e5489', bookingUrl: 'https://www.jr-odekake.net/railroad/ticket/types/e5489/',
    budgetOption: { method: '高速バス', oneWay: 4000, tip: '大阪〜広島間の高速バスが充実' },
  },
  'kinki-shikoku': {
    method: '特急（南風/しおかぜ）', icon: '🚅',
    oneWay: 7500, roundTrip: 15000,
    duration: '2時間〜2時間30分',
    tip: 'JR四国のネット予約「e5489」で割引あり',
    bookingName: 'e5489', bookingUrl: 'https://www.jr-odekake.net/railroad/ticket/types/e5489/',
    budgetOption: { method: '高速バス', oneWay: 3500, tip: '大阪〜松山・高知のバスが安い' },
  },
  'kinki-kyushu': {
    method: '新幹線（さくら/みずほ）', icon: '🚅',
    oneWay: 15310, roundTrip: 30620,
    duration: '2時間30分',
    tip: 'e5489早特21で最大5,000円引き。往復割引も使えます',
    bookingName: 'e5489', bookingUrl: 'https://www.jr-odekake.net/railroad/ticket/types/e5489/',
    budgetOption: { method: '飛行機（LCC）', oneWay: 9000, tip: 'ピーチ・ジェットスターが運航中' },
  },
  'kinki-hokkaido': {
    method: '飛行機（ANA/JAL）', icon: '✈️',
    oneWay: 22000, roundTrip: 44000,
    duration: '2時間',
    tip: '早割28で10,000円台も可能',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
    budgetOption: { method: 'LCC（ピーチ）', oneWay: 10000, tip: '関空〜新千歳便が就航しています' },
  },
  'kinki-okinawa': {
    method: '飛行機（ANA/JAL）', icon: '✈️',
    oneWay: 25000, roundTrip: 50000,
    duration: '2時間20分',
    tip: 'LCCで片道5,000円台も。伊丹・神戸・関空から選べます',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
    budgetOption: { method: 'LCC（ピーチ・ジェットスター）', oneWay: 7000, tip: '関空発が最も安い傾向' },
  },
  'chugoku-kyushu': {
    method: '新幹線（のぞみ/さくら）', icon: '🚅',
    oneWay: 8000, roundTrip: 16000,
    duration: '1時間〜1時間30分',
    tip: 'e5489早特で割引あり',
    bookingName: 'e5489', bookingUrl: 'https://www.jr-odekake.net/railroad/ticket/types/e5489/',
    budgetOption: { method: '高速バス', oneWay: 3500, tip: '広島〜福岡の高速バスが多く運行' },
  },
  'chugoku-okinawa': {
    method: '飛行機', icon: '✈️',
    oneWay: 20000, roundTrip: 40000,
    duration: '2時間',
    tip: '広島・岡山発のORC・ANA便。早割で10,000円台も',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
  },
  'shikoku-kyushu': {
    method: '高速バス＋フェリー', icon: '🚌',
    oneWay: 6000, roundTrip: 12000,
    duration: '3時間〜4時間',
    tip: '新幹線経由より高速バス直行が安くて便利',
    bookingName: 'バスえきねっと', bookingUrl: 'https://www.bushikaku.net',
    budgetOption: { method: '飛行機', oneWay: 14000, tip: '松山〜福岡便が就航' },
  },
  'kyushu-okinawa': {
    method: '飛行機（ANA/JAL）', icon: '✈️',
    oneWay: 18000, roundTrip: 36000,
    duration: '1時間30分',
    tip: 'ソラシドエア・スカイマークも就航。早割で8,000円台も',
    bookingName: 'スカイスキャナー', bookingUrl: 'https://www.skyscanner.jp',
    budgetOption: { method: 'LCC（ピーチ）', oneWay: 7000, tip: '福岡・那覇間のピーチが安い' },
  },
  // 近距離・同ゾーン
  'same-zone': {
    method: '在来線特急・高速バス', icon: '🚌',
    oneWay: 3000, roundTrip: 6000,
    duration: '1時間〜2時間',
    tip: '同地方内なので移動費は比較的安め',
    bookingName: 'じゃらん交通', bookingUrl: 'https://www.jalan.net',
  },
  'tokai-kinki': {
    method: '新幹線（のぞみ/ひかり）', icon: '🚅',
    oneWay: 6680, roundTrip: 13360,
    duration: '50分〜1時間10分',
    tip: 'スマートEXで200円引き。近距離なので日帰りも余裕',
    bookingName: 'スマートEX', bookingUrl: 'https://smart-ex.jp',
    budgetOption: { method: '高速バス', oneWay: 2500, tip: '名古屋〜大阪は高速バスが充実' },
  },
  'kanto-tokai-kinki': {
    method: '新幹線（のぞみ）', icon: '🚅',
    oneWay: 11090, roundTrip: 22180,
    duration: '1時間40分',
    tip: 'スマートEXで予約がお得',
    bookingName: 'スマートEX', bookingUrl: 'https://smart-ex.jp',
  },
};

function getZoneKey(z1: Zone, z2: Zone): string {
  const zones = [z1, z2].sort();
  return zones[0] === zones[1] ? 'same-zone' : `${zones[0]}-${zones[1]}`;
}

export function getTransportFare(from: Region, to: Region): TransportFare | null {
  if (from === to) return null;
  if (from === 'ai-suggest' || to === 'ai-suggest') return null;

  const fromZone = REGION_TO_ZONE[from];
  const toZone = REGION_TO_ZONE[to];
  if (!fromZone || !toZone) return null;
  if (fromZone === toZone) return ZONE_FARES['same-zone'];

  const key = getZoneKey(fromZone, toZone);
  return ZONE_FARES[key] ?? null;
}

export function getZoneLabel(region: Region): string {
  const zone = REGION_TO_ZONE[region];
  return zone ? ZONE_LABELS[zone] : '';
}
