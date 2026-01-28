import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "@/lib/providers";

export const metadata: Metadata = {
  title: "Feel-Archive",
  description: "공간 기반 감정 아카이빙 플랫폼",
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
