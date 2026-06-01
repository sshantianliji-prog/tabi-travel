import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface DiscoverInput {
  mood: string;       // 'relax' | 'active' | 'gourmet' | 'adventure'
  themes: string[];   // ['nature','onsen','culture','sea','city','food']
  duration: string;   // 'day-trip' | '1-2nights' | '3plus'
  budget: string;     // 'low' | 'mid' | 'high'
  travelType: string; // 'solo' | 'couple' | 'friends' | 'family'
  season?: string;
}

export interface DestinationSuggestion {
  region: string;
  regionLabel: string;
  emoji: string;
  title: string;
  tagline: string;
  reason: string;
  highlights: string[];
  bestFor: string;
}

const SYSTEM = `あなたは「タビ」という日本旅行の専門家AIです。
ユーザーの旅の気分や好みから、日本国内の旅行先を4つ提案してください。
それぞれ異なるエリア・個性の場所を選び、なぜその人に合うかを具体的に伝えてください。`;

export async function POST(req: NextRequest) {
  let input: DiscoverInput;
  try {
    input = await req.json();
  } catch {
    return new Response(JSON.stringify({ __error: 'リクエストの解析に失敗しました' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const moodLabels: Record<string, string> = {
    relax: 'のんびり・ゆっくり',
    active: 'アクティブに動く',
    gourmet: '食を楽しむ',
    adventure: '冒険・非日常',
  };
  const durationLabels: Record<string, string> = {
    'day-trip': '日帰り',
    '1-2nights': '1〜2泊',
    '3plus': '3泊以上',
  };
  const budgetLabels: Record<string, string> = {
    low: '節約（〜3万円）',
    mid: '普通（3〜10万円）',
    high: '贅沢（10万円〜）',
  };
  const travelLabels: Record<string, string> = {
    solo: 'ひとり旅',
    couple: 'カップル',
    friends: '友達グループ',
    family: '家族',
  };

  const prompt = `以下の条件から、日本国内の旅行先を4つ提案してください。

【旅行者のプロフィール】
- 旅のスタイル: ${travelLabels[input.travelType] ?? input.travelType}
- 気分: ${moodLabels[input.mood] ?? input.mood}
- 興味テーマ: ${input.themes.join('、')}
- 期間: ${durationLabels[input.duration] ?? input.duration}
- 予算感: ${budgetLabels[input.budget] ?? input.budget}
${input.season ? `- 季節: ${input.season}` : ''}

4つの提案はそれぞれ異なる地域・個性を持つ場所にしてください。
有名な観光地だけでなく、穴場や意外な選択肢も含めてください。

以下のJSON形式のみで回答してください：

{
  "suggestions": [
    {
      "region": "都道府県のキー（例：kyoto, okinawa, hokkaido）",
      "regionLabel": "都道府県名（例：京都府）",
      "emoji": "その場所を表すemoji1つ",
      "title": "キャッチーなタイトル（例：歴史と美食の古都）",
      "tagline": "一言キャッチコピー（例：何度来ても飽きない、日本の原点）",
      "reason": "この人に特におすすめな理由（2文、具体的に）",
      "highlights": ["見どころ・体験1", "見どころ・体験2", "見どころ・体験3"],
      "bestFor": "こんな人に特におすすめ（1文）"
    }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('JSONが見つかりませんでした');

    const result = JSON.parse(match[0]);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ __error: msg }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
