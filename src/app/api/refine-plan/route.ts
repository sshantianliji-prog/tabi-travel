import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `あなたは「タビ」という名前の日本旅行コンシェルジュAIです。
ユーザーから既存の旅行プランへの修正リクエストが届きます。
リクエストを反映した修正版プランをJSON形式で返してください。
元のプランの良い部分はそのまま活かしつつ、リクエストに応じて改善してください。
必ず実在する施設名・スポット名を使用してください。`;

export async function POST(req: NextRequest) {
  let body: { plan: unknown; message: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ __error: 'リクエストの解析に失敗しました' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const { plan, message } = body;

  const prompt = `以下の旅行プランに対して、ユーザーからリクエストが届きました。

【現在のプラン】
${JSON.stringify(plan, null, 2)}

【ユーザーのリクエスト】
${message}

リクエストを反映した修正版プランを、元のJSON形式のまま返してください。
変更した箇所はリクエストに沿って改善し、関係ない部分はそのまま維持してください。
JSON形式のみで回答してください。説明文は不要です。`;

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = msg.content[0].type === 'text' ? msg.content[0].text : '';
    const cleaned = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      return new Response(JSON.stringify({ __error: 'プランの修正に失敗しました' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    let refined: unknown;
    try {
      refined = JSON.parse(match[0]);
    } catch {
      return new Response(JSON.stringify({ __error: 'プランの解析に失敗しました' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(refined), {
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
