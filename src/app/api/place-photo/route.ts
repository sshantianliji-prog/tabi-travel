import { NextRequest, NextResponse } from 'next/server';

// Unsplash source URL（APIキー不要）でキーワードに合った写真を取得
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? 'japan travel';
  const width = searchParams.get('w') ?? '600';
  const height = searchParams.get('h') ?? '400';

  // キーワードをエンコードして Unsplash source URL を生成
  const encoded = encodeURIComponent(`japan ${query}`);
  const unsplashUrl = `https://source.unsplash.com/featured/${width}x${height}/?${encoded}`;

  try {
    const res = await fetch(unsplashUrl, { redirect: 'follow', signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('fetch failed');

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') ?? 'image/jpeg';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // 1日キャッシュ
      },
    });
  } catch {
    // フォールバック：1px透明画像を返す
    return new NextResponse(null, { status: 404 });
  }
}
