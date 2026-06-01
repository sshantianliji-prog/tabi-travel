export type TravelType = 'solo' | 'couple' | 'friends' | 'family';
export type Duration = 'day-trip' | '1night2days' | '2nights3days' | '3plus';
export type Budget = 'under10k' | '10k-30k' | '30k-50k' | '50k-80k' | '80k-120k' | '120k-200k' | '200k-300k' | 'over300k';

export type Region =
  | 'hokkaido'
  | 'aomori' | 'iwate' | 'miyagi' | 'akita' | 'yamagata' | 'fukushima'
  | 'ibaraki' | 'tochigi' | 'gunma' | 'saitama' | 'chiba' | 'tokyo' | 'kanagawa'
  | 'niigata' | 'toyama' | 'ishikawa' | 'fukui' | 'yamanashi' | 'nagano' | 'gifu' | 'shizuoka' | 'aichi'
  | 'mie' | 'shiga' | 'kyoto' | 'osaka' | 'hyogo' | 'nara' | 'wakayama'
  | 'tottori' | 'shimane' | 'okayama' | 'hiroshima' | 'yamaguchi'
  | 'tokushima' | 'kagawa' | 'ehime' | 'kochi'
  | 'fukuoka' | 'saga' | 'nagasaki' | 'kumamoto' | 'oita' | 'miyazaki' | 'kagoshima'
  | 'okinawa'
  | 'ai-suggest';

export type Interest =
  | 'nature' | 'gourmet' | 'onsen' | 'culture' | 'outdoor'
  | 'urban' | 'shopping' | 'instagram' | 'nightlife' | 'sports'
  | 'arts' | 'local-experience';
export type AccommodationType = 'luxury' | 'business' | 'ryokan' | 'guesthouse';
export type TravelStyle = 'relaxed' | 'active' | 'gourmet-focus' | 'sightseeing';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type TransportMethod = 'shinkansen' | 'plane' | 'car' | 'local-train' | 'highway-bus' | 'ferry' | 'any';

export interface TravelPreferences {
  travelType: TravelType;
  duration: Duration;
  budget: Budget;
  departureRegion?: Region;
  transportMethod?: TransportMethod;
  region: Region;
  travelDate?: string; // YYYY-MM-DD形式
  interests: Interest[];
  accommodationType?: AccommodationType;
  travelStyle?: TravelStyle;
  season?: Season;
}

// ── TransportMethod Labels & Icons ──────────────────────────────────────────
export const TRANSPORT_METHOD_LABELS: Record<TransportMethod, string> = {
  shinkansen:    '新幹線',
  plane:         '飛行機',
  car:           '車（ドライブ）',
  'local-train': '在来線・特急',
  'highway-bus': '高速バス',
  ferry:         'フェリー・船',
  any:           'AIにおまかせ',
};

export const TRANSPORT_METHOD_ICONS: Record<TransportMethod, string> = {
  shinkansen:    '🚅',
  plane:         '✈️',
  car:           '🚗',
  'local-train': '🚃',
  'highway-bus': '🚌',
  ferry:         '⛴️',
  any:           '✨',
};

// ── Labels ──────────────────────────────────────────────

export const TRAVEL_TYPE_LABELS: Record<TravelType, string> = {
  solo: 'ひとり旅', couple: 'カップル', friends: '友達と', family: '家族と',
};
export const DURATION_LABELS: Record<Duration, string> = {
  'day-trip': '日帰り', '1night2days': '1泊2日', '2nights3days': '2泊3日', '3plus': '3泊以上',
};
export const BUDGET_LABELS: Record<Budget, string> = {
  'under10k':   '〜1万円',
  '10k-30k':    '1〜3万円',
  '30k-50k':    '3〜5万円',
  '50k-80k':    '5〜8万円',
  '80k-120k':   '8〜12万円',
  '120k-200k':  '12〜20万円',
  '200k-300k':  '20〜30万円',
  'over300k':   '30万円〜',
};

export const REGION_LABELS: Record<Region, string> = {
  hokkaido: '北海道',
  aomori: '青森県', iwate: '岩手県', miyagi: '宮城県', akita: '秋田県', yamagata: '山形県', fukushima: '福島県',
  ibaraki: '茨城県', tochigi: '栃木県', gunma: '群馬県', saitama: '埼玉県', chiba: '千葉県', tokyo: '東京都', kanagawa: '神奈川県',
  niigata: '新潟県', toyama: '富山県', ishikawa: '石川県', fukui: '福井県', yamanashi: '山梨県', nagano: '長野県', gifu: '岐阜県', shizuoka: '静岡県', aichi: '愛知県',
  mie: '三重県', shiga: '滋賀県', kyoto: '京都府', osaka: '大阪府', hyogo: '兵庫県', nara: '奈良県', wakayama: '和歌山県',
  tottori: '鳥取県', shimane: '島根県', okayama: '岡山県', hiroshima: '広島県', yamaguchi: '山口県',
  tokushima: '徳島県', kagawa: '香川県', ehime: '愛媛県', kochi: '高知県',
  fukuoka: '福岡県', saga: '佐賀県', nagasaki: '長崎県', kumamoto: '熊本県', oita: '大分県', miyazaki: '宮崎県', kagoshima: '鹿児島県',
  okinawa: '沖縄県',
  'ai-suggest': 'AIにおまかせ ✨',
};

