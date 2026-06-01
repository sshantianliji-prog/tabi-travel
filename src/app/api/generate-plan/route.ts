import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import {
  TravelPreferences,
  TRAVEL_TYPE_LABELS,
  DURATION_LABELS,
  BUDGET_LABELS,
  REGION_LABELS,
  INTEREST_LABELS,
  ACCOMMODATION_LABELS,
  TRAVEL_STYLE_LABELS,
  SEASON_LABELS,
  TRANSPORT_METHOD_LABELS,
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

【話し方の例】
- 「このルート、実は地元の人もよく使う穴場なんです」
- 「この時期に行くなら、ここだけは絶対外せないですよ！」
- 「予算を考えると、正直〜の方がコスパが断然いいと思います」
- 「インスタ映えなら〜がベストショットが撮れます」

【タビの使命】
旅行者が「まるで信頼できる旅仲間に相談したみたい」と感じるプランを届けること。
情報提供にとどまらず、旅の感動・体験・思い出まで一緒に設計する。`;

function buildPrompt(prefs: TravelPreferences): string {
  const interests = prefs.interests.map((i) => INTEREST_LABELS[i]).join('、');
  const departure = prefs.departureRegion ? REGION_LABELS[prefs.departureRegion] : null;

  const transportMethodLabel = prefs.transportMethod && prefs.transportMethod !== 'any'
    ? TRANSPORT_METHOD_LABELS[prefs.transportMethod]
    : null;

  const transportLine = departure
    ? `- 出発地: ${departure}（往復交通費を予算に含めること）`
    : `- 出発地: 指定なし（交通費は現地移動分のみ）`;

  const transportMethodLine = transportMethodLabel
    ? `- 移動手段: ${transportMethodLabel}（この移動手段を使ったルートでプランを作成すること。スケジュールの最初に乗車・搭乗情報と費用を記載すること）`
    : '';

  const dateLine = prefs.travelDate
    ? `- 旅行開始日: ${prefs.travelDate}（この日程に合わせたイベント・季節情報を反映すること）`
    : '';

  return `以下の旅行条件に合わせて、実在する具体的な施設・お店・スポット名を使ったリアルで魅力的な旅行プランを作成してください。

【旅行条件】
- 旅行タイプ: ${TRAVEL_TYPE_LABELS[prefs.travelType]}${prefs.groupSize ? `（${prefs.groupSize}人）` : ''}
- 期間: ${DURATION_LABELS[prefs.duration]}
- 予算: ${BUDGET_LABELS[prefs.budget]}（1人あたり・往復交通費含む総額）
${transportLine}
${transportMethodLine}
- 目的地: ${REGION_LABELS[prefs.region]}
${dateLine}
- 興味・テーマ: ${interests}
- 宿泊スタイル: ${prefs.accommodationType ? ACCOMMODATION_LABELS[prefs.accommodationType] : '指定なし'}
- 旅のスタイル: ${prefs.travelStyle ? TRAVEL_STYLE_LABELS[prefs.travelStyle] : '指定なし'}
- 季節: ${prefs.season ? SEASON_LABELS[prefs.season] : '指定なし'}

【重要な制約】
- ホテル・旅館は必ず実在する施設名を記載すること（例：「ホテルオークラ東京」「星野リゾート界 箱根」「旅館 竹林庵 みずの」など）
- レストラン・食事処も実在するお店の名前を記載すること（例：「すきやばし次郎」「錦市場 三木鶏卵」「函館朝市 えびすや」など）
- 観光スポットも正確な名称で記載すること（例：「嵐山 天龍寺」「美瑛町 青い池」など）
- 価格帯・予算条件に合った実在施設を選ぶこと（往復交通費を差し引いた残額で宿泊・食事・観光を設計）
- 季節に合ったスポット・イベントを提案すること
${departure ? `- 出発地から目的地への往復交通手段（新幹線・飛行機・高速バス等）と概算費用を最初のスケジュールに必ず含めること` : ''}
- summaryフィールドはタビらしい熱量ある言葉で、旅の魅力を伝えること
- tipsはプロの視点から「知らないと損する」実践的なアドバイスを入れること
- bookingAdviceには正直な混雑情報・失敗しないための本音のアドバイスを含めること

【出力形式】
以下のJSON形式のみで回答してください。余計な説明文は不要です。

{
  "title": "旅行プランのタイトル（魅力的なキャッチコピー）",
  "destination": "目的地（都市名・エリア名）",
  "summary": "このプランの魅力をタビらしい熱量で2〜3文で説明",
  "days": [
    {
      "day": 1,
      "theme": "その日のテーマ",
      "schedule": [
        {
          "time": "時間帯（例：9:00）",
          "place": "実在するスポット・施設・お店・交通機関の正確な名前",
          "address": "住所または最寄り駅・エリア名",
          "description": "何をするか・見どころ・おすすめメニューや体験（2〜3文）",
          "price": "目安金額（例：ランチ1,200円程度・新幹線往復26,000円等）",
          "type": "spot | meal | stay | transport"
        }
      ]
    }
  ],
  "tips": ["知らないと損する実践的なアドバイス（4〜6個）"],
  "estimatedCost": "概算費用の詳細な内訳（往復交通費・宿泊・食事・観光入場料等、1人あたり合計）",
  "bookingAdvice": "失敗しないための本音の予約アドバイス（何ヶ月前・どのサイト・交通チケットの注意点）"
}`;
}

export async function POST(req: NextRequest) {
  let prefs: TravelPreferences;
  try {
    const bodyText = await req.text();
    prefs = JSON.parse(bodyText);
  } catch {
    return new Response(JSON.stringify({ __error: 'リクエストの解析に失敗しました' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      system: PERSONA_SYSTEM,
      messages: [{ role: 'user', content: buildPrompt(prefs) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      return new Response(JSON.stringify({ __error: 'JSONが見つかりませんでした' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    let plan: unknown;
    try {
      plan = JSON.parse(match[0]);
    } catch {
      if (message.stop_reason === 'max_tokens') {
        return new Response(JSON.stringify({ __error: 'プランが長すぎてトークン上限に達しました。もう一度お試しください。' }), {
          status: 500, headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ __error: 'JSONの解析に失敗しました。もう一度お試しください。' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }
    const serialized = JSON.stringify(plan);
    return new Response(serialized, {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log('[generate-plan] error:', msg);
    return new Response(JSON.stringify({ __error: msg }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
