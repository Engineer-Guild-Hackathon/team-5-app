import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "カタカナLANGUAGE",
  description: "言語の読み方の学習サイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className="w-screen h-screen"
      >
        {children}
      </body>
    </html>
  );
}