export const REGION_ICONS: Record<Region, string> = {
  hokkaido: '🐻',
  aomori: '🍎', iwate: '🐴', miyagi: '🐟', akita: '🌾', yamagata: '🍒', fukushima: '🍑',
  ibaraki: '🥜', tochigi: '🍓', gunma: '♨️', saitama: '🏯', chiba: '🌊', tokyo: '🗼', kanagawa: '⛰️',
  niigata: '🍶', toyama: '🐡', ishikawa: '🏮', fukui: '🦕', yamanashi: '🍇', nagano: '⛷️', gifu: '🏔️', shizuoka: '🍵', aichi: '🌆',
  mie: '⛩️', shiga: '🚣', kyoto: '🎋', osaka: '🍢', hyogo: '🦀', nara: '🦌', wakayama: '🍊',
  tottori: '🏜️', shimane: '🌅', okayama: '🍑', hiroshima: '🕊️', yamaguchi: '🐡',
  tokushima: '💃', kagawa: '🍜', ehime: '🍊', kochi: '🐟',
  fukuoka: '🍖', saga: '🏺', nagasaki: '⛪', kumamoto: '🐻', oita: '♨️', miyazaki: '🌴', kagoshima: '🌋',
  okinawa: '🏖️',
  'ai-suggest': '✨',
};

export const REGION_GROUPS: { label: string; regions: Region[] }[] = [
  { label: '北海道', regions: ['hokkaido'] },
  { label: '東北', regions: ['aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'] },
  { label: '関東', regions: ['tokyo', 'kanagawa', 'saitama', 'chiba', 'ibaraki', 'tochigi', 'gunma'] },
  { label: '中部', regions: ['aichi', 'shizuoka', 'nagano', 'gifu', 'niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi'] },
  { label: '近畿', regions: ['osaka', 'kyoto', 'hyogo', 'nara', 'shiga', 'mie', 'wakayama'] },
  { label: '中国', regions: ['hiroshima', 'okayama', 'shimane', 'tottori', 'yamaguchi'] },
  { label: '四国', regions: ['kagawa', 'ehime', 'kochi', 'tokushima'] },
  { label: '九州', regions: ['fukuoka', 'oita', 'nagasaki', 'kumamoto', 'kagoshima', 'miyazaki', 'saga'] },
  { label: '沖縄', regions: ['okinawa'] },
  { label: 'おまかせ', regions: ['ai-suggest'] },
];

export const INTEREST_LABELS: Record<Interest, string> = {
  nature: '自然・絶景', gourmet: 'グルメ・食べ歩き', onsen: '温泉・スパ', culture: '文化・歴史・寺社',
  outdoor: 'アウトドア・登山', urban: '都市観光・街歩き', shopping: 'ショッピング', instagram: 'インスタ映え',
  nightlife: '夜景・ナイトライフ', sports: 'スポーツ・アクティビティ', arts: 'アート・美術館', 'local-experience': '地元体験・農漁業',
};
export const INTEREST_ICONS: Record<Interest, string> = {
  nature: '🏔️', gourmet: '🍜', onsen: '♨️', culture: '⛩️', outdoor: '🏕️', urban: '🏙️',
  shopping: '🛍️', instagram: '📸', nightlife: '🌃', sports: '🏄', arts: '🎨', 'local-experience': '🌾',
};

export const ACCOMMODATION_LABELS: Record<AccommodationType, string> = {
  luxury: 'ラグジュアリーホテル', business: 'ビジネスホテル', ryokan: '旅館・温泉宿', guesthouse: 'ゲストハウス・民宿',
};
export const ACCOMMODATION_ICONS: Record<AccommodationType, string> = {
  luxury: '🏨', business: '🏢', ryokan: '🎎', guesthouse: '🏡',
};

export const TRAVEL_STYLE_LABELS: Record<TravelStyle, string> = {
  relaxed: 'のんびり派', active: 'アクティブ派', 'gourmet-focus': 'グルメ重視', sightseeing: '観光スポット制覇',
};
export const TRAVEL_STYLE_ICONS: Record<TravelStyle, string> = {
  relaxed: '😌', active: '🏃', 'gourmet-focus': '🍽️', sightseeing: '🗺️',
};

export const SEASON_LABELS: Record<Season, string> = {
  spring: '春（3〜5月）', summer: '夏（6〜8月）', autumn: '秋（9〜11月）', winter: '冬（12〜2月）',
};
export const SEASON_ICONS: Record<Season, string> = {
  spring: '🌸', summer: '☀️', autumn: '🍁', winter: '❄️',
};
