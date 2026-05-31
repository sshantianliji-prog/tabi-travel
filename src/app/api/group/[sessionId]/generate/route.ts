import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSessionPlan } from '@/lib/group-store';
import {
  TRAVEL_TYPE_LABELS,
  DURATION_LABELS,
  BUDGET_LABELS,
  REGION_LABELS,
  INTEREST_LABELS,
  ACCOMMODATION_LABELS,
  TRAVEL_STYLE_LABELS,
  SEASON_LABELS,
} from '@/types/travel';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PERSONA_SYSTEM = `あなたは「タビ」という名前の日本旅行コンシェルジュAIです。

【タビのキャラクター】
- 名前: タビ（旅の案内人）
- 口調: 自然な敬語ベースで、ところどころフレンドリーに。「〜ですよ！」「実はここ、すごく良くて」「正直に言うと〜」など本音ベースで話す。
- 個性:
  • 日本全国を熟知したプロのソムリエのような博識さを持つ
  • 地元の人しか知らないような穴場・裏情報を持っている
  • インスタ映えスポットやトレンドにも敏感で若い世代にも刺さる提案ができる
  • 「本当に行ったことがある人」のようなリアリティと熱量で語る
  • 家族連れから20代カップル、60代の夫婦まで、どんな旅行者にも寄り添える
  • 失敗しない旅のために、予算・季節・混雑・予約タイミングまで全力でサポートする

【タビの使命】
旅行者が「まるで信頼できる旅仲間に相談したみたい」と感じるプランを届けること。
情報提供にとどまらず、旅の感動・体験・思い出まで一緒に設計する。`;

export async function POST(_req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'セッションが見つかりません' }, { status: 404 });

  const memberSummaries = session.members
    .map((m) => {
      const p = m.preferences;
      const interests = p.interests.map((i) => INTEREST_LABELS[i]).join('、');
      const accommodation = p.accommodationType ? ACCOMMODATION_LABELS[p.accommodationType] : '未指定';
      const style = p.travelStyle ? TRAVEL_STYLE_LABELS[p.travelStyle] : '未指定';
      const season = p.season ? SEASON_LABELS[p.season] : '未指定';
      return `- ${m.name}：${TRAVEL_TYPE_LABELS[p.travelType]}、${DURATION_LABELS[p.duration]}、予算${BUDGET_LABELS[p.budget]}、${REGION_LABELS[p.region]}、興味：${interests}、宿泊：${accommodation}、スタイル：${style}、季節：${season}`;
    })
    .join('\n');

  const prompt = `以下の${session.members.length}人のグループ全員が満足できる最適な旅行プランを作成してください。

【重要】ホテル・旅館・レストラン・観光スポットはすべて実在する具体的な名前を記載してください。住所や最寄り駅も含めること。

【グループメンバーの希望】
${memberSummaries}

全員の希望を考慮し、バランスの取れたプランを提案してください。異なる希望がある場合は賢くミックスしてください。
summaryはタビらしい熱量ある言葉で、グループ全員が楽しめる理由を伝えること。
bookingAdviceには失敗しないための本音のアドバイスを含めること。

【出力形式】
以下のJSON形式のみで回答してください。余計な説明文は不要です。

{
  "title": "旅行プランのタイトル（グループ向けの魅力的なキャッチコピー）",
  "destination": "目的地（都市名・エリア名）",
  "summary": "このプランの魅力とグループ全員が楽しめる理由をタビらしく2〜3文で説明",
  "days": [
    {
      "day": 1,
      "theme": "その日のテーマ",
      "schedule": [
        {
          "time": "時間帯（例：9:00）",
          "place": "実在するスポット・施設・お店の正確な名前",
          "address": "住所または最寄り駅・エリア名",
          "description": "何をするか・見どころ・おすすめメニューや体験（2〜3文）",
          "price": "目安金額",
          "type": "spot | meal | stay | transport"
        }
      ]
    }
  ],
  "tips": ["知らないと損するグループ旅のコツ・季節アドバイス（4〜6個）"],
  "estimatedCost": "概算費用の詳細な内訳（宿泊・食事・交通・観光等、1人あたり合計）",
  "bookingAdvice": "失敗しないための本音の予約アドバイス（何ヶ月前・どのサイト・注意点）"
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: PERSONA_SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON parse failed');

    const plan = JSON.parse(jsonMatch[0]);
    setSessionPlan(sessionId, plan);
    return NextResponse.json({ plan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'プランの生成に失敗しました' }, { status: 500 });
  }
}
