import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "@/lib/providers";

export const metadata: Metadata = {
  title: "Feel-Archive",
  description: "공간 기반 감정 아카이빙 플랫폼. 내 감정을 기록하고, 누군가의 위로를 발견하세요.",
  openGraph: {
    title: "Feel-Archive",
    description: "공간 기반 감정 아카이빙 플랫폼. 내 감정을 기록하고, 누군가의 위로를 발견하세요.",
    url: "https://feel-archive.vercel.app",
    siteName: "Feel-Archive",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Feel-Archive - 공간 기반 감정 아카이빙 플랫폼",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feel-Archive",
    description: "공간 기반 감정 아카이빙 플랫폼. 내 감정을 기록하고, 누군가의 위로를 발견하세요.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false&libraries=services`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
