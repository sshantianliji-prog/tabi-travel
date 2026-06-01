import { NextRequest, NextResponse } from 'next/server';

// Wikipedia REST APIで場所の写真を取得（APIキー不要）
async function fetchWikipediaPhoto(query: string): Promise<string | null> {
  const cleanQuery = query.replace(/\s*\(.*?\)\s*/g, '').trim();

  // 試すキーワードリスト（元のクエリ→最初の単語→地域名）
  const candidates: string[] = [cleanQuery];
  const firstWord = cleanQuery.split(/\s|　/)[0];
  if (firstWord && firstWord !== cleanQuery) candidates.push(firstWord);

  for (const keyword of candidates) {
    // まず日本語Wikipediaを試す
    try {
      const jaRes = await fetch(
        `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(keyword)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (jaRes.ok) {
        const data = await jaRes.json() as { thumbnail?: { source?: string }; type?: string };
        if (data.thumbnail?.source && data.type !== 'disambiguation') {
          return data.thumbnail.source;
        }
      }
    } catch { /* continue */ }

    // 英語Wikipediaも試す
    try {
      const enRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(keyword)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (enRes.ok) {
        const data = await enRes.json() as { thumbnail?: { source?: string }; type?: string };
        if (data.thumbnail?.source && data.type !== 'disambiguation') {
          return data.thumbnail.source;
        }
      }
    } catch { /* continue */ }
  }
  return null;
}

// 食事・宿泊・スポットのカテゴリ別フォールバッククエリ
function getFallbackQuery(query: string, type?: string): string {
  const lower = query.toLowerCase();
  if (type === 'meal' || lower.includes('食') || lower.includes('料理') || lower.includes('寿司') || lower.includes('ラーメン') || lower.includes('そば') || lower.includes('うどん') || lower.includes('パフェ') || lower.includes('カフェ')) {
    return '日本料理';
  }
  if (type === 'stay' || lower.includes('ホテル') || lower.includes('旅館') || lower.includes('resort') || lower.includes('リゾート')) {
    return '旅館';
  }
  if (lower.includes('温泉') || lower.includes('onsen')) return '温泉';
  if (lower.includes('神社') || lower.includes('shrine')) return '神社';
  if (lower.includes('寺') || lower.includes('temple')) return '寺院';
  if (lower.includes('城') || lower.includes('castle')) return '城';
  if (lower.includes('海') || lower.includes('海岸') || lower.includes('beach')) return '日本の海岸';
  if (lower.includes('山') || lower.includes('mountain')) return '日本の山';
  if (lower.includes('市場') || lower.includes('market')) return '市場';
  return '日本観光地';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? '日本観光地';
  const type = searchParams.get('type') ?? '';

  // 1. Wikipedia APIで直接検索
  let photoUrl = await fetchWikipediaPhoto(query);

  // 2. 見つからなければカテゴリで再検索
  if (!photoUrl) {
    const fallback = getFallbackQuery(query, type);
    photoUrl = await fetchWikipediaPhoto(fallback);
  }

  // 3. それでも見つからなければ最終フォールバック
  if (!photoUrl) {
    photoUrl = await fetchWikipediaPhoto('日本観光');
  }

  if (!photoUrl) {
    return new NextResponse(null, { status: 404 });
  }

  // Wikipedia画像URLにproxy経由でアクセス（CORSとリファラ対策）
  try {
    const imgRes = await fetch(photoUrl, {
      headers: { 'User-Agent': 'TabiTravelApp/1.0 (https://travel-planner-delta-five.vercel.app)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!imgRes.ok) throw new Error('image fetch failed');

    const buffer = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get('content-type') ?? 'image/jpeg';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800', // 7日キャッシュ
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
