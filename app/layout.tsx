import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "결 — 사주와 타로의 기록",
  description: "결정론적 계산 엔진과 규칙 기반 해석으로 만나는 사주·타로 리딩",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
