import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "タビ — AI旅行コンシェルジュ | 無料で最高の旅行プランを作成",
  description: "老若男女みんなの旅行をもっと気軽に。選ぶだけでAIが実在するホテル・レストラン・観光スポットを組み合わせたリアルな旅行プランを無料で作成します。グループ旅行にも対応。",
  keywords: ["旅行プラン", "AI旅行", "日本旅行", "旅行計画", "タビ", "旅行コンシェルジュ", "グループ旅行", "国内旅行"],
  openGraph: {
    title: "タビ — AI旅行コンシェルジュ | 無料で最高の旅行プランを作成",
    description: "選ぶだけでAIが実在するホテル・レストラン・観光スポットを組み合わせたリアルな旅行プランを無料で作成。老若男女みんなの旅行をもっと気軽に。",
    siteName: "タビ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "タビ — AI旅行コンシェルジュ",
    description: "選ぶだけでAIがリアルな旅行プランを無料で作成。グループ旅行にも対応。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
